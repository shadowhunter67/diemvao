import type { SourcedRule } from '../../core/evidence';
import {
  UHS_DGNL_WEIGHT_RANGE,
  UHS_MISSING_DGNL_FROM_THPT_FACTOR,
  UHS_MISSING_THPT_FROM_DGNL_FACTOR,
  UHS_THPT_WEIGHT_RANGE,
  UHS_TRANSCRIPT_WEIGHT,
} from './calculator';
import {
  UHS_MEDICINE_LIKE_COMBINATION_THRESHOLD_30,
  UHS_MEDICINE_LIKE_GRADUATION_THRESHOLD_10,
  UHS_NURSING_COMBINATION_THRESHOLD_30,
  UHS_NURSING_GRADUATION_THRESHOLD_10,
} from './eligibility';

export const uhsThresholdEvidence = {
  value: {
    medicineLikeCombination30: UHS_MEDICINE_LIKE_COMBINATION_THRESHOLD_30,
    medicineLikeGraduation10: UHS_MEDICINE_LIKE_GRADUATION_THRESHOLD_10,
    nursingCombination30: UHS_NURSING_COMBINATION_THRESHOLD_30,
    nursingGraduation10: UHS_NURSING_GRADUATION_THRESHOLD_10,
  },
  evidence: [
    {
      sourceId: 'uhs-info-2026',
      location: 'Phương thức 02, mục a: điều kiện ngưỡng đầu vào theo nhóm ngành sức khỏe và Điều dưỡng.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{
  medicineLikeCombination30: number;
  medicineLikeGraduation10: number;
  nursingCombination30: number;
  nursingGraduation10: number;
}>;

export const uhsIntegratedFormulaEvidence = {
  value: {
    thptWeightRange: UHS_THPT_WEIGHT_RANGE,
    dgnlWeightRange: UHS_DGNL_WEIGHT_RANGE,
    transcriptWeight: UHS_TRANSCRIPT_WEIGHT,
    missingDgnlFromThptFactor: UHS_MISSING_DGNL_FROM_THPT_FACTOR,
    missingThptFromDgnlFactor: UHS_MISSING_THPT_FROM_DGNL_FACTOR,
  },
  evidence: [
    {
      sourceId: 'uhs-info-2026',
      location:
        'Phương thức 02, mục c: ĐXT tổng hợp thang 100; w1 30%-35%, w2 45%-50%, w3=20%; quy đổi thiếu ĐGNL=THPT×0,87 và THPT=ĐGNL×1,15.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{
  thptWeightRange: typeof UHS_THPT_WEIGHT_RANGE;
  dgnlWeightRange: typeof UHS_DGNL_WEIGHT_RANGE;
  transcriptWeight: number;
  missingDgnlFromThptFactor: number;
  missingThptFromDgnlFactor: number;
}>;

export const uhsBonusEvidence = {
  value: { multiplier: 5, certificateSatCap: 5 },
  evidence: [
    {
      sourceId: 'uhs-bonus-2026',
      location:
        'Thông báo nhận chứng chỉ ngoại ngữ/kết quả SAT 2026 và PDF official: điều kiện IELTS/TOEFL/TOEIC/VSTEP/SAT/preferred-school, thời hạn không quá 02 năm, công thức điểm cộng thang 100.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{ multiplier: number; certificateSatCap: number }>;
