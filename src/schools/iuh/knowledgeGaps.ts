import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-19/20 (5 nguồn chính thức, xem `sources.ts`). IUH 2026 chỉ có 1 phương thức có
 * công thức điểm ("xét tuyển kết hợp", công thức Max(XT1,XT2,XT3) — xem `evidence.ts`). Gap dưới đây
 * liệt kê đầy đủ phần CHƯA implement, theo đúng nguyên tắc "ghi rõ phần thiếu, không âm thầm bỏ sót".
 */
export const iuhKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'iuh-dgnl-top-score-unresolved',
    label:
      'Nhánh XT3 (ĐĐGNL = Kết quả ĐGNL × 30 / ĐTK) cần ĐTK ("điểm thủ khoa của kỳ thi đánh giá năng lực năm 2026") — số liệu CỤ THỂ này KHÔNG xuất hiện trong văn bản công thức IUH (là biến phụ thuộc kết quả thi, IUH không tự công bố mốc dùng). Báo chí ghi 2 giá trị khác nhau cho 2 đợt thi ĐHQG-HCM 2026 (đợt 1: 1098/1200; đợt 2: 1139/1200) — không rõ IUH neo theo đợt nào hay theo giá trị nào khác (có thể ĐHQG-HCM tự công bố mốc riêng cho mục đích quy đổi liên trường, khác cả 2 số trên).',
    status: 'incomplete',
    sourceId: 'iuh-formula-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      '2 nguồn thứ cấp (báo chí, không phải IUH) nêu số khác nhau cho "thủ khoa" — theo docs/data-maintainer-guide.md, nguồn mâu thuẫn không tìm được nguồn chính thức trực tiếp giải quyết là tín hiệu hạ mức implement, không suy đoán chọn 1 trong 2 số.',
    impact: 'exact-blocking-for-applicants-with-vact-score',
    note:
      'Vì ĐXT = Max(XT1,XT2,XT3), bỏ qua XT3 sẽ khiến kết quả CÓ THỂ bị đánh giá thấp hơn thật đối với thí sinh có điểm ĐGNL — evaluate.ts hạ `confidence` về `partial` (không trả `score`) bất cứ khi nào `profile.exams.vact.total` tồn tại, thay vì âm thầm bỏ qua nhánh XT3 và claim exact sai.',
  },
  {
    id: 'iuh-bonus-school-lookup-not-modeled',
    label:
      'Phụ lục 1 dòng 5-7 (học sinh trường THPT ký kết hợp tác với IUH +1,25; học sinh trường chuyên/năng khiếu +1,50; học sinh trường Top chất lượng theo 3 mức 1,25/1,00/0,75) đều tham chiếu danh mục TRA CỨU ĐỘNG trên cổng tuyển sinh IUH (không phải bảng số tĩnh trong văn bản) — CHƯA import danh mục trường.',
    status: 'official-but-unparsed',
    sourceId: 'iuh-bonus-appendix-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Danh mục trường là dữ liệu động (tra cứu theo link), không phải bảng số cố định trong Phụ lục — không suy đoán/hard-code danh sách trường.',
    impact: 'bonus-undercount-risk-for-3-of-7-reward-categories',
  },
  {
    id: 'iuh-award-amount-unquantified',
    label: '"Điểm thưởng" (mục đầu tiên trong Điểm cộng — dành cho thí sinh đủ điều kiện xét tuyển thẳng theo khoản 2 Điều 8 Quy chế tuyển sinh Bộ GD-ĐT nhưng KHÔNG dùng quyền xét thẳng) KHÔNG có bảng mức điểm cụ thể trong 2 văn bản đã đọc.',
    status: 'incomplete',
    sourceId: 'iuh-bonus-appendix-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Không tìm được mức điểm cụ thể — phạm vi áp dụng cũng hẹp (chỉ thí sinh đủ điều kiện xét thẳng nhưng không dùng), không suy đoán số.',
    impact: 'narrow-scope-gap',
  },
  {
    id: 'iuh-program-catalog-and-cutoffs-not-imported',
    label:
      'Danh mục ngành/mã ngành/tổ hợp xét tuyển cố định theo TỪNG ngành (40 dòng, Trụ sở chính TP.HCM) và bảng điểm trúng tuyển 2026 (32 dòng, `iuh-admission-cutoff-2026`) CHƯA import vào dataset — evaluator nhận tổ hợp 3 môn trực tiếp từ caller (giống UEL/UFM) thay vì tra theo ngành đã chọn; `capabilities.programs`/`capabilities.cutoffs` ở `SchoolModule` giữ `false`.',
    status: 'official-but-unparsed',
    sourceId: 'iuh-admission-notice-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-only-gap',
  },
  {
    id: 'iuh-tcta-quangngai-lawpharmacy-tracks-not-implemented',
    label:
      'Chương trình Tăng cường tiếng Anh (TCTA, ngưỡng 17,00/30), Phân hiệu Quảng Ngãi (ngưỡng 16,00/30 mọi ngành), và ngành Dược học/lĩnh vực Pháp luật tại Trụ sở chính (ngưỡng riêng theo quy định Bộ GD-ĐT, số cụ thể CHƯA xác định trong văn bản đã đọc) đều CHƯA implement — module chỉ phủ track "Trụ sở chính TP.HCM, chương trình Chuẩn, ngoài Dược/Pháp luật".',
    status: 'official-but-unparsed',
    sourceId: 'iuh-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Ngưỡng Dược/Pháp luật dẫn chiếu "theo quy định của Bộ Giáo dục và Đào tạo" chứ không nêu số cụ thể trong văn bản IUH đã đọc — chưa tra cứu quy định gốc Bộ GD-ĐT trong batch này.',
    impact: 'scope-restricted-to-hcmc-standard-track',
  },
];
