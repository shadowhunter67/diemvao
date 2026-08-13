import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { UsshSubjectContext } from './applicantProfileAdapter';
import { buildUsshEvaluationInput } from './applicantProfileAdapter';
import { checkUsshDgnlThreshold, checkUsshThptThreshold, checkUsshTranscriptThreshold } from './eligibility';
import { usshAdmissionMethods } from './methods';
import { usshKnowledgeGaps } from './knowledgeGaps';
import { usshThresholdEvidence } from './evidence';

export interface UsshEvaluationContext {
  subjectContext?: UsshSubjectContext;
}

export function evaluateUsshAdmission(profile: ApplicantProfile, context: UsshEvaluationContext = {}): AdmissionEvaluation {
  const input = buildUsshEvaluationInput(profile, context.subjectContext);
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const eligibilityReasons: string[] = [];
  let anyIneligible = false;
  let anyChecked = false;

  if (input.dgnlRaw1200 !== undefined) {
    const dgnl = checkUsshDgnlThreshold(input.dgnlRaw1200);
    anyChecked = true;
    if (!dgnl.pass) anyIneligible = true;
    eligibilityReasons.push(`${dgnl.requiredText}${dgnl.pass ? ' — đạt' : ' — chưa đạt'}`);
    explanation.push({
      id: 'ussh-dgnl-threshold',
      label: 'ĐGNL so ngưỡng đầu vào',
      inputs: { dgnlRaw1200: input.dgnlRaw1200 },
      formula: dgnl.requiredText,
      evidence: usshThresholdEvidence.evidence,
    });
  }

  if (context.subjectContext && input.thptRawTotal30 !== undefined) {
    const thpt = checkUsshThptThreshold(input.thptRawTotal30);
    anyChecked = true;
    if (!thpt.pass) anyIneligible = true;
    eligibilityReasons.push(`${thpt.requiredText}${thpt.pass ? ' — đạt' : ' — chưa đạt'}`);
    explanation.push({
      id: 'ussh-thpt-threshold',
      label: `THPT ${context.subjectContext.combinationId ?? 'theo tổ hợp'} so ngưỡng đầu vào`,
      inputs: { thptTotal30: input.thptRawTotal30 },
      formula: thpt.requiredText,
      evidence: usshThresholdEvidence.evidence,
    });
  } else if (context.subjectContext) {
    const missingSubjects = context.subjectContext.subjects.filter((subjectId) => profile.thpt?.scores?.[subjectId] === undefined);
    missingInputs.push('Chưa đủ 3 môn THPT trong tổ hợp đã chọn.');
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `ussh-thpt-${subjectId}`,
        label: `Điểm THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp ${context.subjectContext?.combinationId ?? 'đã chọn'}.`,
      }))
    );
  }

  if (context.subjectContext && input.transcriptTotal30 !== undefined) {
    const transcript = checkUsshTranscriptThreshold(input.transcriptTotal30);
    anyChecked = true;
    if (!transcript.pass) anyIneligible = true;
    eligibilityReasons.push(`${transcript.requiredText}${transcript.pass ? ' — đạt' : ' — chưa đạt'}`);
    explanation.push({
      id: 'ussh-transcript-threshold',
      label: `Học bạ ${context.subjectContext.combinationId ?? 'theo tổ hợp'} so ngưỡng đầu vào`,
      inputs: { transcriptTotal30: input.transcriptTotal30 },
      formula: transcript.requiredText,
      evidence: usshThresholdEvidence.evidence,
    });
  }

  if (!context.subjectContext) {
    missingInputs.push('Chưa chọn tổ hợp để kiểm tra ngưỡng THPT/học bạ.');
    missingRequirements.push({ kind: 'school-context', code: 'ussh-subject-combination', label: 'Chọn tổ hợp THPT.' });
  }
  if (input.dgnlRaw1200 === undefined) {
    missingInputs.push('Điểm ĐGNL ĐHQG-HCM để kiểm tra ngưỡng ĐGNL.');
    missingRequirements.push({ kind: 'profile-input', code: 'ussh-dgnl', label: 'Điểm ĐGNL ĐHQG-HCM.' });
  }

  missingRequirements.push(
    ...usshKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))
  );

  return {
    schoolId: 'ussh',
    year: usshAdmissionMethods[0].year,
    methodId: usshAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility: anyChecked
      ? { status: anyIneligible ? 'ineligible' : 'eligible', reasons: eligibilityReasons }
      : { status: 'unknown', reasons: ['Cần điểm ĐGNL hoặc đủ điểm THPT/học bạ theo tổ hợp để kiểm tra ngưỡng.'] },
    missingInputs,
    missingRules: usshKnowledgeGaps.map((gap) => gap.label),
    missingRequirements,
    explanation,
    evidence: usshThresholdEvidence.evidence,
  };
}
