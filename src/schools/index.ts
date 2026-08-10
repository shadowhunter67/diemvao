import type { SchoolModule } from '../core/schoolModule';
import { hcmutModule } from './hcmut';

/**
 * Registry đơn giản, KHÔNG dynamic plugin loading/DI. Thêm trường mới = thêm 1 dòng ở đây
 * sau khi tạo module tương ứng trong schools/<id>/.
 */
export const schoolRegistry: Record<string, SchoolModule> = {
  hcmut: hcmutModule,
};

/**
 * Trường đang active. App hiện chỉ có 1 trường nên chưa cần router (/hcmut, /uit, ...) —
 * giữ hằng số này để nơi cần biết "trường nào đang chọn" không phải hard-code chuỗi 'hcmut'
 * rải rác, và để dễ chuyển sang đọc từ URL/router khi có trường thứ hai.
 */
export const activeSchoolId: keyof typeof schoolRegistry = 'hcmut';

export const activeSchool: SchoolModule = schoolRegistry[activeSchoolId];
