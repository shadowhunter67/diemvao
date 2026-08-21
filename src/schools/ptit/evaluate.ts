import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import { checkPtitDomesticExamThreshold, type PtitDomesticExam } from './eligibility';
import { ptitDomesticExamThresholdEvidence, ptitRawFormulaEvidence } from './evidence';
import { ptitKnowledgeGaps } from './knowledgeGaps';
import { ptitAdmissionMethods } from './methods';

export interface PtitDomesticExamEvaluationContext {
  exam?: PtitDomesticExam;
  rawScore?: number;
}

export function evaluatePtitDomesticExamAdmission(profile: ApplicantProfile, context: PtitDomesticExamEvaluationContext = {}): AdmissionEvaluation {
  const method = ptitAdmissionMethods[0];
  const exam = context.exam ?? 'vact';
  const rawScore = context.rawScore ?? (exam === 'vact' ? profile.exams?.vact?.total : undefined);
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const officialGaps = ptitKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }));

  if (rawScore === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: `ptit-${exam}`, label: `PTIT ${exam.toUpperCase()} 2026 score.` });
    return {
      schoolId: 'ptit',
      year: method.year,
      methodId: method.id,
      confidence: 'unavailable',
      eligibility: { status: 'unknown', reasons: ['Domestic aptitude/thinking exam score is required to check PTIT eligibility.'] },
      missingInputs: ['Missing domestic aptitude/thinking exam score.'],
      missingRules: ptitKnowledgeGaps.map((gap) => gap.label),
      missingRequirements: [...missingRequirements, ...officialGaps],
      explanation,
      evidence: [],
    };
  }

  const threshold = checkPtitDomesticExamThreshold(exam, rawScore);
  explanation.push(
    {
      id: 'ptit-domestic-exam-threshold',
      label: 'PTIT domestic exam eligibility threshold',
      output: rawScore,
      formula: threshold.requiredText,
      evidence: ptitDomesticExamThresholdEvidence.evidence,
    },
    {
      id: 'ptit-raw-score-formula',
      label: 'PTIT raw formula shape',
      output: rawScore,
      formula: 'DXT = DGNL/DGTD score + bonus + priority, before equivalent conversion',
      evidence: ptitRawFormulaEvidence.evidence,
    }
  );

  return {
    schoolId: 'ptit',
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    missingInputs: [],
    missingRules: ptitKnowledgeGaps.map((gap) => gap.label),
    missingRequirements: officialGaps,
    explanation,
    evidence: [...ptitDomesticExamThresholdEvidence.evidence, ...ptitRawFormulaEvidence.evidence],
  };
}

