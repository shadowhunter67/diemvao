import type { AdmissionEvaluation, MissingRequirement } from '../core/admissionEvaluation';
import type { AdmissionMethodDescriptor } from '../core/admissionMethod';
import type { ApplicantProfile } from '../core/applicantProfile';
import type { CalculationStep } from '../core/calculationStep';
import type { KnowledgeGap } from '../core/knowledgeStatus';
import type { SubjectId } from '../core/subjects';
import { SUBJECT_LABELS } from '../core/subjects';

export interface ThptSubjectContext {
  combinationId?: string;
  subjects: readonly SubjectId[];
}

export interface ThresholdBand {
  min30: number;
  max30?: number;
  requiredText: string;
}

export interface ThresholdOnlyEvaluationContext {
  subjectContext?: ThptSubjectContext;
}

function sumThptTotal(profile: ApplicantProfile, subjects: readonly SubjectId[]): { total30?: number; missingSubjects: SubjectId[] } {
  let total = 0;
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) missingSubjects.push(subjectId);
    else total += score;
  }
  if (missingSubjects.length > 0) return { missingSubjects };
  return { total30: Math.round(total * 100) / 100, missingSubjects };
}

function buildGapExtras(gaps: readonly KnowledgeGap[] | undefined): { missingRules: string[]; missingRequirements: MissingRequirement[] } {
  return {
    missingRules: (gaps ?? []).map((gap) => gap.label),
    missingRequirements: (gaps ?? []).map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
  };
}

export function evaluateThptThresholdOnly(params: {
  schoolId: string;
  method: AdmissionMethodDescriptor;
  profile: ApplicantProfile;
  context?: ThresholdOnlyEvaluationContext;
  threshold: ThresholdBand;
  schoolShortName: string;
  evidenceSourceId: string;
}): AdmissionEvaluation {
  const { schoolId, method, profile, context, threshold, schoolShortName, evidenceSourceId } = params;
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];
  const gapExtras = buildGapExtras(method.knowledgeGaps);
  let status: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  const reasons: string[] = [];

  if (!context?.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: `${schoolId}-subject-combination`, label: `Chọn tổ hợp môn xét tuyển ${schoolShortName}.` });
    reasons.push(`Cần chọn tổ hợp môn để kiểm tra ngưỡng đầu vào ${schoolShortName}.`);
  } else {
    const { total30, missingSubjects } = sumThptTotal(profile, context.subjectContext.subjects);
    if (missingSubjects.length > 0) {
      missingInputs.push(`Chưa đủ điểm 3 môn thi TN THPT trong tổ hợp đã chọn cho ${schoolShortName}.`);
      missingRequirements.push(
        ...missingSubjects.map((subjectId) => ({
          kind: 'profile-input' as const,
          code: `${schoolId}-thpt-${subjectId}`,
          label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp ${schoolShortName}.`,
        }))
      );
      reasons.push(`Cần đủ điểm 3 môn trong tổ hợp để kiểm tra ngưỡng ${schoolShortName}.`);
    }

    if (total30 !== undefined) {
      explanation.push({
        id: `${schoolId}-thpt-threshold`,
        label: `Ngưỡng đầu vào ${schoolShortName} 2026 (thi TN THPT)`,
        output: total30,
        scale: 30,
        formula: threshold.requiredText,
        evidence: [{ sourceId: evidenceSourceId, location: 'Ngưỡng đầu vào/điểm sàn thi TN THPT 2026', verification: 'verified', effectiveYear: 2026 }],
      });

      if (total30 < threshold.min30) {
        status = 'ineligible';
        reasons.push(`Tổng ${total30}/30 thấp hơn ngưỡng thấp nhất đã công bố (${threshold.min30}/30).`);
      } else if (threshold.max30 !== undefined) {
        status = 'unknown';
        reasons.push(
          `Tổng ${total30}/30 đạt từ ngưỡng thấp nhất, nhưng ngưỡng thay đổi theo ngành/chương trình (${threshold.requiredText}); cần chọn/import bảng ngành để kết luận chắc chắn.`
        );
      } else {
        status = 'eligible';
        reasons.push(`Tổng ${total30}/30 đạt ngưỡng đã công bố: ${threshold.requiredText}.`);
      }
    }
  }

  return {
    schoolId,
    year: method.year,
    methodId: method.id,
    confidence: 'partial',
    eligibility: { status, reasons },
    missingInputs,
    missingRules: gapExtras.missingRules,
    missingRequirements: [...missingRequirements, ...gapExtras.missingRequirements],
    explanation,
    evidence: [{ sourceId: evidenceSourceId, location: 'Ngưỡng đầu vào/điểm sàn thi TN THPT 2026', verification: 'verified', effectiveYear: 2026 }],
  };
}
