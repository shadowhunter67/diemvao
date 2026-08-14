import type { UsshProgram } from '../types/programs';

/**
 * 52 chương trình xét tuyển USSH 2026 — transcribe TRỰC TIẾP từ 3 ảnh official "ĐIỂM CHUẨN XÉT
 * TUYỂN ĐẠI HỌC CHÍNH QUY NĂM 2026" (mã trường QSX, user cung cấp 2026-08-13, xem `sources.ts`
 * `ussh-cutoff-2026`): Chương trình Chuẩn (2 ảnh, 20+20 dòng), Chương trình Liên kết 2+2 (4 dòng),
 * Chương trình Chuẩn quốc tế (8 dòng). Giữ nguyên mã xét tuyển gốc (hậu tố LK/QT/A1).
 */
export const usshPrograms: UsshProgram[] = [
  // Chương trình Chuẩn — trang 1
  { id: 'ussh-7310401', code: '7310401', name: 'Tâm lý học', track: 'standard' },
  { id: 'ussh-7310403', code: '7310403', name: 'Tâm lý học giáo dục', track: 'standard' },
  { id: 'ussh-7310501', code: '7310501', name: 'Địa lý học', track: 'standard' },
  { id: 'ussh-7310601', code: '7310601', name: 'Quốc tế học', track: 'standard' },
  { id: 'ussh-7310608', code: '7310608', name: 'Đông phương học', track: 'standard' },
  { id: 'ussh-7310613', code: '7310613', name: 'Nhật Bản học', track: 'standard' },
  { id: 'ussh-7310614', code: '7310614', name: 'Hàn quốc học', track: 'standard' },
  { id: 'ussh-7310630', code: '7310630', name: 'Việt Nam học', track: 'standard' },
  { id: 'ussh-7320101', code: '7320101', name: 'Báo chí', track: 'standard' },
  { id: 'ussh-7320104', code: '7320104', name: 'Truyền thông đa phương tiện', track: 'standard' },
  { id: 'ussh-7320108', code: '7320108', name: 'Quan hệ công chúng', track: 'standard' },
  { id: 'ussh-7320201', code: '7320201', name: 'Thông tin thư viện', track: 'standard' },
  { id: 'ussh-7320205', code: '7320205', name: 'Quản lý thông tin', track: 'standard' },
  { id: 'ussh-7320303', code: '7320303', name: 'Lưu trữ học', track: 'standard' },
  { id: 'ussh-7340404', code: '7340404', name: 'Quản trị nhân lực', track: 'standard' },
  { id: 'ussh-7340406', code: '7340406', name: 'Quản trị văn phòng', track: 'standard' },
  { id: 'ussh-7580109', code: '7580109', name: 'Quản lý phát triển đô thị và bất động sản', track: 'standard' },
  { id: 'ussh-7580112', code: '7580112', name: 'Đô thị học', track: 'standard' },
  { id: 'ussh-7760101', code: '7760101', name: 'Công tác xã hội', track: 'standard' },
  { id: 'ussh-7810103', code: '7810103', name: 'Quản trị dịch vụ du lịch và lữ hành', track: 'standard' },
  { id: 'ussh-73106A1', code: '73106A1', name: 'Kinh doanh thương mại Hàn Quốc', track: 'standard' },
  // Chương trình Chuẩn — trang 2
  { id: 'ussh-7140101', code: '7140101', name: 'Giáo dục học', track: 'standard' },
  { id: 'ussh-7140107', code: '7140107', name: 'Quản trị chất lượng giáo dục', track: 'standard' },
  { id: 'ussh-7140114', code: '7140114', name: 'Quản lý giáo dục', track: 'standard' },
  { id: 'ussh-7210213', code: '7210213', name: 'Nghệ thuật học', track: 'standard' },
  { id: 'ussh-7220104', code: '7220104', name: 'Hán Nôm', track: 'standard' },
  { id: 'ussh-7220201', code: '7220201', name: 'Ngôn ngữ Anh', track: 'standard' },
  { id: 'ussh-7220202', code: '7220202', name: 'Ngôn ngữ Nga', track: 'standard' },
  { id: 'ussh-7220203', code: '7220203', name: 'Ngôn ngữ Pháp', track: 'standard' },
  { id: 'ussh-7220204', code: '7220204', name: 'Ngôn ngữ Trung Quốc', track: 'standard' },
  { id: 'ussh-7220205', code: '7220205', name: 'Ngôn ngữ Đức', track: 'standard' },
  { id: 'ussh-7220206', code: '7220206', name: 'Ngôn ngữ Tây Ban Nha', track: 'standard' },
  { id: 'ussh-7220208', code: '7220208', name: 'Ngôn ngữ Italia', track: 'standard' },
  { id: 'ussh-7229001', code: '7229001', name: 'Triết học', track: 'standard' },
  { id: 'ussh-7229009', code: '7229009', name: 'Tôn giáo học', track: 'standard' },
  { id: 'ussh-7229010', code: '7229010', name: 'Lịch sử', track: 'standard' },
  { id: 'ussh-7229020', code: '7229020', name: 'Ngôn ngữ học', track: 'standard' },
  { id: 'ussh-7229030', code: '7229030', name: 'Văn học', track: 'standard' },
  { id: 'ussh-7229040', code: '7229040', name: 'Văn hoá học', track: 'standard' },
  { id: 'ussh-7310206', code: '7310206', name: 'Quan hệ quốc tế', track: 'standard' },
  { id: 'ussh-7310301', code: '7310301', name: 'Xã hội học', track: 'standard' },
  { id: 'ussh-7310302', code: '7310302', name: 'Nhân học', track: 'standard' },
  // Chương trình Liên kết 2+2
  { id: 'ussh-7220201LK', code: '7220201LK', name: 'Ngôn ngữ Anh', track: 'linked-2-2' },
  { id: 'ussh-7220204LK', code: '7220204LK', name: 'Ngôn ngữ Trung Quốc', track: 'linked-2-2' },
  { id: 'ussh-7310206LK', code: '7310206LK', name: 'Quan hệ quốc tế', track: 'linked-2-2' },
  { id: 'ussh-7320101LK', code: '7320101LK', name: 'Truyền thông chuyên ngành báo chí', track: 'linked-2-2' },
  // Chương trình Chuẩn quốc tế
  { id: 'ussh-7220201QT', code: '7220201QT', name: 'Ngôn ngữ Anh', track: 'international-standard' },
  { id: 'ussh-7220204QT', code: '7220204QT', name: 'Ngôn ngữ Trung Quốc', track: 'international-standard' },
  { id: 'ussh-7220205QT', code: '7220205QT', name: 'Ngôn ngữ Đức', track: 'international-standard' },
  { id: 'ussh-7310206QT', code: '7310206QT', name: 'Quan hệ quốc tế', track: 'international-standard' },
  { id: 'ussh-7310401QT', code: '7310401QT', name: 'Tâm lý học', track: 'international-standard' },
  { id: 'ussh-7310613QT', code: '7310613QT', name: 'Nhật Bản học', track: 'international-standard' },
  { id: 'ussh-7320101QT', code: '7320101QT', name: 'Báo chí', track: 'international-standard' },
  { id: 'ussh-7810103QT', code: '7810103QT', name: 'Quản trị dịch vụ du lịch và lữ hành', track: 'international-standard' },
];
