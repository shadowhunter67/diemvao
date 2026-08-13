import type { ApplicantProfile } from './applicantProfile';
import { readWithMigration } from './storage';
import { hasCompleteVactComponents, sumVactComponents } from './vactProfile';

/**
 * Key riêng, KHÔNG namespace theo trường (khác `getSchoolStorageKey`) — đây là factual profile
 * dùng chung nhiều trường, không phải state UI của một trường cụ thể. Batch 4 mới tạo field này
 * lần đầu (không có legacy key đời MVP/Phase 9/13) — chỉ có ĐÚNG 1 đời legacy: key dưới brand cũ
 * "Uniscore" trước rebrand Batch 7 sang "UniscoreVN".
 */
export const APPLICANT_PROFILE_STORAGE_KEY = 'uniscorevn:applicant-profile:v1';
export const APPLICANT_PROFILE_LEGACY_KEYS = ['uniscore:applicant-profile:v1'];

function parseApplicantProfile(raw: string): ApplicantProfile | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    return parsed as ApplicantProfile;
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
  if (typeof window === 'undefined') return;
  localStorage.setItem(APPLICANT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
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
  if (typeof window === 'undefined') return;
  localStorage.removeItem(APPLICANT_PROFILE_STORAGE_KEY);
  for (const legacyKey of APPLICANT_PROFILE_LEGACY_KEYS) {
    localStorage.removeItem(legacyKey);
  }
}
