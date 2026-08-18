import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Research 2026-08-18 — 2 trang chính thức `ufm.edu.vn`/`tuyensinh.ufm.edu.vn` (xem `sources.ts`)
 * xác nhận đầy đủ 5 phương thức + ngưỡng đầu vào 2 nhóm ngành (công bố 10/7/2026, không còn "sẽ
 * công bố sau"). Các khoảng trống dưới đây là phần đã tìm kỹ nhưng KHÔNG định vị được nguồn chính
 * thức đọc được, hoặc là mâu thuẫn thật giữa các nguồn thứ cấp không tự giải quyết được.
 */
export const ufmKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'ufm-bonus-table-not-found',
    label:
      'Bảng điểm cộng/xét thưởng (chỉ áp dụng phương thức học bạ theo 1 nguồn thứ cấp) — KHÔNG định vị được bảng số cụ thể (mức điểm theo loại thành tích/chứng chỉ) trên nguồn chính thức.',
    status: 'incomplete',
    sourceId: 'ufm-admission-plan-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Đã đọc trực tiếp 2 trang chính thức đã đăng ký ở sources.ts — không tìm được bảng số điểm cộng. Không suy đoán giá trị.',
    impact: 'exact-blocking-unless-no-achievement',
  },
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
    id: 'ufm-math-coefficient-scope-conflicting',
    label:
      'Hệ số nhân đôi môn Toán trong tổ hợp xét tuyển — 2 nguồn thứ cấp mâu thuẫn nhau về PHẠM VI áp dụng: 1 nguồn nói "TẤT CẢ tổ hợp tuyển sinh 2026 đều nhân hệ số 2 môn Toán" (vnexpress), nguồn khác nói "CHỈ áp dụng cho thí sinh đăng ký chương trình Tiếng Anh toàn phần, các chương trình còn lại vẫn hệ số 1" (hocmai.vn). KHÔNG tìm được trang UFM chính thức xác nhận trực tiếp phạm vi này (chỉ đọc được qua báo/trang tổng hợp thứ 3). Module này chọn diễn giải AN TOÀN HƠN (hệ số 1 cho chương trình Chuẩn — khớp với câu ngưỡng verbatim "tổng điểm 3 môn... từ 16 điểm" không nhắc hệ số nào) và KHÔNG implement công thức Toán×2 cho chương trình Tiếng Anh toàn phần.',
    status: 'conflicting-sources',
    sourceId: 'ufm-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Đã search nhiều lần, chỉ tìm được nguồn thứ cấp (báo/trang tổng hợp) mâu thuẫn nhau về phạm vi áp dụng — không có trang ufm.edu.vn/tuyensinh.ufm.edu.vn xác nhận trực tiếp bằng văn bản đọc được (PDF đề án đầy đủ không fetch được qua tool hiện có).',
    impact: 'exact-blocking-for-full-english-track-only',
  },
  {
    id: 'ufm-hocba-semester-granularity-gap',
    label:
      'Công thức học bạ chính thức dùng điểm "tính từ lớp 10 đến HỌC KỲ 1 lớp 12" (5 học kỳ, theo 1 nguồn thứ cấp) — KHÁC hẳn "TB cả năm 3 lớp" mà `ApplicantProfile.transcript` dùng chung lưu (`grade10`/`grade11`/`grade12`, không có học kỳ riêng, không có "chỉ HK1 lớp 12"). Không đủ dữ liệu hồ sơ dùng chung để tính đúng, và bản thân công thức tổng/chia cũng đọc được mơ hồ giữa các nguồn thứ cấp (có bản viết "/3" gây nghi ngờ thang điểm cuối).',
    status: 'conflicting-sources',
    sourceId: 'ufm-admission-plan-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Không mở rộng `ApplicantProfile` sang lưu theo học kỳ trong batch này (ngoài phạm vi PHẦN N); giữ phương thức học bạ ở mức unavailable thay vì dùng TB năm làm proxy không chính xác cho công thức 5 học kỳ.',
    impact: 'exact-blocking',
  },
  {
    id: 'ufm-vsat-scale-unconfirmed',
    label: 'Thang điểm tối đa của bài thi V-SAT 2026 và công thức quy đổi điểm xét tuyển từ V-SAT chưa xác định được từ nguồn UFM — chỉ có ngưỡng số điểm thô (241/270), không có thang tối đa hay công thức lắp ráp.',
    status: 'incomplete',
    sourceId: 'ufm-quality-threshold-2026',
    scoreAffecting: true,
    implemented: false,
    whyNotInferred: 'Đã đọc 2 trang chính thức — không có thang điểm tối đa V-SAT được nêu. Giữ phương thức V-SAT ở mức eligibility-only.',
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
