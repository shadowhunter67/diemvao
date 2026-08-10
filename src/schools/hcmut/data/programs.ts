import type { HcmutProgram } from '../types/programs';

/**
 * DỮ LIỆU CHƯA ĐẦY ĐỦ: HCMUT tuyển sinh 70+ ngành/chương trình, dataset này mới chỉ có 29
 * chương trình có điểm chuẩn xác minh được qua báo chí dẫn nguồn công bố chính thức của
 * trường (xem hcmut-cutoffs.ts để biết nguồn cụ thể từng batch). Không tự bịa thêm ngành
 * hay điểm chuẩn chưa xác minh. Xem README.md mục "Dữ liệu ngành/điểm chuẩn" để biết chi tiết
 * giới hạn.
 */
export const hcmutPrograms: HcmutProgram[] = [
  // Chương trình tiêu chuẩn
  { id: 'khoa-hoc-may-tinh', name: 'Khoa học Máy tính', group: 'Chương trình tiêu chuẩn' },
  { id: 'ky-thuat-may-tinh', name: 'Kỹ thuật Máy tính', group: 'Chương trình tiêu chuẩn' },
  { id: 'khoa-hoc-du-lieu', name: 'Khoa học Dữ liệu', group: 'Chương trình tiêu chuẩn' },
  {
    id: 'nhom-dien-tu-vien-thong-tdh-tkvm',
    name: 'Điện - Điện tử - Viễn thông - Tự động hóa - Thiết kế vi mạch',
    group: 'Chương trình tiêu chuẩn',
  },
  { id: 'ky-thuat-ban-dan', name: 'Kỹ thuật Bán dẫn', group: 'Chương trình tiêu chuẩn' },
  { id: 'ky-thuat-co-dien-tu', name: 'Kỹ thuật Cơ Điện tử', group: 'Chương trình tiêu chuẩn' },
  { id: 'vat-ly-ky-thuat', name: 'Vật lý Kỹ thuật', group: 'Chương trình tiêu chuẩn' },
  { id: 'logistics-he-thong-cong-nghiep', name: 'Logistics và Hệ thống Công nghiệp', group: 'Chương trình tiêu chuẩn' },
  { id: 'ky-thuat-hat-nhan', name: 'Kỹ thuật Hạt nhân', group: 'Chương trình tiêu chuẩn' },
  { id: 'quan-ly-cong-nghiep', name: 'Quản lý Công nghiệp', group: 'Chương trình tiêu chuẩn' },
  {
    id: 'song-nganh-tau-thuy-hang-khong',
    name: 'Song ngành Kỹ thuật Tàu thủy - Kỹ thuật Hàng không',
    group: 'Chương trình tiêu chuẩn',
  },
  { id: 'kinh-te-tuan-hoan', name: 'Kinh tế Tuần hoàn', group: 'Chương trình tiêu chuẩn' },
  { id: 'dia-ky-thuat-xay-dung', name: 'Địa Kỹ thuật Xây dựng', group: 'Chương trình tiêu chuẩn' },
  { id: 'ky-thuat-dia-chat', name: 'Kỹ thuật Địa chất', group: 'Chương trình tiêu chuẩn' },
  { id: 'kinh-te-xay-dung', name: 'Kinh tế Xây dựng', group: 'Chương trình tiêu chuẩn' },
  {
    id: 'xay-dung-quan-ly-du-an-xd-2026',
    name: 'Xây dựng và Quản lý Dự án Xây dựng',
    group: 'Chương trình tiêu chuẩn',
  },
  { id: 'ky-thuat-co-khi', name: 'Kỹ thuật Cơ khí', group: 'Chương trình tiêu chuẩn' },
  { id: 'xay-dung-quan-ly-xd-2025', name: 'Xây dựng và Quản lý xây dựng', group: 'Chương trình tiêu chuẩn' },

  // Chương trình tiếng Anh
  { id: 'thiet-ke-vi-mach-ta', name: 'Thiết kế Vi mạch', group: 'Chương trình tiếng Anh' },
  { id: 'khoa-hoc-may-tinh-ta', name: 'Khoa học Máy tính', group: 'Chương trình tiếng Anh' },
  { id: 'ky-thuat-co-dien-tu-ta', name: 'Kỹ thuật Cơ Điện tử', group: 'Chương trình tiếng Anh' },
  { id: 'ky-thuat-may-tinh-ta', name: 'Kỹ thuật Máy tính', group: 'Chương trình tiếng Anh' },
  { id: 'ky-thuat-dau-khi-ta', name: 'Kỹ thuật Dầu khí', group: 'Chương trình tiếng Anh' },

  // Chương trình tiên tiến / chuyển tiếp quốc tế
  {
    id: 'ky-thuat-dien-dien-tu-tien-tien',
    name: 'Kỹ thuật Điện - Điện tử (Chương trình Tiên tiến)',
    group: 'Chương trình tiên tiến',
  },
  {
    id: 'tri-tue-nhan-tao-sydney',
    name: 'Trí tuệ Nhân tạo (liên kết Đại học Sydney)',
    group: 'Chương trình chuyển tiếp quốc tế',
  },
  {
    id: 'cong-nghe-thong-tin-sydney',
    name: 'Công nghệ Thông tin (liên kết Đại học Sydney)',
    group: 'Chương trình chuyển tiếp quốc tế',
  },
  {
    id: 'ky-thuat-co-khi-chuyen-tiep-my-uc',
    name: 'Kỹ thuật Cơ khí (chuyển tiếp Mỹ/Úc)',
    group: 'Chương trình chuyển tiếp quốc tế',
  },
  {
    id: 'ky-thuat-hang-khong-chuyen-tiep-uc',
    name: 'Kỹ thuật Hàng không (chuyển tiếp Úc)',
    group: 'Chương trình chuyển tiếp quốc tế',
  },
  {
    id: 'khoa-hoc-may-tinh-chuyen-tiep-uc-nz',
    name: 'Khoa học Máy tính (chuyển tiếp Úc/New Zealand)',
    group: 'Chương trình chuyển tiếp quốc tế',
  },
];
