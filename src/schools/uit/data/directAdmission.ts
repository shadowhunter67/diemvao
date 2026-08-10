/**
 * Tuyển thẳng theo Điều 8 Quy chế tuyển sinh đại học Bộ GD&ĐT 2026 — route tuyển sinh TÁCH BIỆT
 * hoàn toàn khỏi công thức xét tuyển tổng hợp (combined score), không cộng điểm vào công thức.
 * Nguồn: sources.ts, id 'uit-direct-admission-2026'.
 */
export interface UitDirectAdmissionGroup {
  condition: string;
  applicablePrograms: string;
}

export const UIT_DIRECT_ADMISSION_GROUPS: UitDirectAdmissionGroup[] = [
  {
    condition:
      'Giải Nhất/Nhì/Ba/Khuyến khích HSG quốc gia môn Tin học, Toán, Vật lý, Hóa học, Ngữ văn, Tiếng Anh; hoặc huy chương Vàng/Bạc/Đồng Olympic Khoa học Quốc tế (Toán, Tin học, Vật lý, Hóa học) — trong thời gian học THPT.',
    applicablePrograms:
      'Tất cả các ngành, trừ Kỹ thuật Máy tính và Thiết kế Vi mạch (cả 2 chương trình) không xét Ngữ văn; Truyền thông Đa phương tiện không xét Hóa học.',
  },
  {
    condition:
      'Giải Nhất/Nhì/Ba/Khuyến khích HSG quốc gia môn Sinh học; hoặc huy chương Vàng/Bạc/Đồng Olympic Khoa học Quốc tế môn Sinh học — trong thời gian học THPT.',
    applicablePrograms: 'Khoa học Dữ liệu, Mạng máy tính và truyền thông dữ liệu, Hệ thống Thông tin, Hệ thống Thông tin (tiên tiến).',
  },
  {
    condition: 'Giải Nhất/Nhì/Ba/Khuyến khích HSG quốc gia môn Lịch sử, Địa lý — trong thời gian học THPT.',
    applicablePrograms: 'Truyền thông Đa phương tiện.',
  },
  {
    condition: 'Giải Nhất/Nhì/Ba/Khuyến khích HSG quốc gia môn Tiếng Nhật — trong thời gian học THPT.',
    applicablePrograms: 'Công nghệ Thông tin Việt Nhật.',
  },
];

export const UIT_DIRECT_ADMISSION_NOTES = [
  'Chương trình dạy và học bằng tiếng Anh: bắt buộc có chứng chỉ tiếng Anh tương đương IELTS 5.0 trở lên.',
  'Tối đa 3 nguyện vọng đăng ký xét tuyển vào UIT theo diện tuyển thẳng.',
  'Đăng ký qua hệ thống riêng của trường (dkxt.uit.edu.vn), khác quy trình xét tuyển tổng hợp.',
];
