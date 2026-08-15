import type { SchoolModule } from '../core/schoolModule';
import { hcmutModule } from './hcmut';
import { uitModule } from './uit';
import { uelModule } from './uel';
import { uehModule } from './ueh';
import { hcmusModule } from './hcmus';
import { usshModule } from './ussh';
import { uhsModule } from './uhs';
import { iuModule } from './iu';
import { aguModule } from './agu';

/**
 * Các trường ĐHQG-HCM khác đã research (xem docs/admission-research-2026.md) nhưng CHƯA có
 * page implement — chỉ khai báo thông tin định danh + status để school selector hiển thị đúng
 * trạng thái, KHÔNG tạo thư mục schools/<id>/ đầy đủ cho tới khi thật sự implement (tránh dựng
 * cấu trúc thư mục rỗng chưa dùng tới). UIT và UEL đã implement thật (trang thông tin + dữ liệu,
 * xem schools/uit/, schools/uel/) nên dùng module thật thay vì entry identity-only ở đây.
 *
 * status='researching': đã xác minh được công thức từ nguồn chính thức (formulaVerified=true
 * trong docs) nhưng chưa tới lượt implement trong phase này.
 * status='formula-incomplete': research chưa tìm đủ công thức từ nguồn đủ tin cậy.
 */
/**
 * researchedSchools (identity-only) hiện trống — AGU đã research xong 2026-08-15 qua browser thật
 * (domain con `tuyensinh.agu.edu.vn` truy cập bình thường, khác kết luận DNS-timeout của lần
 * research trước với `agu.edu.vn`/`www.agu.edu.vn`) và có module thật ở `schools/agu/`.
 */
const researchedSchools: SchoolModule[] = [];

/**
 * Registry đơn giản, KHÔNG dynamic plugin loading/DI. Thêm trường mới (đã implement thật) =
 * thêm 1 dòng ở đây sau khi tạo module tương ứng trong schools/<id>/.
 */
export const schoolRegistry: Record<string, SchoolModule> = {
  hcmut: hcmutModule,
  uit: uitModule,
  uel: uelModule,
  // UEH không thuộc ĐHQG-HCM (dùng V-ACT như 1 trong 6 phương thức độc lập, không phải trọng số
  // trong công thức tổng hợp) — vẫn đăng ký chung registry, không cần phân biệt UI.
  ueh: uehModule,
  hcmus: hcmusModule,
  ussh: usshModule,
  uhs: uhsModule,
  iu: iuModule,
  agu: aguModule,
  ...Object.fromEntries(researchedSchools.map((school) => [school.id, school])),
};
