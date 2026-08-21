import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-21 (browser thật, chrome-devtools, đọc trực tiếp `tuyensinh.ntt.edu.vn`). Ngưỡng
 * điểm sàn phương thức học bạ theo 6 nhóm ngành đã verified từ 1 bài công bố chính thức. Các mục
 * dưới đây là gap CỤ THỂ, không phải "trường chưa công bố" chung chung.
 */
export const nttuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'nttu-dgnl-methods-not-modeled',
    label:
      'Phương thức ĐGNL ĐHQG TP.HCM (thang 1200) và ĐGNL ĐHQG Hà Nội (thang khoảng 150) có ngưỡng công bố chính thức theo cùng bảng (Y khoa 650/85, Răng-Hàm-Mặt 600/75, Y học cổ truyền & Dược học 570/70, Điều dưỡng & nhóm liên quan 550/70, các ngành còn lại 550/70; nhóm Luật không áp dụng) nhưng CHƯA được model hoá trong batch này — scope batch này chỉ implement phương thức học bạ để kiểm soát phạm vi.',
    status: 'incomplete',
    sourceId: 'nttu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'method-out-of-scope',
  },
  {
    id: 'nttu-thpt-exam-method-not-modeled',
    label:
      'Bài công bố chính thức đã đọc chỉ có bảng cho phương thức Học bạ + ĐGNL, KHÔNG có bảng ngưỡng riêng cho phương thức xét kết quả thi TN THPT (dù nguồn có nhắc tổng quát "ngưỡng điểm đạt quy định chung đối với các ngành còn lại: tổng điểm 3 môn thi từ 15.0 điểm trở lên" — không rõ đây là ngưỡng cho phương thức thi TN THPT riêng biệt hay chỉ là điều kiện tham chiếu chung). Không suy đoán ngưỡng phương thức thi TN THPT cho nhóm Sức khỏe/Luật từ số liệu học bạ.',
    status: 'incomplete',
    sourceId: 'nttu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    whyNotInferred: 'Không gán ngưỡng học bạ cho phương thức thi TN THPT dù 2 phương thức có thể trùng số ở 1 vài trường khác — NTTU không nêu rõ trong nguồn đã đọc.',
    impact: 'method-out-of-scope',
  },
  {
    id: 'nttu-priority-bonus-table-not-found',
    label: 'Bảng điểm ưu tiên khu vực/đối tượng theo Thông tư hiện hành (nếu NTTU tự công bố lại) — không tìm thấy trong nguồn đã đọc.',
    status: 'incomplete',
    sourceId: 'nttu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'nttu-transcript-methodology-unpublished',
    label:
      'Công thức tính "điểm học bạ" — nguồn chỉ công bố ngưỡng theo nhóm ngành, không nêu rõ cách tính tổng điểm 3 môn (theo năm lớp 12, theo 6 học kỳ...). Calculator chỉ nhận tổng điểm người dùng tự cung cấp (`totalScore30`), không tự tính từ `ApplicantProfile.transcript`.',
    status: 'incomplete',
    sourceId: 'nttu-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'nttu-program-catalog-not-imported',
    label:
      'Danh mục ngành đầy đủ (bài viết liệt kê ~70 ngành đào tạo, kể cả các ngành Chuẩn quốc tế) và bảng ánh xạ ngành → nhóm ngưỡng chưa import — evaluator nhận `NttuThresholdGroup` trực tiếp từ caller thay vì tự suy từ tên/mã ngành (cùng pattern VLU/HUB/UFM).',
    status: 'incomplete',
    sourceId: 'nttu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'program-catalog-only',
  },
  {
    id: 'nttu-source-publish-date-unavailable',
    label:
      'Trang công bố không có `<meta>`/`<time>` publish-date đọc được qua DOM (đã kiểm tra bằng chrome-devtools, không có phần tử nào) — nguồn báo chí thứ 3 (không dùng làm authority ở đây) từng ghi ngày 27/06/2026, nhưng UniscoreVN không dùng ngày đó vì không tự xác nhận được trên trang chính thức.',
    status: 'incomplete',
    sourceId: 'nttu-quality-threshold-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'source-lifecycle-review-needed',
  },
];
