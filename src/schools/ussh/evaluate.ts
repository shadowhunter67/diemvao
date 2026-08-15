import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { UsshSubjectContext } from './applicantProfileAdapter';
import { buildUsshEvaluationInput } from './applicantProfileAdapter';
import { checkUsshDgnlThreshold, checkUsshThptThreshold, checkUsshTranscriptThreshold } from './eligibility';
import { usshAdmissionMethods } from './methods';
import { usshKnowledgeGaps } from './knowledgeGaps';
import { usshThresholdEvidence, usshDt3FormulaEvidence, usshDhl1Dhl2FormulaEvidence, usshPriorityTableEvidence } from './evidence';
import { calculateUsshBestDhl } from './calculator';
import { calculateUsshBonus } from './bonus';
import { calculateUsshEffectivePriority } from './priorityReduction';
import { lookupUsshStandardPriority } from './priority';

export interface UsshEvaluationContext {
  subjectContext?: UsshSubjectContext;
  /** Thí sinh có thuộc ÍT NHẤT 1 trong 3 Nhóm thành tích được cộng điểm hay không — undefined/false
   * nghĩa là "không có" (ĐC=0, tính chính xác được). `true` -> điểm cộng chưa xác định được số cụ
   * thể, kết quả cuối vẫn `partial`. Xem `bonus.ts`. */
  hasBonusAchievement?: boolean;
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

  const dhl = calculateUsshBestDhl({
    thptRawTotal30: input.thptRawTotal30,
    dgnlRaw1200: input.dgnlRaw1200,
    transcriptTotal30: input.transcriptTotal30,
  });

  const dhlEvidence = dhl?.applicantType === 'DT3' ? usshDt3FormulaEvidence.evidence : usshDhl1Dhl2FormulaEvidence.evidence;

  if (dhl) {
    const formulaText =
      dhl.applicantType === 'DT1'
        ? '0.45×[THPT×100/30] + 0.45×[ĐGNL×100/1200] + 0.10×[HB×100/30]'
        : dhl.applicantType === 'DT2'
          ? '0.90×[THPT×100/30] + 0.10×[HB×100/30]'
          : '0.90×[ĐGNL×100/1200] + 0.10×[HB×100/30]';
    explanation.push({
      id: 'ussh-dhl-score',
      label: `Điểm học lực (${dhl.applicantType})`,
      inputs: {
        ...(input.thptRawTotal30 !== undefined ? { thptRawTotal30: input.thptRawTotal30 } : {}),
        ...(input.dgnlRaw1200 !== undefined ? { dgnlRaw1200: input.dgnlRaw1200 } : {}),
        ...(input.transcriptTotal30 !== undefined ? { transcriptTotal30: input.transcriptTotal30 } : {}),
      },
      output: dhl.scoreBeforeBonusAndPriority,
      scale: 100,
      formula: formulaText,
      description: 'Điểm học lực (ĐHL) — CHƯA gồm Điểm cộng/Điểm ưu tiên.',
      evidence: dhlEvidence,
    });

    const bonus = calculateUsshBonus(context.hasBonusAchievement);
    explanation.push({
      id: 'ussh-bonus',
      label: 'Điểm cộng USSH',
      output: bonus.awardedPoints100,
      scale: 100,
      formula: bonus.supported ? 'Không có thành tích được cộng điểm -> ĐC = 0' : 'Có thành tích -> mức cộng cụ thể chưa công bố',
      description: bonus.supported ? undefined : 'Trường chỉ công bố mức trần theo Nhóm thành tích, chưa công bố mức cộng cụ thể — xem knowledgeGaps.',
    });

    if (bonus.supported) {
      const totalIncludingBonus = Math.min(100, dhl.scoreBeforeBonusAndPriority + bonus.awardedPoints100);
      const standardPriority = lookupUsshStandardPriority(profile.priority?.region, profile.priority?.category);
      const priority = calculateUsshEffectivePriority({ totalIncludingBonus, standardPriority });
      const finalScore = Math.round(Math.min(100, totalIncludingBonus + priority.effectivePriority) * 100) / 100;

      explanation.push(
        {
          id: 'ussh-priority',
          label: priority.reduced ? 'Điểm ưu tiên USSH (đã giảm)' : 'Điểm ưu tiên USSH',
          output: priority.effectivePriority,
          scale: 100,
          formula: priority.reduced
            ? '[(100 - Tổng điểm đã gồm ĐC) / 25] × Mức điểm ưu tiên KV/ĐT'
            : 'Mức điểm ưu tiên khu vực/đối tượng (chưa giảm)',
          evidence: usshPriorityTableEvidence.evidence,
        },
        {
          id: 'ussh-final',
          label: `Điểm xét tuyển cuối cùng USSH (${dhl.applicantType})`,
          output: finalScore,
          scale: 100,
        }
      );
    }
  } else if (input.dgnlRaw1200 !== undefined || input.transcriptTotal30 !== undefined) {
    if (input.transcriptTotal30 === undefined) {
      missingInputs.push('Điểm học bạ tổ hợp (thang 30) để tính Điểm học lực.');
      missingRequirements.push({ kind: 'profile-input', code: 'ussh-dhl-transcript', label: 'Điểm học bạ tổ hợp (thang 30).' });
    }
  }

  missingRequirements.push(
    ...usshKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label }))
  );

  const finalStep = explanation.find((step) => step.id === 'ussh-final');
  if (finalStep?.output !== undefined) {
    return {
      schoolId: 'ussh',
      year: usshAdmissionMethods[0].year,
      methodId: usshAdmissionMethods[0].id,
      confidence: 'exact-verified',
      eligibility: anyChecked
        ? { status: anyIneligible ? 'ineligible' : 'eligible', reasons: eligibilityReasons }
        : { status: 'unknown', reasons: ['Cần điểm ĐGNL hoặc đủ điểm THPT/học bạ theo tổ hợp để kiểm tra ngưỡng.'] },
      score: { value: finalStep.output, scale: 100 },
      missingInputs,
      missingRules: [],
      missingRequirements: missingRequirements.filter((requirement) => requirement.kind !== 'official-rule'),
      explanation,
      evidence: [...usshThresholdEvidence.evidence, ...dhlEvidence, ...usshPriorityTableEvidence.evidence],
    };
  }

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
