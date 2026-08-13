import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import { convertDgnlToThpt } from './dgnlConversion';
import { checkUehThreshold } from './eligibility';
import { uehAdmissionMethods } from './methods';
import { uehDgnlConversionEvidence } from './evidence';
import { uehKnowledgeGaps } from './knowledgeGaps';

export interface UehPartialInput {
  dgnlScore?: number;
  /** Điểm xét tuyển thang 100 người dùng tự biết từ nguồn khác — KHÔNG do UniscoreVN tự tính (xem
   * UehExplorerPage — UniscoreVN chưa có bước quy đổi cuối). Chỉ dùng để check eligibility, không
   * bao giờ hiển thị như một `score` do UniscoreVN "tính ra". */
  knownAdmissionScore100?: number;
  campus?: 'hcmc' | 'mekong';
}

/**
 * UEH — ví dụ 'partial' flow: có scoreConversion (bảng ĐGNL→THPT verified) nhưng KHÔNG có exact
 * calculator. `score` CỐ TÌNH luôn undefined — không được phép suy ra final score từ bất kỳ input
 * nào ở đây, kể cả khi có `dgnlScore`. `eligibility` chỉ tính được nếu người dùng tự cung cấp
 * `knownAdmissionScore100` (họ đã có điểm từ nguồn khác) — nếu không có, trả 'unknown', KHÔNG suy
 * đoán.
 */
export function evaluateUehAdmission(input: UehPartialInput): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (input.dgnlScore !== undefined) {
    const thptEquivalent = convertDgnlToThpt(input.dgnlScore);
    explanation.push({
      id: 'dgnl-to-thpt',
      label: 'Quy đổi ĐGNL-HCM sang điểm THPT tương đương',
      inputs: { dgnlScore: input.dgnlScore },
      output: thptEquivalent ?? undefined,
      scale: 30,
      formula: 'Nội suy tuyến tính theo bảng 12 khoảng công bố',
      evidence: uehDgnlConversionEvidence.evidence,
    });
  } else {
    const label = 'Điểm ĐGNL ĐHQG-HCM để dùng công cụ quy đổi UEH.';
    missingInputs.push(label);
    missingRequirements.push({ kind: 'profile-input', code: 'ueh-dgnl', label });
  }

  const eligibility =
    input.knownAdmissionScore100 !== undefined && input.campus
      ? (() => {
          const result = checkUehThreshold(input.knownAdmissionScore100!, input.campus!);
          return {
            status: result.pass ? ('eligible' as const) : ('ineligible' as const),
            reasons: [result.requiredText],
          };
        })()
      : { status: 'unknown' as const, reasons: ['Cần biết điểm xét tuyển thang 100 từ nguồn khác để so sánh ngưỡng.'] };

  return {
    schoolId: 'ueh',
    year: uehAdmissionMethods[0].year,
    methodId: uehAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility,
    // Cố tình KHÔNG set `score` — UEH chưa có exact calculator, không được suy đoán/làm tròn ra
    // một con số trông giống điểm xét tuyển thật.
    missingInputs,
    missingRules: uehKnowledgeGaps.map((gap) => gap.label),
    missingRequirements: [
      ...missingRequirements,
      ...uehKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })),
    ],
    explanation,
    evidence: uehDgnlConversionEvidence.evidence,
  };
}
