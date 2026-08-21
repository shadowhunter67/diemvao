import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-21 (bài đăng chính thức TDMU đọc trực tiếp qua browser thật, xem
 * `sources.ts:tdmu-quality-threshold-2026`). Ngưỡng đầu vào theo 3 phương thức có input khớp
 * `ApplicantProfile` (thi TN THPT/học bạ/ĐGNL ĐHQG-HCM) cho 3 nhóm ngành (standard/law/teacher)
 * đã verified. Các mục dưới đây là gap CỤ THỂ đọc được từ chính văn bản.
 */
export const tdmuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'tdmu-priority-bonus-table-not-found',
    label:
      'Bảng điểm ưu tiên khu vực/đối tượng cụ thể áp dụng cho TDMU và bảng điểm cộng thành tích/chứng chỉ (nếu có) chưa tìm được nguồn TDMU tự công bố riêng — nguồn chỉ ghi "Điểm trúng tuyển là tổng điểm của thí sinh (đã bao gồm điểm cộng và điểm ưu tiên nếu có)" mà không có bảng số. Ngưỡng đảm bảo chất lượng đầu vào công bố ở đây là điểm SÀN NHẬN HỒ SƠ, KHÔNG PHẢI điểm chuẩn trúng tuyển cuối cùng.',
    status: 'incomplete',
    sourceId: 'tdmu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'tdmu-program-catalog-not-imported',
    label:
      'Danh mục 51 ngành đào tạo đầy đủ, mã ngành, tổ hợp môn xét tuyển từng ngành và bảng ánh xạ ngành → nhóm ngưỡng (standard/law/teacher) chưa import — evaluator nhận `TdmuProgramGroup` trực tiếp từ caller (cùng pattern HUB/UFM/CTU), không tự suy từ tên ngành.',
    status: 'incomplete',
    sourceId: 'tdmu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'program-catalog-only',
  },
  {
    id: 'tdmu-dgnl-hanoi-not-modeled',
    label:
      'Phương thức xét kết quả kỳ thi đánh giá năng lực Trường Đại học Sư phạm Hà Nội (16,5 điểm thường/21,5 điểm ngành Luật) — `ApplicantProfile` hiện chỉ có field cho ĐGNL ĐHQG-HCM (`exams.vact`), KHÔNG có field lưu điểm kỳ thi ĐGNL Sư phạm Hà Nội, nên không có input để evaluator đọc. Không tự thêm field mới trong batch threshold-only này.',
    status: 'incomplete',
    sourceId: 'tdmu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-partial-scope',
  },
  {
    id: 'tdmu-gdmn-kientruc-xaydung-special-condition-not-modeled',
    label:
      'Ngành Giáo dục Mầm non (7140201, công thức riêng: tổng điểm 2 môn thi + điểm ưu tiên×2/3 ≥13,33), Kiến trúc (7580101, Toán≥5,0 và năng khiếu≥5,0 thang 10), Kỹ thuật xây dựng (7580201, Toán≥5,0 thang 10) có điều kiện phụ riêng NGOÀI ngưỡng chung — nguồn công bố đầy đủ nhưng đây là 3 ngành đơn lẻ có điều kiện đặc thù, ngoài phạm vi batch threshold-only này. Không model để giữ scope gọn — không phải do thiếu nguồn.',
    status: 'incomplete',
    sourceId: 'tdmu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'program-catalog-only',
  },
  {
    id: 'tdmu-law-additional-input-standard-not-found',
    label:
      'Ngành Luật (7380101) ghi thêm điều kiện "đáp ứng chuẩn đầu vào của chương trình đào tạo theo Quyết định số 678/QĐ-BGDĐT ngày 14/3/2025" — chưa tra cứu nội dung Quyết định 678/QĐ-BGDĐT để biết chuẩn đầu vào cụ thể là gì (có thể là chuẩn tiếng Anh/kỹ năng, không phải điểm xét tuyển).',
    status: 'incomplete',
    sourceId: 'tdmu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-partial-scope',
  },
];
