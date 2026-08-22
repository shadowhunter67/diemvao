import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { ThptSubjectContext } from '../thptThresholdOnly';
import { getBestDavInternationalTestConversion, getBestDavLanguageConversion, type DavConversionBand } from './conversion';
import { davAdmissionMethods, type DavMethodId } from './methods';
import { getDavProgram } from './programs';

export interface DavEvaluationContext {
  methodId?: DavMethodId;
  programCode?: string;
  subjectContext?: ThptSubjectContext;
  useEnglishCertificateForThpt?: boolean;
  transcriptSubjects?: readonly SubjectId[];
}

interface ScoreResult {
  total?: number;
  missingInputs?: string[];
  missingRequirements?: MissingRequirement[];
  reasons?: string[];
  explanation?: CalculationStep[];
}

const methodById = Object.fromEntries(davAdmissionMethods.map((method) => [method.id, method]));
const METHOD_IDS = new Set(davAdmissionMethods.map((method) => method.id));
const LAW_PROGRAM_CODES = new Set(['HQT04', 'HQT07']);

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function result(params: {
  methodId: DavMethodId;
  status: 'eligible' | 'ineligible' | 'unknown';
  reasons: string[];
  missingInputs?: string[];
  missingRequirements?: MissingRequirement[];
  explanation?: CalculationStep[];
  evidenceLocation?: string;
}): AdmissionEvaluation {
  const method = methodById[params.methodId] ?? davAdmissionMethods[3];
  const gapRequirements =
    method.knowledgeGaps?.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })) ?? [];
  return {
    schoolId: 'dav',
    year: 2026,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status: params.status, reasons: params.reasons },
    missingInputs: params.missingInputs ?? [],
    missingRules: method.knowledgeGaps?.map((gap) => gap.label) ?? [],
    missingRequirements: [...(params.missingRequirements ?? []), ...gapRequirements],
    explanation: params.explanation ?? [],
    evidence: [
      {
        sourceId: 'dav-threshold-conversion-pdf-2026',
        location: params.evidenceLocation ?? 'PDF pages 1-3, threshold and conversion notice',
        verification: 'verified',
        effectiveYear: 2026,
      },
    ],
  };
}

function subjectScore(profile: ApplicantProfile, subjectId: SubjectId, options: { allowEnglishCertificate: boolean }): number | undefined {
  const rawScore = profile.thpt?.scores?.[subjectId];
  if (subjectId !== 'english' || !options.allowEnglishCertificate) return rawScore;
  const certificate = getBestDavLanguageConversion(profile);
  if (!certificate) return rawScore;
  return rawScore === undefined ? certificate.convertedScore : Math.max(rawScore, certificate.convertedScore);
}

function thptTotal(profile: ApplicantProfile, subjects: readonly SubjectId[], options: { allowEnglishCertificate: boolean }): ScoreResult {
  let total = 0;
  const missing: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = subjectScore(profile, subjectId, options);
    if (score === undefined) missing.push(subjectId);
    else total += score;
  }
  if (missing.length > 0) {
    return {
      missingInputs: ['Missing THPT scores for the selected DAV subject combination.'],
      missingRequirements: missing.map((subjectId) => ({
        kind: 'profile-input',
        code: `dav-thpt-${subjectId}`,
        label: `THPT score for ${SUBJECT_LABELS[subjectId]}.`,
      })),
      reasons: ['DAV needs all three subject scores before this threshold can be checked.'],
    };
  }
  return { total: round2(total) };
}

function transcriptAverage(profile: ApplicantProfile, subjectId: SubjectId): number | undefined {
  const scores = [
    profile.transcript?.grade10?.[subjectId],
    profile.transcript?.grade11?.[subjectId],
    profile.transcript?.grade12?.[subjectId],
  ];
  if (scores.some((score) => score === undefined)) return undefined;
  return (scores[0]! + scores[1]! + scores[2]!) / 3;
}

function transcriptEligibility(profile: ApplicantProfile, subjects: readonly SubjectId[] | undefined): ScoreResult {
  if (!subjects || subjects.length !== 2) {
    return {
      reasons: ['DAV method 2 needs the two non-language transcript subjects used for admission.'],
      missingRequirements: [{ kind: 'school-context', code: 'dav-transcript-subjects', label: 'Select the two non-language DAV transcript subjects.' }],
    };
  }

  const missing: SubjectId[] = [];
  const low: string[] = [];
  for (const subjectId of subjects) {
    const average = transcriptAverage(profile, subjectId);
    if (average === undefined) missing.push(subjectId);
    else if (round2(average) < 8.5) low.push(`${SUBJECT_LABELS[subjectId]} ${round2(average)}`);
  }
  if (missing.length > 0) {
    return {
      missingInputs: ['Missing transcript averages for DAV method 2.'],
      missingRequirements: missing.map((subjectId) => ({
        kind: 'profile-input',
        code: `dav-transcript-${subjectId}`,
        label: `Grade 10/11/12 transcript score for ${SUBJECT_LABELS[subjectId]}.`,
      })),
      reasons: ['DAV method 2 needs grade 10/11/12 transcript scores for both non-language subjects.'],
    };
  }
  if (low.length > 0) {
    return { total: 0, reasons: [`Transcript subject average below DAV method 2 minimum 8.5: ${low.join(', ')}.`] };
  }
  return { total: 1 };
}

function languageCertificate(profile: ApplicantProfile): DavConversionBand | undefined {
  return getBestDavLanguageConversion(profile);
}

function languageCertificateRequirement(profile: ApplicantProfile): ScoreResult {
  const converted = languageCertificate(profile);
  if (!converted) {
    return {
      missingInputs: ['Missing DAV-supported language certificate score.'],
      missingRequirements: [{ kind: 'profile-input', code: 'dav-language-certificate', label: 'IELTS 6.0+ or TOEFL iBT 60+ for DAV language-certificate methods.' }],
      reasons: ['DAV methods 2 and 3 need a valid language certificate before threshold eligibility can be checked.'],
    };
  }
  return { total: converted.convertedScore };
}

function lawConstraint(profile: ApplicantProfile, context: DavEvaluationContext): ScoreResult {
  if (!context.programCode || !LAW_PROGRAM_CODES.has(context.programCode)) return { total: 1 };
  if (!context.subjectContext) {
    return {
      reasons: ['DAV law-field programs need a selected subject combination for Math/Literature constraints.'],
      missingRequirements: [{ kind: 'school-context', code: 'dav-law-subject-combination', label: 'Select a DAV subject combination for law-field threshold checking.' }],
    };
  }

  const rawTotal = thptTotal(profile, context.subjectContext.subjects, { allowEnglishCertificate: false });
  if (rawTotal.total === undefined) return rawTotal;
  if (rawTotal.total < 22) return { total: 0, reasons: [`Raw THPT total ${rawTotal.total}/30 is below the DAV law-field minimum 22/30.`] };

  const hasMath = context.subjectContext.subjects.includes('math');
  const hasLiterature = context.subjectContext.subjects.includes('literature');
  const math = profile.thpt?.scores?.math;
  const literature = profile.thpt?.scores?.literature;
  if (hasMath && hasLiterature) {
    if (math === undefined || literature === undefined) {
      return {
        reasons: ['DAV law-field programs need both Math and Literature scores for this combination.'],
        missingRequirements: [{ kind: 'profile-input', code: 'dav-law-math-literature', label: 'THPT Math and Literature scores.' }],
      };
    }
    return math + literature >= 12
      ? { total: 1 }
      : { total: 0, reasons: [`Math + Literature ${round2(math + literature)} is below DAV law-field minimum 12.`] };
  }
  if (hasMath) {
    if (math === undefined) return { reasons: ['DAV law-field programs need Math score for this combination.'] };
    return math >= 6 ? { total: 1 } : { total: 0, reasons: [`Math ${math} is below DAV law-field minimum 6.`] };
  }
  if (hasLiterature) {
    if (literature === undefined) return { reasons: ['DAV law-field programs need Literature score for this combination.'] };
    return literature >= 6 ? { total: 1 } : { total: 0, reasons: [`Literature ${literature} is below DAV law-field minimum 6.`] };
  }
  return { total: 1 };
}

function thresholdFor(context: DavEvaluationContext): number {
  if (context.methodId === 'dav-sat-act-certificate-2026') return 25;
  if (context.subjectContext?.combinationId === 'C00' && !LAW_PROGRAM_CODES.has(context.programCode ?? '')) return 23;
  return 22;
}

function evaluateThptThreshold(profile: ApplicantProfile, context: DavEvaluationContext): ScoreResult {
  if (!context.subjectContext) {
    return {
      reasons: ['DAV needs a selected subject combination before this threshold can be checked.'],
      missingRequirements: [{ kind: 'school-context', code: 'dav-subject-combination', label: 'Select a DAV subject combination.' }],
    };
  }
  const score = thptTotal(profile, context.subjectContext.subjects, { allowEnglishCertificate: context.useEnglishCertificateForThpt === true });
  if (score.total === undefined) return score;
  const threshold = thresholdFor(context);
  return {
    total: score.total,
    explanation: [
      {
        id: 'dav-threshold-check',
        label: `DAV 2026 threshold for ${context.subjectContext.combinationId}`,
        output: score.total,
        scale: 30,
        formula: 'Compare selected THPT combination total with the published DAV intake threshold.',
        evidence: [{ sourceId: 'dav-threshold-conversion-pdf-2026', location: 'PDF page 1, intake threshold table', verification: 'verified', effectiveYear: 2026 }],
      },
    ],
    reasons: score.total >= threshold ? [] : [`Score ${score.total}/30 is below DAV threshold ${threshold}/30.`],
  };
}

function evaluateMethod3(profile: ApplicantProfile): ScoreResult {
  const language = languageCertificateRequirement(profile);
  if (language.total === undefined) return language;
  const international = getBestDavInternationalTestConversion(profile);
  if (!international) {
    return {
      missingInputs: ['Missing DAV-supported SAT/ACT score.'],
      missingRequirements: [{ kind: 'profile-input', code: 'dav-sat-act', label: 'SAT 1330+ or ACT 29+ for DAV method 3.' }],
      reasons: ['DAV method 3 needs a SAT or ACT score before threshold eligibility can be checked.'],
    };
  }
  const total = round2(language.total + international.convertedScore);
  return {
    total,
    explanation: [
      {
        id: 'dav-method3-conversion',
        label: 'DAV 2026 method 3 converted score',
        output: total,
        scale: 30,
        formula: 'Language certificate conversion on scale 10 plus SAT/ACT conversion on scale 20.',
        evidence: [{ sourceId: 'dav-admission-info-pdf-2026', location: 'PDF pages 14-15, Tables 2 and 3', verification: 'verified', effectiveYear: 2026 }],
      },
    ],
    reasons: total >= 25 ? [] : [`Converted score ${total}/30 is below DAV method 3 threshold 25/30.`],
  };
}

export function evaluateDavAdmission(profile: ApplicantProfile, context: DavEvaluationContext = {}): AdmissionEvaluation {
  const methodId = context.methodId ?? 'dav-thpt-exam-2026';
  if (!METHOD_IDS.has(methodId)) {
    return result({
      methodId: 'dav-thpt-exam-2026',
      status: 'unknown',
      reasons: ['Select a supported DAV 2026 admission method.'],
      missingRequirements: [{ kind: 'school-context', code: 'dav-method', label: 'Select a supported DAV method.' }],
    });
  }

  const program = getDavProgram(context.programCode);
  if (!program) {
    return result({
      methodId,
      status: 'unknown',
      reasons: ['Select a DAV program to apply program-specific scope and law-field constraints.'],
      missingRequirements: [{ kind: 'school-context', code: 'dav-program', label: 'Select a DAV program.' }],
    });
  }

  if (methodId === 'dav-priority-2026') {
    return result({
      methodId,
      status: 'unknown',
      reasons: ['DAV direct/priority categories are source-decomposed but not executable from the shared applicant profile.'],
      missingRequirements: [{ kind: 'official-rule', code: 'dav-priority-applicant-category-input', label: 'DAV direct/priority applicant category input is not modeled.' }],
    });
  }

  const law = lawConstraint(profile, context);
  if (law.total === undefined) {
    return result({ methodId, status: 'unknown', reasons: law.reasons ?? [], missingInputs: law.missingInputs, missingRequirements: law.missingRequirements });
  }
  if (law.total === 0) return result({ methodId, status: 'ineligible', reasons: law.reasons ?? [] });

  let score: ScoreResult;
  if (methodId === 'dav-sat-act-certificate-2026') {
    score = evaluateMethod3(profile);
  } else {
    if (methodId === 'dav-transcript-certificate-2026') {
      const certificate = languageCertificateRequirement(profile);
      if (certificate.total === undefined) {
        return result({ methodId, status: 'unknown', reasons: certificate.reasons ?? [], missingInputs: certificate.missingInputs, missingRequirements: certificate.missingRequirements });
      }
      const transcript = transcriptEligibility(profile, context.transcriptSubjects);
      if (transcript.total === undefined) {
        return result({ methodId, status: 'unknown', reasons: transcript.reasons ?? [], missingInputs: transcript.missingInputs, missingRequirements: transcript.missingRequirements });
      }
      if (transcript.total === 0) return result({ methodId, status: 'ineligible', reasons: transcript.reasons ?? [] });
    }
    score = evaluateThptThreshold(profile, context);
  }

  if (score.total === undefined) {
    return result({ methodId, status: 'unknown', reasons: score.reasons ?? [], missingInputs: score.missingInputs, missingRequirements: score.missingRequirements });
  }

  const threshold = thresholdFor(context);
  if (score.total < threshold) {
    return result({ methodId, status: 'ineligible', reasons: score.reasons ?? [`Score ${score.total}/30 is below DAV threshold ${threshold}/30.`], explanation: score.explanation });
  }

  return result({
    methodId,
    status: 'eligible',
    reasons: [
      `Score ${score.total}/30 meets DAV's published threshold ${threshold}/30 for ${program.programCode}.`,
      'This is not a final admission-score guarantee; DAV bonus, national priority, cutoff equivalence, and tie-break rules remain modeled as limitations.',
    ],
    explanation: score.explanation,
  });
}
