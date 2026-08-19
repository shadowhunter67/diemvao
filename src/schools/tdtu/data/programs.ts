import type { TdtuProgram } from '../types/programs';

/**
 * Danh mục 119 ngành/chương trình TDTU 2026, đọc trực tiếp từ Phụ lục 2 (`sources.ts:tdtu-pl2-
 * programs-pt1-2026`, PDF text-layer 24 trang) bằng `pdftotext -layout -enc UTF-8` rồi đối chiếu
 * thủ công STT/Mã ngành/Tên ngành từng dòng — KHÔNG qua OCR ảnh.
 *
 * PHẠM VI IMPORT: chỉ `id`/`code`/`name`/`group` (danh mục ngành) — đã đối chiếu đủ 119/119 dòng,
 * mã ngành không trùng lặp. CHƯA import "Tổ hợp xét tuyển" (nhiều tổ hợp/dòng) và "Môn điều kiện"/
 * "Ngưỡng đầu vào 2026" riêng ngành: bảng gốc trải nhiều dòng multi-line/multi-combo bị ngắt trang
 * giữa ô (đặc biệt cụm STT 15-19 Tài chính-Ngân hàng/Công nghệ tài chính/Kế toán và cụm STT 47-52
 * Bảo hộ lao động..Khoa học dữ liệu) khiến `pdftotext -layout` xáo trộn tổ hợp giữa các dòng liền kề
 * — không đủ tin cậy để gán tổ hợp cho đúng ngành mà không có rủi ro sai lệch. Xem
 * `knowledgeGaps.ts:tdtu-program-catalog-not-imported` cho phần còn lại chưa import.
 *
 * `code` = mã ngành chính thức TDTU công bố (bao gồm tiền tố F/FA/D/K/P phân biệt chương trình tiên
 * tiến/đại học-dự bị đại học bằng tiếng Anh/liên kết quốc tế/dự bị liên kết quốc tế — TDTU dùng tiền
 * tố này làm mã ngành riêng, không phải cùng ngành trùng mã). `id` = `code` viết thường, ổn định,
 * tra ngược 1-1 với mã ngành gốc.
 */
export const tdtuPrograms: TdtuProgram[] = [
  // Chương trình tiêu chuẩn (STT 1-52)
  { id: '7220201', code: '7220201', name: 'Ngôn ngữ Anh', group: 'Chương trình tiêu chuẩn' },
  { id: '7220204', code: '7220204', name: 'Ngôn ngữ Trung Quốc', group: 'Chương trình tiêu chuẩn' },
  { id: '7810101', code: '7810101', name: 'Du lịch (Chuyên ngành Quản lý du lịch)', group: 'Chương trình tiêu chuẩn' },
  { id: '7810101h', code: '7810101H', name: 'Du lịch (Chuyên ngành Hướng dẫn du lịch)', group: 'Chương trình tiêu chuẩn' },
  { id: '7310301', code: '7310301', name: 'Xã hội học', group: 'Chương trình tiêu chuẩn' },
  { id: '7760101', code: '7760101', name: 'Công tác xã hội', group: 'Chương trình tiêu chuẩn' },
  { id: '7310206', code: '7310206', name: 'Quan hệ quốc tế', group: 'Chương trình tiêu chuẩn' },
  { id: '7310630', code: '7310630', name: 'Việt Nam học', group: 'Chương trình tiêu chuẩn' },
  { id: '7340101', code: '7340101', name: 'Quản trị kinh doanh (Chuyên ngành Quản trị nhà hàng - khách sạn)', group: 'Chương trình tiêu chuẩn' },
  { id: '7340101c', code: '7340101C', name: 'Quản trị kinh doanh (Chuyên ngành Quản trị chuỗi cung ứng)', group: 'Chương trình tiêu chuẩn' },
  { id: '7340404', code: '7340404', name: 'Quản trị nhân lực', group: 'Chương trình tiêu chuẩn' },
  { id: '7340115', code: '7340115', name: 'Marketing', group: 'Chương trình tiêu chuẩn' },
  { id: '7340120', code: '7340120', name: 'Kinh doanh quốc tế', group: 'Chương trình tiêu chuẩn' },
  { id: '7340408', code: '7340408', name: 'Quan hệ lao động (Chuyên ngành Quản lý quan hệ lao động, Chuyên ngành Hành vi tổ chức)', group: 'Chương trình tiêu chuẩn' },
  { id: '7340201', code: '7340201', name: 'Tài chính - Ngân hàng', group: 'Chương trình tiêu chuẩn' },
  { id: '7340201q', code: '7340201Q', name: 'Tài chính - Ngân hàng (Chuyên ngành Tài chính quốc tế)', group: 'Chương trình tiêu chuẩn' },
  { id: '7340205', code: '7340205', name: 'Công nghệ tài chính', group: 'Chương trình tiêu chuẩn' },
  { id: '7340301', code: '7340301', name: 'Kế toán', group: 'Chương trình tiêu chuẩn' },
  { id: '7340302', code: '7340302', name: 'Kiểm toán (Chuyên ngành Kiểm toán và Phân tích dữ liệu)', group: 'Chương trình tiêu chuẩn' },
  { id: '7380101', code: '7380101', name: 'Luật', group: 'Chương trình tiêu chuẩn' },
  { id: '7720201', code: '7720201', name: 'Dược học', group: 'Chương trình tiêu chuẩn' },
  { id: '7420204', code: '7420204', name: 'Khoa học y sinh', group: 'Chương trình tiêu chuẩn' },
  { id: '7420201', code: '7420201', name: 'Công nghệ sinh học', group: 'Chương trình tiêu chuẩn' },
  { id: '7520301', code: '7520301', name: 'Kỹ thuật hóa học', group: 'Chương trình tiêu chuẩn' },
  { id: '7480101', code: '7480101', name: 'Khoa học máy tính', group: 'Chương trình tiêu chuẩn' },
  { id: '7480102', code: '7480102', name: 'Mạng máy tính và truyền thông dữ liệu', group: 'Chương trình tiêu chuẩn' },
  { id: '7480103', code: '7480103', name: 'Kỹ thuật phần mềm', group: 'Chương trình tiêu chuẩn' },
  { id: '7480104', code: '7480104', name: 'Hệ thống thông tin', group: 'Chương trình tiêu chuẩn' },
  { id: '7520201', code: '7520201', name: 'Kỹ thuật điện', group: 'Chương trình tiêu chuẩn' },
  { id: '7520207', code: '7520207', name: 'Kỹ thuật điện tử - viễn thông', group: 'Chương trình tiêu chuẩn' },
  {
    id: '7520207t',
    code: '7520207T',
    name: 'Kỹ thuật điện tử - viễn thông (Chuyên ngành Kỹ thuật thiết kế vi mạch bán dẫn)',
    group: 'Chương trình tiêu chuẩn',
  },
  { id: '7520216', code: '7520216', name: 'Kỹ thuật điều khiển và tự động hóa', group: 'Chương trình tiêu chuẩn' },
  { id: '7520114', code: '7520114', name: 'Kỹ thuật cơ điện tử', group: 'Chương trình tiêu chuẩn' },
  { id: '7580201', code: '7580201', name: 'Kỹ thuật xây dựng', group: 'Chương trình tiêu chuẩn' },
  { id: '7580205', code: '7580205', name: 'Kỹ thuật xây dựng công trình giao thông', group: 'Chương trình tiêu chuẩn' },
  { id: '7580302', code: '7580302', name: 'Quản lý xây dựng', group: 'Chương trình tiêu chuẩn' },
  { id: '7580101', code: '7580101', name: 'Kiến trúc', group: 'Chương trình tiêu chuẩn' },
  { id: '7580104', code: '7580104', name: 'Kiến trúc đô thị', group: 'Chương trình tiêu chuẩn' },
  { id: '7580105', code: '7580105', name: 'Quy hoạch vùng và đô thị', group: 'Chương trình tiêu chuẩn' },
  { id: '7580108', code: '7580108', name: 'Thiết kế nội thất', group: 'Chương trình tiêu chuẩn' },
  { id: '7210403', code: '7210403', name: 'Thiết kế đồ họa', group: 'Chương trình tiêu chuẩn' },
  { id: '7210404', code: '7210404', name: 'Thiết kế thời trang', group: 'Chương trình tiêu chuẩn' },
  { id: '7210408', code: '7210408', name: 'Nghệ thuật số (Chuyên ngành Thiết kế truyền thông số)', group: 'Chương trình tiêu chuẩn' },
  {
    id: '7810301',
    code: '7810301',
    name: 'Quản lý thể dục thể thao (Chuyên ngành Kinh doanh thể thao và tổ chức sự kiện)',
    group: 'Chương trình tiêu chuẩn',
  },
  { id: '7810301g', code: '7810301G', name: 'Quản lý thể dục thể thao (Chuyên ngành Golf)', group: 'Chương trình tiêu chuẩn' },
  {
    id: '7810301t',
    code: '7810301T',
    name: 'Quản lý thể dục thể thao (Chuyên ngành Truyền thông và tiếp thị thể thao)',
    group: 'Chương trình tiêu chuẩn',
  },
  { id: '7850201', code: '7850201', name: 'Bảo hộ lao động', group: 'Chương trình tiêu chuẩn' },
  { id: '7440301', code: '7440301', name: 'Khoa học môi trường', group: 'Chương trình tiêu chuẩn' },
  {
    id: '7520320',
    code: '7520320',
    name: 'Kỹ thuật môi trường (Chuyên ngành Môi trường và Phát triển bền vững)',
    group: 'Chương trình tiêu chuẩn',
  },
  { id: '7460112', code: '7460112', name: 'Toán ứng dụng', group: 'Chương trình tiêu chuẩn' },
  { id: '7460201', code: '7460201', name: 'Thống kê', group: 'Chương trình tiêu chuẩn' },
  { id: '7460108', code: '7460108', name: 'Khoa học dữ liệu', group: 'Chương trình tiêu chuẩn' },

  // Chương trình tiên tiến (STT 53-72)
  { id: 'f7210403', code: 'F7210403', name: 'Thiết kế đồ họa - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7220201', code: 'F7220201', name: 'Ngôn ngữ Anh - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7220204', code: 'F7220204', name: 'Ngôn ngữ Trung Quốc - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7310301', code: 'F7310301', name: 'Xã hội học - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7340115', code: 'F7340115', name: 'Marketing - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  {
    id: 'f7340101',
    code: 'F7340101',
    name: 'Quản trị kinh doanh (Chuyên ngành Quản trị nhà hàng - khách sạn) - Chương trình tiên tiến',
    group: 'Chương trình tiên tiến',
  },
  { id: 'f7340120', code: 'F7340120', name: 'Kinh doanh quốc tế - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7340201', code: 'F7340201', name: 'Tài chính - Ngân hàng - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7340301', code: 'F7340301', name: 'Kế toán - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7380101', code: 'F7380101', name: 'Luật (Định hướng Luật kinh tế) - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  {
    id: 'f7380101t',
    code: 'F7380101T',
    name: 'Luật (Định hướng Luật thương mại quốc tế) - Chương trình tiên tiến',
    group: 'Chương trình tiên tiến',
  },
  { id: 'f7420201', code: 'F7420201', name: 'Công nghệ sinh học - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7480101', code: 'F7480101', name: 'Khoa học máy tính - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7480103', code: 'F7480103', name: 'Kỹ thuật phần mềm - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7520201', code: 'F7520201', name: 'Kỹ thuật điện - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7520207', code: 'F7520207', name: 'Kỹ thuật điện tử - viễn thông - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  {
    id: 'f7520216',
    code: 'F7520216',
    name: 'Kỹ thuật điều khiển và tự động hóa - Chương trình tiên tiến',
    group: 'Chương trình tiên tiến',
  },
  { id: 'f7580201', code: 'F7580201', name: 'Kỹ thuật xây dựng - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7520301', code: 'F7520301', name: 'Kỹ thuật hóa học - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },
  { id: 'f7580101', code: 'F7580101', name: 'Kiến trúc - Chương trình tiên tiến', group: 'Chương trình tiên tiến' },

  // Chương trình đại học bằng tiếng Anh (STT 73-83)
  { id: 'fa7220201', code: 'FA7220201', name: 'Ngôn ngữ Anh - Chương trình đại học bằng tiếng Anh', group: 'Chương trình đại học bằng tiếng Anh' },
  { id: 'fa7340115', code: 'FA7340115', name: 'Marketing - Chương trình đại học bằng tiếng Anh', group: 'Chương trình đại học bằng tiếng Anh' },
  {
    id: 'fa7340101',
    code: 'FA7340101',
    name: 'Quản trị kinh doanh (Chuyên ngành: Quản trị nhà hàng - khách sạn) - Chương trình đại học bằng tiếng Anh',
    group: 'Chương trình đại học bằng tiếng Anh',
  },
  { id: 'fa7340120', code: 'FA7340120', name: 'Kinh doanh quốc tế - Chương trình đại học bằng tiếng Anh', group: 'Chương trình đại học bằng tiếng Anh' },
  { id: 'fa7420201', code: 'FA7420201', name: 'Công nghệ sinh học - Chương trình đại học bằng tiếng Anh', group: 'Chương trình đại học bằng tiếng Anh' },
  { id: 'fa7480101', code: 'FA7480101', name: 'Khoa học máy tính - Chương trình đại học bằng tiếng Anh', group: 'Chương trình đại học bằng tiếng Anh' },
  { id: 'fa7480103', code: 'FA7480103', name: 'Kỹ thuật phần mềm - Chương trình đại học bằng tiếng Anh', group: 'Chương trình đại học bằng tiếng Anh' },
  {
    id: 'fa7520216',
    code: 'FA7520216',
    name: 'Kỹ thuật điều khiển và tự động hóa - Chương trình đại học bằng tiếng Anh',
    group: 'Chương trình đại học bằng tiếng Anh',
  },
  { id: 'fa7580201', code: 'FA7580201', name: 'Kỹ thuật xây dựng - Chương trình đại học bằng tiếng Anh', group: 'Chương trình đại học bằng tiếng Anh' },
  {
    id: 'fa7340301',
    code: 'FA7340301',
    name: 'Kế toán (Chuyên ngành: Kế toán quốc tế) - Chương trình đại học bằng tiếng Anh',
    group: 'Chương trình đại học bằng tiếng Anh',
  },
  { id: 'fa7340201', code: 'FA7340201', name: 'Tài chính ngân hàng - Chương trình đại học bằng tiếng Anh', group: 'Chương trình đại học bằng tiếng Anh' },

  // Chương trình dự bị đại học bằng tiếng Anh (STT 84-93)
  { id: 'd7340115', code: 'D7340115', name: 'Marketing - Chương trình dự bị đại học bằng tiếng Anh', group: 'Chương trình dự bị đại học bằng tiếng Anh' },
  {
    id: 'd7340101',
    code: 'D7340101',
    name: 'Quản trị kinh doanh (Chuyên ngành: Quản trị nhà hàng - khách sạn) - Chương trình dự bị đại học bằng tiếng Anh',
    group: 'Chương trình dự bị đại học bằng tiếng Anh',
  },
  { id: 'd7340120', code: 'D7340120', name: 'Kinh doanh quốc tế - Chương trình dự bị đại học bằng tiếng Anh', group: 'Chương trình dự bị đại học bằng tiếng Anh' },
  { id: 'd7420201', code: 'D7420201', name: 'Công nghệ sinh học - Chương trình dự bị đại học bằng tiếng Anh', group: 'Chương trình dự bị đại học bằng tiếng Anh' },
  { id: 'd7480101', code: 'D7480101', name: 'Khoa học máy tính - Chương trình dự bị đại học bằng tiếng Anh', group: 'Chương trình dự bị đại học bằng tiếng Anh' },
  { id: 'd7480103', code: 'D7480103', name: 'Kỹ thuật phần mềm - Chương trình dự bị đại học bằng tiếng Anh', group: 'Chương trình dự bị đại học bằng tiếng Anh' },
  {
    id: 'd7520216',
    code: 'D7520216',
    name: 'Kỹ thuật điều khiển và tự động hóa - Chương trình dự bị đại học bằng tiếng Anh',
    group: 'Chương trình dự bị đại học bằng tiếng Anh',
  },
  { id: 'd7580201', code: 'D7580201', name: 'Kỹ thuật xây dựng - Chương trình dự bị đại học bằng tiếng Anh', group: 'Chương trình dự bị đại học bằng tiếng Anh' },
  {
    id: 'd7340301',
    code: 'D7340301',
    name: 'Kế toán (Chuyên ngành: Kế toán quốc tế) - Chương trình dự bị đại học bằng tiếng Anh',
    group: 'Chương trình dự bị đại học bằng tiếng Anh',
  },
  { id: 'd7340201', code: 'D7340201', name: 'Tài chính ngân hàng - Chương trình dự bị đại học bằng tiếng Anh', group: 'Chương trình dự bị đại học bằng tiếng Anh' },

  // Chương trình liên kết quốc tế (STT 94-107)
  {
    id: 'k7340101',
    code: 'K7340101',
    name: 'Quản trị kinh doanh (song bằng 2+2) - Chương trình liên kết Trường Đại học Kinh tế và Kinh doanh Praha (Cộng Hòa Séc)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7340101n',
    code: 'K7340101N',
    name: "Quản trị nhà hàng - khách sạn (song bằng 2,5+1,5) - Chương trình liên kết Đại học Taylor's (Malaysia)",
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7340201c',
    code: 'K7340201C',
    name: 'Tài chính và kiểm soát (song bằng 3+1, đơn bằng 2+2) - Chương trình liên kết Đại học khoa học ứng dụng Saxion (Hà Lan)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7340301c',
    code: 'K7340301C',
    name:
      'Kế toán (song bằng 3+1) – Chương trình liên kết Đại học West of England, Bristol (Vương quốc Anh); Chương trình liên kết Đại học khoa học ứng dụng Saxion (Hà Lan)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7520201',
    code: 'K7520201',
    name: 'Kỹ thuật điện – điện tử (song bằng 2+2) - Chương trình liên kết Đại học khoa học ứng dụng Saxion (Hà Lan)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7580201',
    code: 'K7580201',
    name: 'Kỹ thuật xây dựng (song bằng 2+2) - Chương trình liên kết Đại học La Trobe (Úc)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7480101l',
    code: 'K7480101L',
    name: 'Công nghệ thông tin (song bằng 2+2) - Chương trình liên kết Đại học La Trobe (Úc)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7340120l',
    code: 'K7340120L',
    name: 'Kinh doanh quốc tế (song bằng 3+1) - Chương trình liên kết Đại học La Trobe (Úc)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7480101t',
    code: 'K7480101T',
    name: 'Khoa học máy tính (đơn bằng 2+2) - Chương trình liên kết Đại học Kỹ thuật Ostrava (CH Séc)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7340101e',
    code: 'K7340101E',
    name: 'Quản trị kinh doanh toàn cầu (đơn bằng 2+2) - Chương trình liên kết Trường Kinh doanh Emlyon (Pháp)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7340101d',
    code: 'K7340101D',
    name: 'Kinh doanh toàn cầu (đơn bằng 2,5+1,5) - Chương trình liên kết Trường đại học Văn hóa Trung Quốc (Đài Loan)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7340101m',
    code: 'K7340101M',
    name:
      'Kinh doanh (Tài chính, Kinh doanh quốc tế, Marketing, Kế toán, Quản trị nguồn nhân lực & Quan hệ lao động) (đơn bằng 2+1,5) - Chương trình liên kết Đại học Massey (New Zealand)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7220201',
    code: 'K7220201',
    name: 'Ngôn ngữ Anh (đơn bằng 3+1) - Chương trình liên kết Đại học West of England, Bristol (Vương quốc Anh)',
    group: 'Chương trình liên kết quốc tế',
  },
  {
    id: 'k7220204',
    code: 'K7220204',
    name: 'Ngôn ngữ Trung Quốc (song bằng 2+2) - Chương trình liên kết Đại học Sư phạm Thượng Hải (Trung Quốc)',
    group: 'Chương trình liên kết quốc tế',
  },

  // Chương trình dự bị liên kết quốc tế (STT 108-119)
  {
    id: 'p7340101',
    code: 'P7340101',
    name: 'Quản trị kinh doanh (song bằng 2+2) - Chương trình dự bị liên kết Trường Đại học Kinh tế và Kinh doanh Praha (Cộng Hòa Séc)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7340101n',
    code: 'P7340101N',
    name: "Quản trị nhà hàng - khách sạn (song bằng 2,5+1,5) - Chương trình dự bị liên kết Đại học Taylor's (Malaysia)",
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7340201c',
    code: 'P7340201C',
    name: 'Tài chính và kiểm soát (song bằng 3+1, đơn bằng 2+2) - Chương trình dự bị liên kết Đại học khoa học ứng dụng Saxion (Hà Lan)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7340301c',
    code: 'P7340301C',
    name:
      'Kế toán (song bằng 3+1) – Chương trình dự bị liên kết Đại học West of England, Bristol (Vương quốc Anh); Chương trình dự bị liên kết Đại học khoa học ứng dụng Saxion (Hà Lan)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7520201',
    code: 'P7520201',
    name: 'Kỹ thuật điện – điện tử (song bằng 2+2) - Chương trình dự bị liên kết Đại học khoa học ứng dụng Saxion (Hà Lan)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7580201',
    code: 'P7580201',
    name: 'Kỹ thuật xây dựng (song bằng 2+2) - Chương trình dự bị liên kết Đại học La Trobe (Úc)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7480101l',
    code: 'P7480101L',
    name: 'Công nghệ thông tin (song bằng 2+2) - Chương trình dự bị liên kết Đại học La Trobe (Úc)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7340120l',
    code: 'P7340120L',
    name: 'Kinh doanh quốc tế (song bằng 3+1) - Chương trình dự bị liên kết Đại học La Trobe (Úc)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7480101t',
    code: 'P7480101T',
    name: 'Khoa học máy tính (đơn bằng 2+2) - Chương trình dự bị liên kết Đại học Kỹ thuật Ostrava (CH Séc)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7340101e',
    code: 'P7340101E',
    name: 'Quản trị kinh doanh toàn cầu (đơn bằng 2+2) - Chương trình dự bị liên kết Trường Kinh doanh Emlyon (Pháp)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7340101m',
    code: 'P7340101M',
    name:
      'Kinh doanh (Tài chính, Kinh doanh quốc tế, Marketing, Kế toán, Quản trị nguồn nhân lực & Quan hệ lao động) (đơn bằng 2+1,5) - Chương trình dự bị liên kết Đại học Massey (New Zealand)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
  {
    id: 'p7340101d',
    code: 'P7340101D',
    name: 'Kinh doanh toàn cầu (đơn bằng 2,5+1,5) - Chương trình dự bị liên kết Trường đại học Văn hóa Trung Quốc (Đài Loan)',
    group: 'Chương trình dự bị liên kết quốc tế',
  },
];

export function getTdtuProgramById(id: string): TdtuProgram | undefined {
  return tdtuPrograms.find((program) => program.id === id);
}

export type TdtuProgramDatasetIssueType = 'duplicate-id' | 'duplicate-code' | 'empty-name' | 'unexpected-row-count';

export interface TdtuProgramDatasetIssue {
  type: TdtuProgramDatasetIssueType;
  message: string;
}

/** Con số 119 do chính TDTU công bố ở tiêu đề Phụ lục 2 ("119 dòng ngành/chương trình"). */
export const TDTU_EXPECTED_PROGRAM_COUNT = 119;

export function validateTdtuProgramCatalog(programs: TdtuProgram[] = tdtuPrograms): TdtuProgramDatasetIssue[] {
  const issues: TdtuProgramDatasetIssue[] = [];

  const seenIds = new Set<string>();
  const seenCodes = new Set<string>();
  for (const program of programs) {
    if (seenIds.has(program.id)) {
      issues.push({ type: 'duplicate-id', message: `Trùng id ngành: "${program.id}"` });
    }
    seenIds.add(program.id);

    if (seenCodes.has(program.code)) {
      issues.push({ type: 'duplicate-code', message: `Trùng mã ngành: "${program.code}"` });
    }
    seenCodes.add(program.code);

    if (program.name.trim() === '') {
      issues.push({ type: 'empty-name', message: `Tên ngành trống cho mã "${program.code}"` });
    }
  }

  if (programs.length !== TDTU_EXPECTED_PROGRAM_COUNT) {
    issues.push({
      type: 'unexpected-row-count',
      message: `Số ngành hiện có (${programs.length}) khác con số TDTU công bố (${TDTU_EXPECTED_PROGRAM_COUNT})`,
    });
  }

  return issues;
}
