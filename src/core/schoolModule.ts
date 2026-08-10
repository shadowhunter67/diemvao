import type { ReactElement } from 'react';

/**
 * Thông tin định danh chung cho một "trường" trong nền tảng Uniscore. Cố tình KHÔNG ép buộc
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
  /**
   * Mô tả capability thật, override wording status mặc định trên LandingPage khi cần chính xác
   * hơn (vd 1 trường researching nhưng đã có eligibility/bonus/cutoff thật, khác hẳn 1 trường
   * researching mới chỉ có định danh). Bỏ trống thì LandingPage dùng wording mặc định theo status.
   */
  summary?: string;
  /**
   * Component trang riêng của trường (calculator thật, hoặc trang thông tin nếu chưa đủ nguồn
   * để tính điểm). App shell chỉ biết render `<Page />` khi có — không biết/không cần biết bên
   * trong là gì. Không bắt buộc: trường chưa có gì để hiển thị thì bỏ trống, LandingPage tự ẩn
   * CTA tương ứng.
   */
  Page?: (props: { onChangeSchool: () => void }) => ReactElement;
}
