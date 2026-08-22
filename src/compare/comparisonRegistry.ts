import type { SchoolComparisonAdapter } from './schoolComparisonAdapter';
import { hcmutComparisonAdapter } from '../schools/hcmut/comparison';
import { uehComparisonAdapter } from '../schools/ueh/comparison';
import { iuComparisonAdapter } from '../schools/iu/comparison';
import { uelComparisonAdapter } from '../schools/uel/comparison';
import { hcmusComparisonAdapter } from '../schools/hcmus/comparison';
import { usshComparisonAdapter } from '../schools/ussh/comparison';
import { uhsComparisonAdapter } from '../schools/uhs/comparison';
import { uitComparisonAdapter } from '../schools/uit/comparison';
import { aguComparisonAdapter } from '../schools/agu/comparison';
import { hcmueComparisonAdapter } from '../schools/hcmue/comparison';
import { hcmuteComparisonAdapter } from '../schools/hcmute/comparison';
import { tdtuComparisonAdapter } from '../schools/tdtu/comparison';
import { huflitComparisonAdapter } from '../schools/huflit/comparison';
import { hutechComparisonAdapter } from '../schools/hutech/comparison';
import { ufmComparisonAdapter } from '../schools/ufm/comparison';
import { iuhComparisonAdapter } from '../schools/iuh/comparison';
import { hcmulawComparisonAdapter } from '../schools/hcmulaw/comparison';
import { vluComparisonAdapter } from '../schools/vlu/comparison';
import { umpComparisonAdapter } from '../schools/ump/comparison';
import { ftuComparisonAdapter } from '../schools/ftu/comparison';
import { ptitComparisonAdapter } from '../schools/ptit/comparison';
import { neuComparisonAdapter } from '../schools/neu/comparison';
import { hubComparisonAdapter } from '../schools/hub/comparison';
import { huitComparisonAdapter } from '../schools/huit/comparison';
import { nttuComparisonAdapter } from '../schools/nttu/comparison';
import { hsuComparisonAdapter } from '../schools/hsu/comparison';
import { uefComparisonAdapter } from '../schools/uef/comparison';
import { ctuComparisonAdapter } from '../schools/ctu/comparison';
import { tdmuComparisonAdapter } from '../schools/tdmu/comparison';
import { hiuComparisonAdapter } from '../schools/hiu/comparison';
import { ouComparisonAdapter } from '../schools/ou/comparison';
import { sguComparisonAdapter } from '../schools/sgu/comparison';
import { hnueComparisonAdapter } from '../schools/hnue/comparison';
import { vinhuniComparisonAdapter } from '../schools/vinhuni/comparison';
import { utcComparisonAdapter } from '../schools/utc/comparison';
import { vnuaComparisonAdapter } from '../schools/vnua/comparison';
import { huceComparisonAdapter } from '../schools/huce/comparison';
import { southernCatalogComparisonAdapters } from '../schools/southernCatalog';
import { remainingCatalogComparisonAdapters } from '../schools/remainingCatalog';
import { finalCatalogComparisonAdapters } from '../schools/finalCatalog';
import { collegeCatalogComparisonAdapters } from '../schools/collegeCatalog';

/**
 * Nguồn sự thật DUY NHẤT cho thứ tự + danh sách trường tham gia `/compare` — orchestration
 * (`evaluateApplicantAcrossSchools.ts`) lặp qua đúng mảng này cho CẢ roster mặc định lẫn
 * selection-driven, không còn danh sách thứ 2 nào có thể lệch (trước refactor, `COMPARE_SCHOOL_ORDER`
 * và danh sách gọi tay trong `evaluateApplicantAcrossSchools()` là 2 hằng số ĐỘC LẬP — HCMUE có
 * module thật + branch trong `evaluateComparisonSelections` nhưng bị quên ở cả 2 chỗ này, xem
 * `docs/architecture.md` Batch 16).
 *
 * Thêm trường mới tham gia compare = thêm 1 dòng ở đây (sau khi tạo `schools/<id>/comparison.ts`).
 * `comparisonRegistry.test.ts` khóa: mọi adapter phải trỏ tới `schoolId` có thật trong
 * `schoolRegistry`, không trùng `schoolId`, `methodId` phải khớp method descriptor thật của trường.
 */
export const schoolComparisonAdapters: readonly SchoolComparisonAdapter[] = [
  hcmutComparisonAdapter,
  uehComparisonAdapter,
  iuComparisonAdapter,
  uelComparisonAdapter,
  hcmusComparisonAdapter,
  usshComparisonAdapter,
  uhsComparisonAdapter,
  uitComparisonAdapter,
  aguComparisonAdapter,
  hcmueComparisonAdapter,
  hcmuteComparisonAdapter,
  tdtuComparisonAdapter,
  huflitComparisonAdapter,
  hutechComparisonAdapter,
  ufmComparisonAdapter,
  iuhComparisonAdapter,
  hcmulawComparisonAdapter,
  vluComparisonAdapter,
  umpComparisonAdapter,
  ftuComparisonAdapter,
  ptitComparisonAdapter,
  neuComparisonAdapter,
  hubComparisonAdapter,
  huitComparisonAdapter,
  nttuComparisonAdapter,
  hsuComparisonAdapter,
  uefComparisonAdapter,
  ctuComparisonAdapter,
  tdmuComparisonAdapter,
  hiuComparisonAdapter,
  ouComparisonAdapter,
  sguComparisonAdapter,
  hnueComparisonAdapter,
  vinhuniComparisonAdapter,
  utcComparisonAdapter,
  vnuaComparisonAdapter,
  huceComparisonAdapter,
  ...southernCatalogComparisonAdapters,
  ...remainingCatalogComparisonAdapters.filter((adapter) => adapter.schoolId !== 'huce'),
  ...finalCatalogComparisonAdapters,
  ...collegeCatalogComparisonAdapters,
];

export const schoolComparisonAdapterRegistry: Readonly<Record<string, SchoolComparisonAdapter>> = Object.fromEntries(
  schoolComparisonAdapters.map((adapter) => [adapter.schoolId, adapter])
);

/** Thứ tự hiển thị `/compare` — derive từ chính registry (không phải hằng số song song). */
export const COMPARE_SCHOOL_ORDER: readonly string[] = schoolComparisonAdapters.map((adapter) => adapter.schoolId);
