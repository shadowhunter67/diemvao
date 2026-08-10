import type { SchoolModule } from '../core/schoolModule';
import { hcmutModule } from './hcmut';

/**
 * Các trường ĐHQG-HCM khác đã research (xem docs/admission-research-2026.md) nhưng CHƯA có
 * calculator implement — chỉ khai báo thông tin định danh + status để school selector hiển
 * thị đúng trạng thái, KHÔNG tạo thư mục schools/<id>/ đầy đủ cho tới khi thật sự implement
 * (tránh dựng cấu trúc thư mục rỗng chưa dùng tới).
 *
 * status='researching': đã xác minh được công thức từ nguồn chính thức (formulaVerified=true
 * trong docs) nhưng chưa tới lượt implement trong phase này.
 * status='formula-incomplete': research chưa tìm đủ công thức từ nguồn đủ tin cậy.
 */
const researchedSchools: SchoolModule[] = [
  {
    id: 'uit',
    name: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM',
    shortName: 'UIT',
    year: 2026,
    status: 'researching',
  },
  {
    id: 'uel',
    name: 'Trường Đại học Kinh tế – Luật – ĐHQG TP.HCM',
    shortName: 'UEL',
    year: 2026,
    status: 'researching',
  },
  {
    id: 'hcmus',
    name: 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP.HCM',
    shortName: 'HCMUS',
    year: 2026,
    status: 'researching',
  },
  {
    id: 'ussh',
    name: 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM',
    shortName: 'USSH',
    year: 2026,
    status: 'researching',
  },
  {
    id: 'iu',
    name: 'Trường Đại học Quốc tế – ĐHQG TP.HCM',
    shortName: 'IU',
    year: 2026,
    status: 'formula-incomplete',
  },
  {
    id: 'agu',
    name: 'Trường Đại học An Giang – ĐHQG TP.HCM',
    shortName: 'AGU',
    year: 2026,
    status: 'formula-incomplete',
  },
  {
    id: 'uhs',
    name: 'Trường Đại học Khoa học Sức khỏe – ĐHQG TP.HCM',
    shortName: 'UHS',
    year: 2026,
    status: 'formula-incomplete',
  },
];

/**
 * Registry đơn giản, KHÔNG dynamic plugin loading/DI. Thêm trường mới (đã implement thật) =
 * thêm 1 dòng ở đây sau khi tạo module tương ứng trong schools/<id>/.
 */
export const schoolRegistry: Record<string, SchoolModule> = {
  hcmut: hcmutModule,
  ...Object.fromEntries(researchedSchools.map((school) => [school.id, school])),
};

/**
 * Trường đang active. App hiện chỉ có 1 trường nên chưa cần router (/hcmut, /uit, ...) —
 * giữ hằng số này để nơi cần biết "trường nào đang chọn" không phải hard-code chuỗi 'hcmut'
 * rải rác, và để dễ chuyển sang đọc từ URL/router khi có trường thứ hai.
 */
export const activeSchoolId: keyof typeof schoolRegistry = 'hcmut';

export const activeSchool: SchoolModule = schoolRegistry[activeSchoolId];
