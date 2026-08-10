/**
 * Thông tin định danh chung cho một "trường" trong nền tảng DiemVao. Cố tình KHÔNG ép buộc
 * calculate()/input schema chung — mỗi trường có công thức, thang điểm, phương thức xét tuyển
 * riêng (xem CLAUDE.md). Contract này chỉ phục vụ hiển thị (tên trường, năm) + registry lookup.
 */
/**
 * - supported: có calculator thật, đã verify formula — render CTA "Tính điểm".
 * - researching: đang research, có thể đã có formula verified trên giấy nhưng CHƯA implement
 *   calculator (chờ phase sau) — render "Đang bổ sung".
 * - formula-incomplete: research chưa tìm đủ công thức từ nguồn đủ tin cậy — render "Chưa đủ
 *   dữ liệu chính thức".
 */
export type SchoolStatus = 'supported' | 'researching' | 'formula-incomplete';

export interface SchoolModule {
  id: string;
  /** Tên đầy đủ, dùng khi cần trình bày trang trọng (school context, footer, share). */
  name: string;
  /** Tên viết tắt/thường dùng, hiển thị ở nơi cần gọn (header, badge). */
  shortName: string;
  year: number;
  status: SchoolStatus;
}
