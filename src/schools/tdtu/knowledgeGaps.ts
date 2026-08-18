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
      'Danh mục 119 ngành/chương trình + tổ hợp xét tuyển cụ thể (Phụ lục 2, 24 trang) chưa import vào UniscoreVN — evaluator hiện nhận tổ hợp môn trực tiếp từ caller (giống HCMUT/HCMUTE), không tra được ngành nào dùng tổ hợp nào, cũng không tra được "môn điều kiện" riêng ngành (vd Tiếng Anh ≥ 6.0) hay ngưỡng đầu vào riêng ngành do TDTU công bố (chỉ có ngưỡng chung 15/30 theo Bộ GDĐT).',
    status: 'official-but-unparsed',
    sourceId: 'tdtu-pl2-programs-pt1-2026',
    scoreAffecting: false,
    implemented: false,
    whyNotInferred: 'Import an toàn 119 dòng × nhiều tổ hợp/dòng cần structured parser + validation (trùng mã ngành, thiếu field, ngưỡng sai định dạng) — không làm thủ công trong batch expansion ưu tiên mở trường mới.',
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
