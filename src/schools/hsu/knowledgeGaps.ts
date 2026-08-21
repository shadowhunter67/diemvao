import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-21 (browser thật, chrome-devtools, đọc trực tiếp `www.hoasen.edu.vn`). Ngưỡng
 * điểm sàn thi TN THPT (15 chuẩn/20 Luật) và học bạ (18, chỉ nhóm chuẩn) đã verified từ 2 bài công
 * bố chính thức. Các mục dưới đây là gap CỤ THỂ.
 */
export const hsuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hsu-law-non-thpt-threshold-unpublished',
    label:
      'Ngưỡng khối ngành Luật cho các phương thức KHÔNG dùng kết quả thi TN THPT (học bạ, ĐGNL, phỏng vấn/tuyển thẳng) — bài công bố ngưỡng Luật (09/07/2026) chỉ nêu số cho phương thức thi TN THPT (20 điểm), phần còn lại chỉ dẫn chung "đáp ứng các điều kiện theo quy định hiện hành của Bộ Giáo dục và Đào tạo" không kèm số cụ thể.',
    status: 'incomplete',
    sourceId: 'hsu-law-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Không suy đoán ngưỡng học bạ/ĐGNL nhóm Luật bằng cách cộng/trừ chênh lệch giữa ngưỡng chuẩn và ngưỡng Luật ở phương thức thi TN THPT.',
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hsu-transcript-methodology-unpublished',
    label:
      'Công thức tính điểm học bạ — nguồn ghi "tổng điểm trên kết quả học tập (học bạ) trung học phổ thông theo tổ hợp 03 môn (6HK)" (tức trung bình 6 học kỳ) nhưng `ApplicantProfile.transcript` hiện chỉ lưu điểm theo NĂM (grade10/11/12), không có độ chi tiết theo học kỳ — cùng loại data-model gap đã ghi nhận ở VLU/HUTECH/UFM. Calculator chỉ nhận tổng điểm người dùng tự cung cấp.',
    status: 'incomplete',
    sourceId: 'hsu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hsu-dgnl-interview-methods-not-modeled',
    label:
      'Phương thức ĐGNL (ĐHQG TP.HCM ≥600/1200, ĐHQG Hà Nội ≥75) và phương thức phỏng vấn kết hợp/tuyển thẳng (≥18/30) đã có ngưỡng công bố chính thức nhưng CHƯA được model hoá trong batch này — scope batch này chỉ implement phương thức thi TN THPT và học bạ.',
    status: 'incomplete',
    sourceId: 'hsu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'method-out-of-scope',
  },
  {
    id: 'hsu-priority-bonus-table-not-found',
    label: 'Bảng điểm ưu tiên khu vực/đối tượng theo Thông tư hiện hành (nếu HSU tự công bố lại) — không tìm thấy trong 2 nguồn đã đọc.',
    status: 'incomplete',
    sourceId: 'hsu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'hsu-program-catalog-not-imported',
    label: 'Danh mục 33 ngành/53 chương trình đào tạo và tổ hợp môn xét tuyển từng ngành chưa import — evaluator nhận `HsuThresholdGroup` trực tiếp từ caller (cùng pattern VLU/HUB/HUIT).',
    status: 'incomplete',
    sourceId: 'hsu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'program-catalog-only',
  },
];
