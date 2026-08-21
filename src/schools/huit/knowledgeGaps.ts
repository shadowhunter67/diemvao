import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-21 (browser thật, chrome-devtools, đọc trực tiếp `ts.huit.edu.vn`). Ngưỡng đảm
 * bảo chất lượng đầu vào theo 4 phương thức, 2 nhóm ngành (Luật & Luật kinh tế / các ngành còn lại)
 * đã verified từ bài công bố ngưỡng CUỐI CÙNG (10/07/2026, `huit-quality-threshold-2026`). Các mục
 * dưới đây là gap CỤ THỂ, không phải "trường chưa công bố" chung chung.
 */
export const huitKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'huit-transcript-methodology-unpublished',
    label:
      'Công thức tính điểm cho phương thức "xét kết quả học tập THPT" (học bạ) — nguồn chỉ công bố ngưỡng điểm sàn (20/30 cho cả 2 nhóm) mà không nêu rõ cách tính tổng điểm 3 môn (theo năm lớp 12, theo 6 học kỳ, hay theo tổ hợp môn xét tuyển) — khác với các trường khác (VLU/UEF) đã nêu rõ "6 học kỳ". Calculator chỉ nhận tổng điểm người dùng tự cung cấp (`totalScore30` qua context), không tự tính từ `ApplicantProfile.transcript`.',
    status: 'incomplete',
    sourceId: 'huit-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      'Không suy đoán công thức "6 học kỳ" giống các trường khác chỉ vì mô hình phổ biến — HUIT không nêu rõ trong nguồn đã đọc.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'huit-dgnl-methods-not-modeled',
    label:
      'Phương thức xét ĐGNL ĐHQG TP.HCM (thang 1200, ngưỡng 600/720) và ĐGNL chuyên biệt Trường ĐH Sư phạm TP.HCM (thang 30, ngưỡng 20/20) đã có ngưỡng công bố chính thức nhưng CHƯA được model hoá trong batch này (ngoài phạm vi 2 phương thức đã implement: thi TN THPT + học tập THPT) — để dành mở rộng batch sau.',
    status: 'incomplete',
    sourceId: 'huit-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'method-out-of-scope',
  },
  {
    id: 'huit-priority-bonus-table-not-found',
    label: 'Bảng điểm ưu tiên khu vực/đối tượng và công thức giảm dần theo Thông tư 08/2022 (nếu HUIT tự công bố lại) — không tìm thấy trong nguồn đã đọc.',
    status: 'incomplete',
    sourceId: 'huit-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'huit-program-catalog-not-imported',
    label:
      'Danh mục ngành đầy đủ + tổ hợp môn xét tuyển từng ngành (bảng 39 ngành đào tạo chính quy + 5 ngành liên kết quốc tế đã đọc được ở nguồn, nhưng chưa import vào dataset) và bảng ánh xạ ngành → nhóm ngưỡng (Luật/Luật kinh tế vs. còn lại) chưa import — evaluator nhận `HuitThresholdGroup` trực tiếp từ caller thay vì tự suy từ tên/mã ngành (cùng pattern UFM/HUTECH/VLU).',
    status: 'incomplete',
    sourceId: 'huit-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'program-catalog-only',
  },
  {
    id: 'huit-earlier-notice-provisional-superseded',
    label:
      'Bài đăng 19/05/2026 (`huit-admission-info-2026-superseded`, trước kỳ thi THPT 2026) từng ghi ngưỡng PT1 nhóm Luật/Luật kinh tế là điều kiện tối thiểu TẠM THỜI (18/30 kèm Toán≥6/Văn≥6), tự nêu "ngưỡng cuối cùng được xác định sau kỳ thi". Bài 10/07/2026 (`huit-quality-threshold-2026`) là đúng bản công bố cuối đã hứa, với số liệu khác (20/30, không kèm điều kiện môn riêng) — UniscoreVN dùng bản cuối, giữ lại bản cũ trong `sources.ts` với `lifecycle.status: superseded` để tránh nhầm lẫn về sau.',
    status: 'incomplete',
    sourceId: 'huit-admission-info-2026-superseded',
    scoreAffecting: false,
    implemented: false,
    impact: 'source-lifecycle-review-needed',
  },
];
