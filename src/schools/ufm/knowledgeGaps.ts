import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-18 (2 trang chính thức) → **re-verify 2026-08-19 qua domain gốc** (trước đó
 * `ufm.edu.vn`/`tuyensinh.ufm.edu.vn` timeout, chỉ đọc được qua mirror `giaoduc247.vn` chưa verify).
 * Lần này domain gốc load được: đọc trực tiếp 2 file PDF chính thức tại `login.ufm.edu.vn` (subdomain
 * `ufm.edu.vn`) bằng chrome-devtools screenshot (không OCR/mirror) — đóng dứt điểm 2 gap
 * (`ufm-bonus-table-not-found`, `ufm-math-coefficient-scope-conflicting`), sửa lại
 * `ufm-hocba-semester-granularity-gap` (giả thuyết "5 học kỳ" của nguồn thứ cấp cũ SAI — công thức
 * thật dùng TB cả 3 năm, khớp `ApplicantProfile.transcript`), và phát hiện gap MỚI quan trọng hơn:
 * `ufm-final-score-conversion-unparsed` (ĐGNL/V-SAT/học bạ đều cần quy đổi qua bảng bách phân vị
 * trước khi ra "Điểm xét tuyển" thang 30 — bảng đó official nhưng chưa parse hết).
 */
export const ufmKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'ufm-priority-table-not-ufm-specific',
    label: 'Bảng điểm ưu tiên khu vực/đối tượng dùng bảng chuẩn quốc gia — không tìm được trang UFM tự công bố bảng số riêng.',
    status: 'official-but-unparsed',
    sourceId: 'ufm-admission-plan-2026',
    scoreAffecting: true,
    implemented: true,
    whyNotInferred: 'Bảng số dùng cross-check nội bộ với 7 trường khác trong repo đã verified/cross-checked cùng công thức tỉ lệ quốc gia.',
    impact: 'evidence-verification-level-only',
  },
  {
    id: 'ufm-final-score-conversion-unparsed',
    label:
      '"Điểm xét tuyển" chính thức của phương thức học bạ (2), ĐGNL (3), V-SAT (4) — theo văn bản gốc, KHÔNG dùng thẳng điểm thô/thang gốc, mà phải quy đổi qua "bảng bách phân vị" (khoảng phân vị) của Bộ GD-ĐT sang thang 30 trước khi cộng điểm ưu tiên + điểm cộng. Bảng này CÓ tồn tại chính thức (Thông báo 2639/TB-ĐHTCM, 10/7/2026, mục 3 "Quy đổi tương đương điểm giữa các phương thức xét tuyển") nhưng là bảng lớn nhiều "khoảng phân vị" × 3 cặp phương thức (học bạ↔thi TN THPT, ĐGNL↔thi TN THPT, V-SAT↔thi TN THPT) — chỉ mới đọc được vài dòng đầu của cặp học bạ↔thi TN (Khoảng 1-3), CHƯA transcribe hết cả 3 bảng.',
    status: 'official-but-unparsed',
    sourceId: 'ufm-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred:
      'Nhập tay hàng chục dòng bách phân vị × 3 cặp phương thức mà chưa đọc hết toàn bộ bảng có rủi ro sai/thiếu dòng cao — theo docs/data-maintainer-guide.md mục "Nhập bảng lớn", cần đọc hết bảng trước khi import, không nhập tay mù. Batch này chỉ xác nhận bảng CÓ tồn tại và đúng dạng "khoảng phân vị" (percentile band), chưa import.',
    impact: 'exact-blocking-for-hocba-dgnl-vsat',
    note:
      'QUAN TRỌNG: trước batch 2026-08-19, `evaluateUfmDgnlAdmission` claim `exact-verified` bằng cách cộng thẳng điểm ĐGNL thang 1200 + ưu tiên — đây là SAI theo văn bản gốc (Điểm xét tuyển ĐGNL phải quy đổi sang thang 30 trước). Batch 2026-08-19 đã hạ `ufm-dgnl-2026` xuống `exactCalculator: false` để không claim sai. Phương thức thi TN THPT (5) KHÔNG bị ảnh hưởng — dùng thẳng tổng thô thang 30, không qua bước quy đổi (xác nhận verbatim, xem evidence.ts).',
  },
  {
    id: 'ufm-hocba-semester-granularity-gap',
    label:
      'Học bạ: công thức chính thức (verified 2026-08-19, `THONGTINTS2026-FINAL_compressed.pdf` trang 5) dùng ĐTB TRUNG BÌNH CẢ 3 NĂM lớp 10/11/12 mỗi môn — KHỚP với `ApplicantProfile.transcript` (`grade10`/`grade11`/`grade12`), giả thuyết "5 học kỳ, đến HK1 lớp 12" của nguồn thứ cấp batch trước là SAI, đã loại bỏ. Blocker còn lại KHÔNG phải granularity nữa mà là bước "quy đổi thang điểm tương đương" (xem `ufm-final-score-conversion-unparsed`) — hocba vẫn `exactCalculator: false` vì lý do đó, không phải vì thiếu dữ liệu hồ sơ.',
    status: 'official-but-unparsed',
    sourceId: 'ufm-admission-plan-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Blocker thật (bảng quy đổi bách phân vị) chưa parse — xem ufm-final-score-conversion-unparsed. ApplicantProfile.transcript đã đủ dữ liệu (TB 3 năm), KHÔNG cần mở rộng data model nữa.',
    impact: 'exact-blocking',
  },
  {
    id: 'ufm-vsat-scale-unconfirmed',
    label:
      'Thang điểm V-SAT: verified 2026-08-19 — tổng 3 môn tối đa 450 điểm (Thông báo 2639/TB-ĐHTCM trang 4, ngưỡng Luật kinh tế "270,00 điểm theo thang điểm 450" + điều kiện môn Toán/Ngữ Văn "theo thang điểm 150"), tức mỗi môn tối đa 150. Thang tối đa NAY ĐÃ XÁC ĐỊNH (khác batch trước ghi "chưa có thang tối đa"). Blocker còn lại: "Điểm xét tuyển" cuối cùng vẫn cần quy đổi qua bảng bách phân vị V-SAT↔thi TN THPT (xem `ufm-final-score-conversion-unparsed`), chưa parse — V-SAT vẫn giữ eligibility-only.',
    status: 'official-but-unparsed',
    sourceId: 'ufm-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Thang điểm đã xác định nhưng công thức quy đổi cuối (bảng bách phân vị) chưa parse — xem ufm-final-score-conversion-unparsed.',
    impact: 'exact-blocking',
  },
  {
    id: 'ufm-program-catalog-not-imported',
    label: 'Danh mục ngành/chương trình đào tạo 2026 (5 nhóm: Chuẩn/Định hướng đặc thù/Tích hợp/Tiếng Anh toàn phần/Tài năng, 8.000 chỉ tiêu) và mã ngành cụ thể chưa import — evaluator nhận `UfmThresholdGroup`/`programTrack` trực tiếp từ caller.',
    status: 'official-but-unparsed',
    sourceId: 'ufm-admission-plan-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-only-gap',
  },
];
