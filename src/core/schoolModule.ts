import type { ReactElement } from 'react';

/**
 * Thông tin định danh chung cho một "trường" trong nền tảng UniscoreVN. Cố tình KHÔNG ép buộc
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

/**
 * Mô tả capability thật ở mức chi tiết hơn `status` — một trường có thể có info/cutoff/
 * eligibility mà KHÔNG có exact calculator (như UIT, UEL), khác hẳn `status: 'researching'`
 * dùng chung cho cả trường "researching mới chỉ có định danh" lẫn "researching đã có info/
 * cutoff/eligibility thật". Optional, additive migration — trường chưa set field này (HCMUT,
 * các trường identity-only) vẫn hoạt động bình thường, LandingPage tự suy ra từ `status`.
 */
export interface SchoolCapabilities {
  admissionInfo: boolean;
  programs: boolean;
  eligibility: boolean;
  cutoffs: boolean;
  scoreConversion: boolean;
  exactCalculator: boolean;
  /**
   * True khi trường có công cụ tính ra một điểm số/thành phần THẬT (không chỉ quy đổi 1 chiều)
   * dù chưa đủ dữ liệu ra điểm xét tuyển cuối — vd UEL: quy đổi ĐGNL + ưu tiên + kiểm tra ngưỡng
   * cùng lúc trên input thật của người dùng. Khác `scoreConversion` (chỉ 1 phép quy đổi đơn lẻ,
   * vd bảng ĐGNL→THPT). Optional — trường chưa set coi như false, không CTA "Tính một phần".
   */
  partialCalculator?: boolean;
}

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
   * Giới thiệu NGẮN về trường (1-2 câu, tiếng Việt, trung lập — năm thành lập/loại hình/hệ thống
   * trực thuộc), KHÁC `summary` (mô tả capability tính điểm). Lấy từ nguồn uy tín (Wikipedia tiếng
   * Việt/trang "giới thiệu" chính thức của trường), không phải marketing copy. Optional — bỏ trống
   * thì card landing page không hiện dòng giới thiệu.
   */
  about?: string;
  /** Optional, xem SchoolCapabilities — chưa set thì LandingPage suy theo `status` như cũ. */
  capabilities?: SchoolCapabilities;
  /**
   * Component trang riêng của trường (calculator thật, hoặc trang thông tin nếu chưa đủ nguồn
   * để tính điểm). App shell chỉ biết render `<Page />` khi có — không biết/không cần biết bên
   * trong là gì. Không bắt buộc: trường chưa có gì để hiển thị thì bỏ trống, LandingPage tự ẩn
   * CTA tương ứng.
   */
  Page?: (props: { onChangeSchool: () => void }) => ReactElement;
}
