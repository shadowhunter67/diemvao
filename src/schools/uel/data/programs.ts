import type { UelProgram } from '../types/programs';

/**
 * 38 ngành/chuyên ngành UEL có điểm chuẩn 2026 công bố chính thức (xem cutoffs.ts) — khớp đúng
 * bảng "Công bố điểm chuẩn đại học chính quy 2026, phương thức xét tuyển tổng hợp" đọc trực
 * tiếp từ ảnh công bố gốc (không suy đoán/bổ sung ngành ngoài bảng).
 */
export const uelPrograms: UelProgram[] = [
  // ===== Kinh tế =====
  { id: 'kinh-te', code: '401', name: 'Kinh tế (Chuyên ngành Kinh tế học)', group: 'Kinh tế' },
  { id: 'kinh-te-quan-ly-cong', code: '403', name: 'Kinh tế (Chuyên ngành Kinh tế và quản lý công)', group: 'Kinh tế' },
  { id: 'kinh-te-so', code: '421', name: 'Kinh tế (Chuyên ngành Kinh tế số)', group: 'Kinh tế' },
  { id: 'kinh-te-quoc-te', code: '402', name: 'Kinh tế quốc tế (Chuyên ngành Kinh tế đối ngoại)', group: 'Kinh tế' },
  {
    id: 'toan-kinh-te',
    code: '413',
    name: 'Toán kinh tế (Chuyên ngành Toán ứng dụng trong Kinh tế, Quản trị và Tài chính)',
    group: 'Kinh tế',
  },
  {
    id: 'toan-kinh-te-ta',
    code: '413E',
    name: 'Toán kinh tế (Chuyên ngành Toán ứng dụng trong Kinh tế, Quản trị và Tài chính) (Tiếng Anh)',
    group: 'Kinh tế',
  },
  { id: 'toan-kinh-te-phan-tich-du-lieu', code: '419', name: 'Toán kinh tế (Chuyên ngành Phân tích dữ liệu)', group: 'Kinh tế' },

  // ===== Kinh doanh và Quản lý =====
  { id: 'quan-tri-kinh-doanh', code: '407', name: 'Quản trị kinh doanh', group: 'Kinh doanh và Quản lý' },
  { id: 'quan-tri-kinh-doanh-ta', code: '407E', name: 'Quản trị kinh doanh (Tiếng Anh)', group: 'Kinh doanh và Quản lý' },
  {
    id: 'quan-tri-du-lich-lu-hanh',
    code: '415',
    name: 'Quản trị kinh doanh (Chuyên ngành Quản trị du lịch và lữ hành)',
    group: 'Kinh doanh và Quản lý',
  },
  { id: 'marketing', code: '410', name: 'Marketing', group: 'Kinh doanh và Quản lý' },
  { id: 'marketing-ta', code: '410E', name: 'Marketing (Tiếng Anh)', group: 'Kinh doanh và Quản lý' },
  { id: 'digital-marketing', code: '417', name: 'Marketing (Chuyên ngành Digital Marketing)', group: 'Kinh doanh và Quản lý' },
  { id: 'kinh-doanh-quoc-te', code: '408', name: 'Kinh doanh quốc tế', group: 'Kinh doanh và Quản lý' },
  { id: 'kinh-doanh-quoc-te-ta', code: '408E', name: 'Kinh doanh quốc tế (Tiếng Anh)', group: 'Kinh doanh và Quản lý' },
  {
    id: 'logistics-quoc-te',
    code: '420',
    name: 'Kinh doanh quốc tế (Chuyên ngành Quản lý chuỗi cung ứng và Logistics quốc tế)',
    group: 'Kinh doanh và Quản lý',
  },
  { id: 'thuong-mai-dien-tu', code: '411', name: 'Thương mại điện tử', group: 'Kinh doanh và Quản lý' },
  { id: 'thuong-mai-dien-tu-ta', code: '411E', name: 'Thương mại điện tử (Tiếng Anh)', group: 'Kinh doanh và Quản lý' },
  { id: 'tai-chinh-ngan-hang', code: '404', name: 'Tài chính – Ngân hàng', group: 'Kinh doanh và Quản lý' },
  { id: 'tai-chinh-ngan-hang-ta', code: '404E', name: 'Tài chính – Ngân hàng (Tiếng Anh)', group: 'Kinh doanh và Quản lý' },
  { id: 'cong-nghe-tai-chinh', code: '414', name: 'Công nghệ tài chính', group: 'Kinh doanh và Quản lý' },
  {
    id: 'cong-nghe-tai-chinh-coop',
    code: '414H',
    name: 'Công nghệ tài chính (Chương trình Co-operative Education, Tiếng Anh bán phần)',
    group: 'Kinh doanh và Quản lý',
  },
  { id: 'ke-toan', code: '405', name: 'Kế toán', group: 'Kinh doanh và Quản lý' },
  {
    id: 'ke-toan-icaew-ta',
    code: '405E',
    name: 'Kế toán (Tích hợp chứng chỉ quốc tế ICAEW, Tiếng Anh)',
    group: 'Kinh doanh và Quản lý',
  },
  {
    id: 'ke-toan-phan-tich-du-lieu',
    code: '422',
    name: 'Kế toán (Chuyên ngành Kế toán và phân tích dữ liệu)',
    group: 'Kinh doanh và Quản lý',
  },
  { id: 'kiem-toan', code: '409', name: 'Kiểm toán', group: 'Kinh doanh và Quản lý' },
  { id: 'quan-ly-cong', code: '418', name: 'Quản lý công', group: 'Kinh doanh và Quản lý' },
  { id: 'he-thong-thong-tin-quan-ly', code: '406', name: 'Hệ thống thông tin quản lý', group: 'Kinh doanh và Quản lý' },
  {
    id: 'he-thong-thong-tin-quan-ly-coop',
    code: '406H',
    name: 'Hệ thống thông tin quản lý (Chương trình Co-operative Education, Tiếng Anh bán phần)',
    group: 'Kinh doanh và Quản lý',
  },
  {
    id: 'he-thong-thong-tin-quan-ly-ai',
    code: '416',
    name: 'Hệ thống thông tin quản lý (Chuyên ngành Kinh doanh số và trí tuệ nhân tạo)',
    group: 'Kinh doanh và Quản lý',
  },

  // ===== Pháp luật =====
  { id: 'luat-dan-su', code: '503', name: 'Luật (Chuyên ngành Luật Dân sự)', group: 'Pháp luật' },
  { id: 'luat-dan-su-ta', code: '503E', name: 'Luật (Chuyên ngành Luật Dân sự) (Tiếng Anh)', group: 'Pháp luật' },
  { id: 'luat-tai-chinh-ngan-hang', code: '504', name: 'Luật (Chuyên ngành Luật Tài chính - Ngân hàng)', group: 'Pháp luật' },
  { id: 'luat-chinh-sach-cong', code: '505', name: 'Luật (Chuyên ngành Luật và Chính sách công)', group: 'Pháp luật' },
  { id: 'luat-cong-nghe', code: '506', name: 'Luật (Chuyên ngành Luật và Công nghệ)', group: 'Pháp luật' },
  { id: 'luat-kinh-doanh', code: '501', name: 'Luật kinh doanh (Chuyên ngành Luật Kinh doanh)', group: 'Pháp luật' },
  {
    id: 'luat-thuong-mai-quoc-te',
    code: '502',
    name: 'Luật kinh doanh (Chuyên ngành Luật Thương mại quốc tế)',
    group: 'Pháp luật',
  },
  {
    id: 'luat-thuong-mai-quoc-te-ta',
    code: '502E',
    name: 'Luật kinh doanh (Chuyên ngành Luật Thương mại quốc tế) (Tiếng Anh)',
    group: 'Pháp luật',
  },
];
