import { lazy } from 'react';
import type { SchoolModule } from '../core/schoolModule';

/**
 * Code splitting (P1) — `Page` là phần "nặng" của 1 trường (component + toàn bộ calculator/data/
 * components mà nó import). Trước batch này, `schoolRegistry` import TĨNH cả 30 `schools/<id>/
 * index.ts`, mỗi file lại import `Page` của trường đó → mọi Page (kể cả 16 trường chưa ai mở) đều
 * nằm trong initial JS bundle. Giờ tách 2 lớp:
 *
 * - 14 trường KHÔNG có `Page` (chỉ data/eligibility/evidence layer, nhẹ) — import module đầy đủ
 *   như cũ, không cần tách vì không có gì nặng để cắt.
 * - 16 trường CÓ `Page` — import `meta.ts` (nhẹ, không đụng `Page`) để build metadata đồng bộ cho
 *   landing page/search/filter, rồi bọc `Page` bằng `lazy(() => import('./<id>')...)` — chunk riêng
 *   của Page (+ toàn bộ cây import của nó) chỉ tải khi user thật sự mở `/<id>`. Xem từng
 *   `schools/<id>/meta.ts` để biết rationale chi tiết per-school.
 *
 * `schoolRegistry` GIỮ NGUYÊN shape `Record<string, SchoolModule>` như trước — mọi consumer hiện
 * có (App.tsx, LandingPage, comparisonRegistry, universityCatalog, audit script...) không cần đổi
 * gì. App.tsx cần bọc `<Page />` trong `<Suspense>` (bắt buộc với `lazy()`, xem App.tsx).
 */

// 14 trường không có Page — module đầy đủ, nhẹ, không cần tách.
import { aguModule } from './agu';
import { ftuModule } from './ftu';
import { ptitModule } from './ptit';
import { neuModule } from './neu';
import { hubModule } from './hub';
import { huitModule } from './huit';
import { nttuModule } from './nttu';
import { hsuModule } from './hsu';
import { uefModule } from './uef';
import { ctuModule } from './ctu';
import { tdmuModule } from './tdmu';
import { hiuModule } from './hiu';
import { ouModule } from './ou';
import { sguModule } from './sgu';
import { hnueModule } from './hnue';
import { vinhuniModule } from './vinhuni';
import { utcModule } from './utc';
import { vluModule } from './vlu';
import { hcmuteModule } from './hcmute';
import { vnuaModule } from './vnua';
import { huceModule } from './huce';
import { davModule } from './dav';
import { southernCatalogModules } from './southernCatalog';
import { remainingCatalogModules } from './remainingCatalog';
import { finalCatalogModules } from './finalCatalog';
import { collegeCatalogModules } from './collegeCatalog';

// 16 trường có Page — chỉ import metadata nhẹ ở đây, KHÔNG import Page.
import { hcmutMeta } from './hcmut/meta';
import { uitMeta } from './uit/meta';
import { uelMeta } from './uel/meta';
import { uehMeta } from './ueh/meta';
import { hcmusMeta } from './hcmus/meta';
import { usshMeta } from './ussh/meta';
import { uhsMeta } from './uhs/meta';
import { iuMeta } from './iu/meta';
import { hcmueMeta } from './hcmue/meta';
import { tdtuMeta } from './tdtu/meta';
import { huflitMeta } from './huflit/meta';
import { umpMeta } from './ump/meta';
import { hutechMeta } from './hutech/meta';
import { hcmulawMeta } from './hcmulaw/meta';
import { ufmMeta } from './ufm/meta';
import { iuhMeta } from './iuh/meta';

// Lazy loader cho từng Page — factory chỉ chạy (và tải chunk) khi React thật sự render component
// này lần đầu (user mở đúng route `/<id>`), không phải lúc registry được xây.
const hcmutPage = lazy(() => import('./hcmut').then((m) => ({ default: m.hcmutModule.Page! })));
const uitPage = lazy(() => import('./uit').then((m) => ({ default: m.uitModule.Page! })));
const uelPage = lazy(() => import('./uel').then((m) => ({ default: m.uelModule.Page! })));
const uehPage = lazy(() => import('./ueh').then((m) => ({ default: m.uehModule.Page! })));
const hcmusPage = lazy(() => import('./hcmus').then((m) => ({ default: m.hcmusModule.Page! })));
const usshPage = lazy(() => import('./ussh').then((m) => ({ default: m.usshModule.Page! })));
const uhsPage = lazy(() => import('./uhs').then((m) => ({ default: m.uhsModule.Page! })));
const iuPage = lazy(() => import('./iu').then((m) => ({ default: m.iuModule.Page! })));
const hcmuePage = lazy(() => import('./hcmue').then((m) => ({ default: m.hcmueModule.Page! })));
const tdtuPage = lazy(() => import('./tdtu').then((m) => ({ default: m.tdtuModule.Page! })));
const huflitPage = lazy(() => import('./huflit').then((m) => ({ default: m.huflitModule.Page! })));
const umpPage = lazy(() => import('./ump').then((m) => ({ default: m.umpModule.Page! })));
const hutechPage = lazy(() => import('./hutech').then((m) => ({ default: m.hutechModule.Page! })));
const hcmulawPage = lazy(() => import('./hcmulaw').then((m) => ({ default: m.hcmulawModule.Page! })));
const ufmPage = lazy(() => import('./ufm').then((m) => ({ default: m.ufmModule.Page! })));
const iuhPage = lazy(() => import('./iuh').then((m) => ({ default: m.iuhModule.Page! })));

/**
 * Registry đơn giản, KHÔNG dynamic plugin loading/DI. Thêm trường mới CHƯA có Page (đa số trường
 * mới, chỉ data/eligibility layer) = thêm 1 dòng module đầy đủ như 14 trường phía trên. Thêm
 * `Page` cho 1 trường đã có sau này = tách `meta.ts` (xem `hcmut/meta.ts` làm mẫu) + thêm 1 dòng
 * `lazy(...)` + đổi entry bên dưới từ module đầy đủ sang `{ ...xxxMeta, Page: xxxPage }`.
 */
export const schoolRegistry: Record<string, SchoolModule> = {
  agu: aguModule,
  ftu: ftuModule,
  ptit: ptitModule,
  neu: neuModule,
  hub: hubModule,
  huit: huitModule,
  nttu: nttuModule,
  hsu: hsuModule,
  uef: uefModule,
  ctu: ctuModule,
  tdmu: tdmuModule,
  hiu: hiuModule,
  ou: ouModule,
  sgu: sguModule,
  hnue: hnueModule,
  vinhuni: vinhuniModule,
  utc: utcModule,
  vlu: vluModule,
  hcmute: hcmuteModule,
  vnua: vnuaModule,
  hcmut: { ...hcmutMeta, Page: hcmutPage },
  uit: { ...uitMeta, Page: uitPage },
  uel: { ...uelMeta, Page: uelPage },
  // UEH không thuộc ĐHQG-HCM (dùng V-ACT như 1 trong 6 phương thức độc lập, không phải trọng số
  // trong công thức tổng hợp) — vẫn đăng ký chung registry, không cần phân biệt UI.
  ueh: { ...uehMeta, Page: uehPage },
  hcmus: { ...hcmusMeta, Page: hcmusPage },
  ussh: { ...usshMeta, Page: usshPage },
  uhs: { ...uhsMeta, Page: uhsPage },
  iu: { ...iuMeta, Page: iuPage },
  hcmue: { ...hcmueMeta, Page: hcmuePage },
  tdtu: { ...tdtuMeta, Page: tdtuPage },
  huflit: { ...huflitMeta, Page: huflitPage },
  hutech: { ...hutechMeta, Page: hutechPage },
  ufm: { ...ufmMeta, Page: ufmPage },
  iuh: { ...iuhMeta, Page: iuhPage },
  hcmulaw: { ...hcmulawMeta, Page: hcmulawPage },
  ump: { ...umpMeta, Page: umpPage },
  ...southernCatalogModules,
  ...remainingCatalogModules,
  ...finalCatalogModules,
  ...collegeCatalogModules,
  huce: huceModule,
  dav: davModule,
};
