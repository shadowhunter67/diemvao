import type { SourcedRule } from '../../core/evidence';
import { AGU_BETA_WEIGHTS_2026, AGU_LAW_EXTRA_CONDITION, AGU_PROGRAM_THRESHOLDS_2026 } from './data/thresholds';

export const aguProgramThresholdEvidence = {
  value: { programCount: AGU_PROGRAM_THRESHOLDS_2026.length },
  evidence: [
    {
      sourceId: 'agu-threshold-2026',
      location: 'Mục 1 "Ngưỡng đảm bảo chất lượng chung" — bảng 43 dòng ngành, trang 1-2 của thông báo (ảnh)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ programCount: number }>;

export const aguBetaWeightsEvidence = {
  value: AGU_BETA_WEIGHTS_2026,
  evidence: [
    {
      sourceId: 'agu-threshold-2026',
      location:
        'Mục 4 "Hệ số beta (β) áp dụng trong phương thức xét tuyển Tổng hợp", trang 3 của thông báo (ảnh) — "Các hệ số β1= 0,4; β2= 0,4; β3= 0,2 được Hội đồng tuyển sinh xác định". Trùng số với widget ước tính trên trang tuyển sinh nhưng nguồn dùng là ảnh thông báo đã ký, không phải widget.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
      note: 'Chỉ β1/β2/β3 được xác nhận exact. Công thức quy đổi cụ thể từng thành phần (THPT/ĐGNL/Học bạ về thang 100) được ảnh dẫn chiếu sang trang tuyensinh.agu.edu.vn/tuyen-sinh nhưng trang đó chỉ có công cụ JS tính sẵn, không có công thức dạng văn bản — xem knowledgeGaps.ts.',
    },
  ],
} satisfies SourcedRule<typeof AGU_BETA_WEIGHTS_2026>;

export const aguLawExtraConditionEvidence = {
  value: AGU_LAW_EXTRA_CONDITION,
  evidence: [
    {
      sourceId: 'agu-threshold-2026',
      location:
        'Mục 3 "Ngưỡng đảm bảo chất lượng đối với ngành Luật", trang 3 của thông báo (ảnh) — tổng điểm ≥60/100, điểm Toán hoặc Ngữ văn ≥60% thang điểm tối đa, theo Quyết định 678/QĐ-BGDĐT ngày 14/3/2025.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<typeof AGU_LAW_EXTRA_CONDITION>;
