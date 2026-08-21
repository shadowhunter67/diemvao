import type { SchoolModule } from '../../core/schoolModule';
import { HcmutCalculatorPage } from './HcmutCalculatorPage';
import { hcmutMeta } from './meta';

/**
 * Module trường đầu tiên của UniscoreVN. Bản thân module này chỉ export thông tin định danh
 * (SchoolModule, kèm `Page` — component trang trọn vẹn của trường) để đăng ký vào
 * schoolRegistry — logic tính điểm/config/data thật nằm rải trong các file con của thư mục
 * này (calculator/, config/, data/, types/, validation.ts, urlState.ts, programs.ts) và được
 * `HcmutCalculatorPage` import trực tiếp theo đường dẫn cụ thể, không gom hết qua barrel này
 * (tránh 1 file re-export khổng lồ khó theo dõi). App shell chỉ biết `Page`, không import gì
 * khác từ thư mục này.
 *
 * Metadata thật nằm ở `meta.ts` (KHÔNG import `HcmutCalculatorPage`) — file này chỉ compose
 * `{ ...meta, Page }` để giữ nguyên `SchoolModule` đầy đủ cho code cần cả 2 (school-local test,
 * v.v.). `schools/index.ts` (registry trung tâm) import `meta.ts` trực tiếp cho landing page,
 * và dynamic-import CHÍNH file `index.ts` này (kéo theo `HcmutCalculatorPage`) chỉ khi user
 * thật sự mở `/hcmut` — xem `schoolPageLoaders`.
 */
export const hcmutModule: SchoolModule = {
  ...hcmutMeta,
  Page: HcmutCalculatorPage,
};
