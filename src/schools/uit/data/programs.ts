import type { UitProgram } from '../types/programs';

/**
 * 19 ngành UIT có điểm chuẩn 2026 công bố chính thức (xem cutoffs.ts). Không tự thêm ngành
 * chưa có nguồn — danh sách này khớp đúng bảng "Công bố điểm chuẩn trúng tuyển năm 2026,
 * phương thức xét tuyển tổng hợp" của trường.
 */
export const uitPrograms: UitProgram[] = [
  { id: 'truyen-thong-da-phuong-tien', code: '7320104', name: 'Truyền thông Đa phương tiện' },
  { id: 'thuong-mai-dien-tu', code: '7340122', name: 'Thương mại điện tử' },
  { id: 'khoa-hoc-du-lieu', code: '7460108', name: 'Khoa học dữ liệu' },
  {
    id: 'khoa-hoc-du-lieu-ta',
    code: '7460108TA',
    name: 'Khoa học dữ liệu (Chương trình dạy và học bằng tiếng Anh)',
  },
  { id: 'khoa-hoc-may-tinh', code: '7480101', name: 'Khoa học máy tính' },
  {
    id: 'khoa-hoc-may-tinh-ta',
    code: '7480101TA',
    name: 'Khoa học máy tính (Chương trình dạy và học bằng tiếng Anh)',
  },
  { id: 'mang-may-tinh-va-truyen-thong-du-lieu', code: '7480102', name: 'Mạng máy tính và truyền thông dữ liệu' },
  { id: 'ky-thuat-phan-mem', code: '7480103', name: 'Kỹ thuật phần mềm' },
  {
    id: 'ky-thuat-phan-mem-ta',
    code: '7480103TA',
    name: 'Kỹ thuật phần mềm (Chương trình dạy và học bằng tiếng Anh)',
  },
  { id: 'he-thong-thong-tin', code: '7480104', name: 'Hệ thống thông tin' },
  { id: 'he-thong-thong-tin-tt', code: '7480104TT', name: 'Hệ thống thông tin (Chương trình tiên tiến)' },
  { id: 'ky-thuat-may-tinh', code: '7480106', name: 'Kỹ thuật máy tính' },
  { id: 'tri-tue-nhan-tao', code: '7480107', name: 'Trí tuệ nhân tạo' },
  { id: 'cong-nghe-thong-tin', code: '7480201', name: 'Công nghệ thông tin' },
  { id: 'cong-nghe-thong-tin-viet-nhat', code: '7480201VN', name: 'Công nghệ thông tin Việt Nhật' },
  { id: 'an-toan-thong-tin', code: '7480202', name: 'An toàn thông tin' },
  {
    id: 'an-toan-thong-tin-ta',
    code: '7480202TA',
    name: 'An toàn thông tin (Chương trình dạy và học bằng tiếng Anh)',
  },
  { id: 'thiet-ke-vi-mach', code: '75202A1', name: 'Thiết kế vi mạch' },
  {
    id: 'thiet-ke-vi-mach-ta',
    code: '75202A1TA',
    name: 'Thiết kế vi mạch (Chương trình dạy và học bằng tiếng Anh)',
  },
];
