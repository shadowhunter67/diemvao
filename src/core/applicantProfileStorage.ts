import type { ApplicantProfile } from './applicantProfile';
import { readWithMigration } from './storage';
import { safeRemoveItem, safeSetItem } from './safeStorage';
import {
  hasCompleteVactComponents,
  sumVactComponents,
  VACT_COMPONENT_RANGE,
  VACT_TOTAL_RANGE,
  VACT_VALUE_SOURCES,
  type VactComponents,
  type VactProfile,
} from './vactProfile';
import { SUBJECT_LABELS, type SubjectId } from './subjects';

/**
 * Batch — runtime validation cho dữ liệu đến từ localStorage/URL (untrusted input, có thể là
 * schema cũ, bị user sửa tay, bị extension can thiệp, hoặc code version cũ). Chính sách: SANITIZE
 * (drop field sai type/range, giữ field hợp lệ khác), KHÔNG reject nguyên profile chỉ vì 1 field
 * hỏng — trừ root không phải object thì không còn gì để giữ. Không bao giờ throw.
 *
 * Range/danh sách hợp lệ reuse từ nơi đã có: `VACT_COMPONENT_RANGE`/`VACT_TOTAL_RANGE`/
 * `VACT_VALUE_SOURCES` (`core/vactProfile.ts`), `SUBJECT_LABELS` (`core/subjects.ts`, exhaustive
 * theo `SubjectId` nhờ TS ép kiểu `Record<SubjectId, string>` — dùng `Object.keys` thay vì
 * duplicate danh sách subject id ở đây). Certificate range (IELTS/TOEFL iBT/TOEIC/SAT/ACT/IB) và
 * graduation year range KHÔNG có canonical constant sẵn trong repo (chỉ có bonus lookup table theo
 * threshold, không phải valid-range) — khai báo tại chỗ theo thang điểm chuẩn quốc tế/VN, chỉ để
 * chặn giá trị corrupt/vô lý (vd âm, NaN, 99999), KHÔNG phải business rule quy đổi điểm của trường.
 */

const VALID_SUBJECT_IDS: ReadonlySet<string> = new Set(Object.keys(SUBJECT_LABELS));
const THPT_SCORE_RANGE = { min: 0, max: 10 } as const;
const GRADUATION_YEAR_RANGE = { min: 1950, max: 2100 } as const;
const CERTIFICATE_RANGES = {
  ielts: { min: 0, max: 9 },
  toeflIbt: { min: 0, max: 120 },
  toeic: { min: 0, max: 990 },
  sat: { min: 0, max: 1600 },
  act: { min: 0, max: 36 },
  ib: { min: 0, max: 45 },
} as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isInRange(value: number, range: { min: number; max: number }): boolean {
  return value >= range.min && value <= range.max;
}

/** Không giữ object rỗng sau khi lọc — nếu KHÔNG còn field con hợp lệ nào, coi cả field cha là
 * "không có" (undefined) thay vì để lại noise dạng `{}` trong profile đã sanitize. */
function emptyToUndefined<T extends object>(value: T): T | undefined {
  return Object.keys(value).length > 0 ? value : undefined;
}

/** Lọc `{ [SubjectId]: number }` — chỉ giữ key là `SubjectId` hợp lệ VÀ value là finite number
 * trong thang điểm 10 (THPT/học bạ VN). Field/key lạ hoặc value sai type bị drop lặng lẽ, không
 * làm mất các subject score hợp lệ khác trong cùng object. */
function sanitizeSubjectScores(value: unknown): Partial<Record<SubjectId, number>> {
  if (!isPlainObject(value)) return {};
  const result: Partial<Record<SubjectId, number>> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!VALID_SUBJECT_IDS.has(key)) continue;
    if (isFiniteNumber(raw) && isInRange(raw, THPT_SCORE_RANGE)) {
      result[key as SubjectId] = raw;
    }
  }
  return result;
}

function sanitizeThpt(value: unknown): ApplicantProfile['thpt'] | undefined {
  if (!isPlainObject(value)) return undefined;
  const scores = sanitizeSubjectScores(value.scores);
  return Object.keys(scores).length > 0 ? { scores } : undefined;
}

function sanitizeTranscript(value: unknown): ApplicantProfile['transcript'] | undefined {
  if (!isPlainObject(value)) return undefined;
  const result: NonNullable<ApplicantProfile['transcript']> = {};
  (['grade10', 'grade11', 'grade12'] as const).forEach((grade) => {
    if (isPlainObject(value[grade])) {
      const scores = sanitizeSubjectScores(value[grade]);
      if (Object.keys(scores).length > 0) result[grade] = scores;
    }
  });
  return emptyToUndefined(result);
}

function sanitizeVact(value: unknown): VactProfile | undefined {
  if (!isPlainObject(value)) return undefined;
  const result: VactProfile = {};

  if (isFiniteNumber(value.total) && isInRange(value.total, VACT_TOTAL_RANGE)) {
    result.total = value.total;
  }

  if (isPlainObject(value.components)) {
    const components: VactComponents = {};
    (['vietnamese', 'english', 'math', 'scientificThinking'] as const).forEach((key) => {
      const raw = (value.components as Record<string, unknown>)[key];
      if (isFiniteNumber(raw) && isInRange(raw, VACT_COMPONENT_RANGE)) {
        components[key] = raw;
      }
    });
    if (Object.keys(components).length > 0) result.components = components;
  }

  if (result.total !== undefined && typeof value.totalSource === 'string' && (VACT_VALUE_SOURCES as readonly string[]).includes(value.totalSource)) {
    result.totalSource = value.totalSource as VactProfile['totalSource'];
  }
  if (
    result.components !== undefined &&
    typeof value.componentsSource === 'string' &&
    (VACT_VALUE_SOURCES as readonly string[]).includes(value.componentsSource)
  ) {
    result.componentsSource = value.componentsSource as VactProfile['componentsSource'];
  }

  return emptyToUndefined(result);
}

function sanitizeCertificates(value: unknown): ApplicantProfile['certificates'] | undefined {
  if (!isPlainObject(value)) return undefined;
  const result: NonNullable<ApplicantProfile['certificates']> = {};
  (Object.keys(CERTIFICATE_RANGES) as (keyof typeof CERTIFICATE_RANGES)[]).forEach((key) => {
    const raw = value[key];
    if (isFiniteNumber(raw) && isInRange(raw, CERTIFICATE_RANGES[key])) {
      result[key] = raw;
    }
  });
  return emptyToUndefined(result);
}

function sanitizePriority(value: unknown): ApplicantProfile['priority'] | undefined {
  if (!isPlainObject(value)) return undefined;
  const result: NonNullable<ApplicantProfile['priority']> = {};
  if (typeof value.region === 'string') result.region = value.region;
  if (typeof value.category === 'string') result.category = value.category;
  return emptyToUndefined(result);
}

/**
 * Validator/sanitizer chính — nhận `unknown` (đã `JSON.parse` hoặc object literal trực tiếp trong
 * test) và trả về `ApplicantProfile` luôn hợp lệ theo type, không bao giờ throw. Root không phải
 * plain object (string/number/boolean/array/null) → trả `{}` (không còn field nào để giữ). Root
 * hợp lệ nhưng field con sai type/range → drop field đó, giữ nguyên các field hợp lệ khác.
 *
 * KHÔNG tự resolve xung đột `total`/`components` V-ACT ở đây — mỗi field được sanitize độc lập
 * theo range riêng, xung đột (nếu có) do `repairApplicantProfile` xử lý sau (đã có ở
 * `loadApplicantProfile`), tránh trùng policy ở 2 chỗ.
 */
export function sanitizeApplicantProfile(value: unknown): ApplicantProfile {
  if (!isPlainObject(value)) return {};
  const result: ApplicantProfile = {};

  if (isInteger(value.graduationYear) && isInRange(value.graduationYear, GRADUATION_YEAR_RANGE)) {
    result.graduationYear = value.graduationYear;
  }

  if (value.thpt !== undefined) {
    const thpt = sanitizeThpt(value.thpt);
    if (thpt) result.thpt = thpt;
  }

  if (value.transcript !== undefined) {
    const transcript = sanitizeTranscript(value.transcript);
    if (transcript) result.transcript = transcript;
  }

  if (isPlainObject(value.exams)) {
    const vact = sanitizeVact(value.exams.vact);
    if (vact) result.exams = { vact };
  }

  if (value.certificates !== undefined) {
    const certificates = sanitizeCertificates(value.certificates);
    if (certificates) result.certificates = certificates;
  }

  if (value.priority !== undefined) {
    const priority = sanitizePriority(value.priority);
    if (priority) result.priority = priority;
  }

  return result;
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

/**
 * Key riêng, KHÔNG namespace theo trường (khác `getSchoolStorageKey`) — đây là factual profile
 * dùng chung nhiều trường, không phải state UI của một trường cụ thể. Batch 4 mới tạo field này
 * lần đầu (không có legacy key đời MVP/Phase 9/13) — chỉ có ĐÚNG 1 đời legacy: key dưới brand cũ
 * "Uniscore" trước rebrand Batch 7 sang "UniscoreVN".
 */
export const APPLICANT_PROFILE_STORAGE_KEY = 'uniscorevn:applicant-profile:v1';
export const APPLICANT_PROFILE_LEGACY_KEYS = ['uniscore:applicant-profile:v1'];

/**
 * `readWithMigration` coi `null` là "key này không dùng được, thử key tiếp theo trong chain" —
 * KHÔNG đổi `null` này thành `{}` (dù `sanitizeApplicantProfile` luôn trả object hợp lệ), để giữ
 * nguyên contract migration fallback hiện có khi root JSON không phải object (string/array/...).
 */
function parseApplicantProfile(raw: string): ApplicantProfile | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) return null;
    return sanitizeApplicantProfile(parsed);
  } catch {
    return null;
  }
}

/**
 * Batch 5, workstream L — profile ghi bởi batch 4 (trước khi có invariant/reconcile*) có thể đã ở
 * trạng thái mâu thuẫn (`total` != `sum(components)`, vd UEH từng ghi total sau khi HCMUT đã ghi
 * components — không có source/timestamp để biết cái nào mới hơn ở thời điểm đó). KHÔNG đoán cái
 * nào authoritative khi không biết — chính sách bảo thủ đã chọn: giữ `total` (giá trị người dùng
 * active gần nhất chắc chắn đã xác nhận, dù không rõ là trường nào), xóa `components` xung đột
 * (cùng chính sách với `reconcileVactFromTotal` khi có conflict — nhất quán 1 policy duy nhất,
 * không phát minh policy migration riêng). Đánh dấu `totalSource: 'legacy-import'` vì không biết
 * rõ nguồn gốc thật. Không throw, không crash — profile không sửa được thì trả nguyên trạng.
 */
export function repairApplicantProfile(profile: ApplicantProfile): ApplicantProfile {
  const vact = profile.exams?.vact;
  if (!vact || vact.total === undefined || !hasCompleteVactComponents(vact.components)) return profile;
  if (sumVactComponents(vact.components) === vact.total) return profile;

  return {
    ...profile,
    exams: {
      ...profile.exams,
      vact: { total: vact.total, totalSource: 'legacy-import' },
    },
  };
}

/** Không bao giờ throw — malformed/thiếu data trả về profile rỗng `{}`. Repair xung đột legacy
 * (batch 5, workstream L) trước khi trả cho caller — component nào đọc profile sau đó không bao
 * giờ thấy total/components mâu thuẫn nhau. */
export function loadApplicantProfile(): ApplicantProfile {
  if (typeof window === 'undefined') return {};
  const loaded = readWithMigration(APPLICANT_PROFILE_STORAGE_KEY, APPLICANT_PROFILE_LEGACY_KEYS, parseApplicantProfile) ?? {};
  return repairApplicantProfile(loaded);
}

export function saveApplicantProfile(profile: ApplicantProfile): void {
  safeSetItem(APPLICANT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

/**
 * Batch 7 — tombstone khi user bấm "Xóa hồ sơ dùng chung" (`LandingPage.tsx` → `clearProfile`).
 * Chỉ `localStorage.removeItem(APPLICANT_PROFILE_STORAGE_KEY)` là chưa đủ: `readWithMigration` sẽ
 * lại thấy new key trống → fallback đọc `APPLICANT_PROFILE_LEGACY_KEYS` (vẫn còn dữ liệu cũ nếu
 * user migrate từ brand cũ) → hồ sơ đã xóa "sống lại" ngay khi reload. Xóa LUÔN legacy key cùng
 * lượt để cắt đứt hẳn chain migration — an toàn vì đây là hành động tường minh của user ("xóa
 * hoàn toàn"), khác với đọc/migrate thụ động lúc mount.
 */
export function clearStoredApplicantProfile(): void {
  safeRemoveItem(APPLICANT_PROFILE_STORAGE_KEY);
  for (const legacyKey of APPLICANT_PROFILE_LEGACY_KEYS) {
    safeRemoveItem(legacyKey);
  }
}
