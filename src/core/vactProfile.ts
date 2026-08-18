/**
 * Batch 5 — V-ACT (ĐGNL ĐHQG-HCM) factual input model, dùng chung nhiều trường qua
 * `ApplicantProfile.exams.vact`. Đây là **input provenance** (biết `total`/`components` đến từ
 * đâu để tránh 2 trường ghi 2 fact mâu thuẫn) — KHÁC `RuleEvidence` (`evidence.ts`, vì sao
 * UniscoreVN tin một RULE tuyển sinh, không phải vì sao tin một SỐ user nhập). Không dùng chung
 * type, không reuse `RuleEvidence` cho việc này.
 *
 * Vấn đề batch 5 phải xử lý: `total` và `components` là 2 cách biểu diễn CÙNG một fact (điểm ĐGNL
 * thô, thang 0-1200). Nếu 2 trường ghi độc lập (HCMUT ghi components, UEH ghi total), profile có
 * thể tự mâu thuẫn (`sum(components) !== total`) mà không ai biết cái nào còn đúng. Batch 4 quyết
 * định "last-write-wins" ngầm — batch 5 thay bằng chính sách rõ ràng dưới đây.
 */

/** Component riêng lẻ (Toán/Tiếng Việt/Tiếng Anh/Tư duy khoa học), thang 0-300/phần — khớp
 * `maxPerComponent: 300` ở `schools/hcmut/config/admission-2026.ts`, nhưng đặt hằng số riêng ở
 * đây vì đây là thang thi ĐGNL ĐHQG-HCM chính thức (dùng chung, không phải tham số riêng HCMUT) —
 * xem `docs/admission-research-2026.md`. Trùng giá trị là do cùng 1 kỳ thi, không phải HCMUT-specific. */
export const VACT_COMPONENT_RANGE = { min: 0, max: 300 } as const;
/** Tổng 4 phần × 300 = 1200 — thang ĐGNL raw chính thức (UEL "X = raw×100/1200", FTU "ngưỡng
 * 850/1200"). KHÔNG phải `maxWeightedTotal: 1500` của HCMUT (đã nhân hệ số Toán×2 nội bộ). */
export const VACT_TOTAL_RANGE = { min: 0, max: 1200 } as const;

export type VactComponents = {
  vietnamese?: number;
  english?: number;
  math?: number;
  scientificThinking?: number;
};

/**
 * Nguồn của `total`/`components` hiện tại:
 * - `user-components-input`  — 4 phần thi được người dùng nhập trực tiếp (HCMUT chế độ chi tiết).
 * - `derived-from-components` — `total` được TÍNH từ components (không phải user tự gõ số này).
 * - `user-total-input`       — `total` được người dùng nhập trực tiếp dạng 1 số (UEH, hoặc HCMUT
 *   chế độ "Nhập tổng điểm" nếu sau này wire vào — hiện chưa wire, xem applicantProfileMapper.ts).
 * - `legacy-import`          — phục hồi từ storage cũ (batch 4 trở về trước) không có source, hoặc
 *   dữ liệu bị conflict được safe-repair (xem `applicantProfileStorage.ts`).
 * - `unknown`                — chưa từng gán rõ nguồn nào (state ban đầu).
 */
export type VactValueSource =
  | 'user-components-input'
  | 'derived-from-components'
  | 'user-total-input'
  | 'legacy-import'
  | 'unknown';

/** Danh sách runtime của `VactValueSource` — dùng để validate giá trị đọc từ localStorage/URL
 * (không tin cậy) mà không duplicate literal union ở nơi validate (`applicantProfileStorage.ts`). */
export const VACT_VALUE_SOURCES: readonly VactValueSource[] = [
  'user-components-input',
  'derived-from-components',
  'user-total-input',
  'legacy-import',
  'unknown',
];

export interface VactProfile {
  total?: number;
  components?: VactComponents;
  /** Nguồn của `total` hiện tại — luôn có giá trị khi `total` có giá trị (set bởi
   * `reconcileVactFromComponents`/`reconcileVactFromTotal`, không set tay ở nơi khác). */
  totalSource?: VactValueSource;
  /** Nguồn của `components` hiện tại — chỉ có ý nghĩa khi `components` không undefined. */
  componentsSource?: VactValueSource;
}

const emptyComponents: VactComponents = {};

/** `true` nếu ĐỦ cả 4 phần thi (không phần nào undefined) — chỉ khi đủ 4 mới coi components là
 * một factual total hợp lệ để tính tổng; thiếu 1 phần thì không suy đoán phần còn lại. */
export function hasCompleteVactComponents(components: VactComponents | undefined): components is Required<VactComponents> {
  if (!components) return false;
  return (
    components.vietnamese !== undefined &&
    components.english !== undefined &&
    components.math !== undefined &&
    components.scientificThinking !== undefined
  );
}

/** Tổng 4 phần — chỉ gọi khi `hasCompleteVactComponents` đã true (tránh NaN từ cộng `undefined`). */
export function sumVactComponents(components: Required<VactComponents>): number {
  return components.vietnamese + components.english + components.math + components.scientificThinking;
}

function isVactComponentInRange(value: number): boolean {
  return value >= VACT_COMPONENT_RANGE.min && value <= VACT_COMPONENT_RANGE.max;
}

function isVactTotalInRange(value: number): boolean {
  return value >= VACT_TOTAL_RANGE.min && value <= VACT_TOTAL_RANGE.max;
}

/**
 * INVARIANT 1 — Đủ 4 raw components → `total` PHẢI là `sum(components)`, `totalSource` PHẢI là
 * `derived-from-components`. Gọi hàm này mỗi khi user sửa 1 trong 4 component (HCMUT chế độ chi
 * tiết) — components luôn authoritative khi đủ 4 phần, ghi đè bất kỳ `total` cũ nào (kể cả
 * `user-total-input` từ trường khác — components là dữ liệu cụ thể hơn, nên thắng).
 *
 * Nếu components KHÔNG đủ 4 phần (đang gõ dở), giữ nguyên `total`/`totalSource` cũ — không suy
 * đoán tổng từ dữ liệu thiếu (đúng nguyên tắc "không tự phân bổ/suy điểm thành phần từ total và
 * ngược lại" của batch 5).
 */
export function reconcileVactFromComponents(current: VactProfile | undefined, components: VactComponents): VactProfile {
  const merged: VactComponents = { ...emptyComponents, ...components };
  if (!hasCompleteVactComponents(merged)) {
    return { ...current, components: merged, componentsSource: 'user-components-input' };
  }
  return {
    components: merged,
    componentsSource: 'user-components-input',
    total: sumVactComponents(merged),
    totalSource: 'derived-from-components',
  };
}

export interface ReconcileVactFromTotalResult {
  profile: VactProfile;
  /** `true` nếu components cũ bị xóa do xung đột với total mới (UI cần hiện thông báo — workstream
   * G/J). `false` nếu không có components để xung đột, hoặc components vẫn khớp total mới. */
  componentsCleared: boolean;
}

/**
 * INVARIANT 2/3 — User sửa `total` trực tiếp (KHÔNG phải qua components, vd UEH):
 * - Không có `components` từ trước → chỉ set `total`, `totalSource = source`.
 * - Có `components` và `sum(components) === newTotal` → giữ nguyên components (vẫn khớp, không
 *   phải xung đột thật — vd user gõ lại đúng số cũ).
 * - Có `components` và `sum(components) !== newTotal` → XUNG ĐỘT: 2 fact không thể cùng đúng.
 *   Chính sách (đã chọn theo spec batch 5, ưu tiên "clear conflicting data" hơn dựng stale-state
 *   phức tạp): xóa `components`/`componentsSource`, giữ `total` mới (giá trị user vừa xác nhận chủ
 *   động — coi là fact mới nhất). KHÔNG bao giờ giữ cả 2 như thể cùng đúng.
 */
export function reconcileVactFromTotal(
  current: VactProfile | undefined,
  total: number,
  source: Exclude<VactValueSource, 'derived-from-components'>
): ReconcileVactFromTotalResult {
  const existingComponents = current?.components;
  if (hasCompleteVactComponents(existingComponents) && sumVactComponents(existingComponents) === total) {
    return {
      profile: { ...current, total, totalSource: source },
      componentsCleared: false,
    };
  }
  const hadComponents = existingComponents !== undefined && Object.keys(existingComponents).length > 0;
  return {
    profile: { total, totalSource: source, components: undefined, componentsSource: undefined },
    componentsCleared: hadComponents,
  };
}

export interface VactProfileValidationIssue {
  field: 'total' | 'components.vietnamese' | 'components.english' | 'components.math' | 'components.scientificThinking';
  message: string;
}

export interface VactProfileValidationResult {
  valid: boolean;
  issues: VactProfileValidationIssue[];
}

/**
 * INVARIANT 5 (+ audit-only check cho invariant 1) — không throw, dùng cho dev assertion/test hoặc
 * safe-repair ở storage layer. KHÔNG dùng để chặn UI realtime (form vẫn tolerate input rỗng/dở khi
 * đang gõ — xem `HcmutCalculatorPage.tsx`).
 */
export function validateVactProfile(vact: VactProfile | undefined): VactProfileValidationResult {
  const issues: VactProfileValidationIssue[] = [];
  if (!vact) return { valid: true, issues };

  if (vact.total !== undefined && !isVactTotalInRange(vact.total)) {
    issues.push({ field: 'total', message: `total phải trong khoảng ${VACT_TOTAL_RANGE.min}-${VACT_TOTAL_RANGE.max}` });
  }

  (['vietnamese', 'english', 'math', 'scientificThinking'] as const).forEach((key) => {
    const value = vact.components?.[key];
    if (value !== undefined && !isVactComponentInRange(value)) {
      issues.push({
        field: `components.${key}`,
        message: `components.${key} phải trong khoảng ${VACT_COMPONENT_RANGE.min}-${VACT_COMPONENT_RANGE.max}`,
      });
    }
  });

  if (hasCompleteVactComponents(vact.components) && vact.total !== undefined) {
    if (sumVactComponents(vact.components) !== vact.total) {
      issues.push({
        field: 'total',
        message: 'total không khớp tổng components — profile đang ở trạng thái mâu thuẫn (không nên xảy ra qua reconcile*, chỉ có thể do dữ liệu cũ/hỏng).',
      });
    }
  }

  return { valid: issues.length === 0, issues };
}
