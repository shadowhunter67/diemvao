import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { uitAdmissionMethods } from './methods';
import { uitKnowledgeGaps } from './knowledgeGaps';
import { checkDgnlThreshold } from './eligibility';

export interface UitEvaluationContext {
  programId?: string | null;
}

export function evaluateUitAdmission(profile: ApplicantProfile, context: UitEvaluationContext = {}): AdmissionEvaluation {
  const dgnlTotal = profile.exams?.vact?.total;
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  const eligibility =
    dgnlTotal !== undefined
      ? (() => {
          const result = checkDgnlThreshold(dgnlTotal, null, context.programId ?? null);
          explanation.push({
            id: 'uit-dgnl-threshold',
            label: 'Kiểm tra ngưỡng ĐGNL',
            inputs: { dgnlTotal },
            output: dgnlTotal,
            scale: 1200,
            formula: result.requiredText,
          });
          return { status: result.pass ? ('eligible' as const) : ('ineligible' as const), reasons: [result.requiredText] };
        })()
      : (() => {
          const label = 'Điểm ĐGNL hoặc dữ liệu điều kiện đầu vào tương ứng.';
          missingInputs.push(label);
          missingRequirements.push({ kind: 'profile-input', code: 'uit-dgnl', label });
          return { status: 'unknown' as const, reasons: ['Chưa đủ dữ liệu để kiểm tra điều kiện đầu vào UIT.'] };
        })();

  return {
    schoolId: 'uit',
    year: uitAdmissionMethods[0].year,
    methodId: uitAdmissionMethods[0].id,
    confidence: dgnlTotal !== undefined ? 'partial' : 'unavailable',
    eligibility,
    missingInputs,
    missingRules: uitKnowledgeGaps.map((gap) => gap.label),
    missingRequirements: [
      ...missingRequirements,
      ...uitKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
    ],
    explanation,
    evidence: [
      {
        sourceId: 'uit-thresholds-2026',
        location: 'Ngưỡng ĐGNL/THPT/chứng chỉ',
        verification: 'verified',
        effectiveYear: 2026,
        verifiedAt: '2026-08-11',
      },
    ],
  };
}
