/**
 * Thông tin định danh chung cho một "trường" trong nền tảng DiemVao. Cố tình KHÔNG ép buộc
 * calculate()/input schema chung — mỗi trường có công thức, thang điểm, phương thức xét tuyển
 * riêng (xem CLAUDE.md). Contract này chỉ phục vụ hiển thị (tên trường, năm) + registry lookup.
 */
export interface SchoolModule {
  id: string;
  /** Tên đầy đủ, dùng khi cần trình bày trang trọng (school context, footer, share). */
  name: string;
  /** Tên viết tắt/thường dùng, hiển thị ở nơi cần gọn (header, badge). */
  shortName: string;
  year: number;
}
