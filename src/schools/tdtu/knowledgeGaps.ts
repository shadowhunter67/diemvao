import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-18 — trang "Phương thức tuyển sinh năm 2026" (`sources.ts:tdtu-admission-plan-2026`)
 * là HTML text đọc trực tiếp được (không phải PDF quét), công bố ĐẦY ĐỦ công thức Điểm xét tuyển
 * PT1/PT2 dạng số cụ thể — không còn ẩn số kiểu "PL6 max 10, PL7 max 5, chưa rõ cộng hay chọn cao
 * nhất" như research sơ bộ batch trước nghi ngờ: trang tự nói rõ "Điểm cộng = Điểm thưởng + Điểm
 * xét thưởng" (CỘNG, không chọn cao nhất), tổng "Điểm cộng" trần 10 (không phải 10+5=15). Phụ lục
 * 5/6/7 (PDF, text layer đọc được) xác nhận đủ bảng số. Các khoảng trống dưới đây là phần CHƯA
 * import/wire trong batch expansion này — không phải ẩn số công thức.
 */
export const tdtuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'tdtu-program-catalog-not-imported',
    label:
      'Batch 2026-08-19: danh mục TÊN/MÃ ngành (119/119, `data/programs.ts`) đã import đủ từ Phụ lục 2 (đọc qua `pdftotext -layout -enc UTF-8`, đối chiếu thủ công từng dòng). PHẦN CÒN THIẾU: tổ hợp xét tuyển cụ thể theo từng ngành, "môn điều kiện" riêng ngành (vd Tiếng Anh ≥ 6.0) và ngưỡng đầu vào riêng ngành do TDTU công bố (chỉ có ngưỡng chung 15/30 theo Bộ GDĐT) — bảng gốc có nhiều dòng/ô multi-combo bị ngắt trang giữa ô (rõ nhất ở cụm STT 15-19 Tài chính-Ngân hàng/Công nghệ tài chính/Kế toán và cụm STT 47-52 Bảo hộ lao động..Khoa học dữ liệu), khiến text-extraction xáo trộn tổ hợp giữa các dòng liền kề — không đủ tin cậy để gán tự động cho đúng ngành mà không rủi ro sai lệch. evaluator hiện vẫn nhận tổ hợp môn trực tiếp từ caller (giống HCMUT/HCMUTE).',
    status: 'official-but-unparsed',
    sourceId: 'tdtu-pl2-programs-pt1-2026',
    scoreAffecting: false,
    implemented: false,
    whyNotInferred: 'Tổ hợp/ngưỡng riêng ngành cần đối chiếu lại trực tiếp PDF gốc theo từng trang (thủ công, không dùng text-extraction tự động do đã xác nhận bị xáo trộn ở 2 cụm trên) — không làm trong batch này để tránh gán sai tổ hợp cho ngành.',
    impact: 'eligibility-only-gap',
  },
  {
    id: 'tdtu-pt1-other-applicant-types',
    label:
      'Điểm năng lực Đối tượng 1.2 (tốt nghiệp trước 2026)/1.3 (SAT/ACT)/1.4 (bằng THPT nước ngoài)/1.5 (chương trình LKQT) — evaluator hiện CHỈ implement Đối tượng 1.1 (học sinh lớp 12, tốt nghiệp THPT 2026), dù công thức 4 đối tượng còn lại đã đọc được đầy đủ từ `tdtu-admission-plan-2026`.',
    status: 'official-but-unparsed',
    sourceId: 'tdtu-admission-plan-2026',
    scoreAffecting: false,
    implemented: false,
    whyNotInferred: 'Đối tượng 1.1 là phổ biến nhất (học sinh lớp 12 chuẩn) — ưu tiên implement đúng 1 đối tượng chính xác thay vì dàn trải nông cả 5.',
    impact: 'scope-boundary-not-a-gap',
  },
  {
    id: 'tdtu-law-pharmacy-alt-threshold',
    label:
      'Ngưỡng đầu vào riêng ngành Luật/Dược học/Kế toán(Kiểm toán) có 3 nhánh OR (đạt ngưỡng Bộ GDĐT ≥20/30, HOẶC học lực Tốt + tổng ≥18/30, HOẶC điểm xét TN THPT ≥8.5) thay vì ngưỡng chung 15/30 — evaluator hiện chỉ áp ngưỡng chung, chưa phân biệt theo ngành (cần program catalog, xem `tdtu-program-catalog-not-imported`).',
    status: 'official-but-unparsed',
    sourceId: 'tdtu-pl2-programs-pt1-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-only-gap',
  },
];
