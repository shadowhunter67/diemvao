import { beforeEach, describe, expect, it } from 'vitest';
import type { ApplicantProfile } from './applicantProfile';
import {
  APPLICANT_PROFILE_LEGACY_KEYS,
  APPLICANT_PROFILE_STORAGE_KEY,
  clearStoredApplicantProfile,
  loadApplicantProfile,
  repairApplicantProfile,
  saveApplicantProfile,
} from './applicantProfileStorage';

/** vitest mặc định chạy environment 'node', không có `localStorage`/`window` — stub tối thiểu
 * trong bộ nhớ, cùng pattern với `core/storage.test.ts`. */
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

/**
 * Batch 5, workstream L — profile cũ (batch 4, trước khi có `reconcileVactFromComponents`/
 * `reconcileVactFromTotal`) có thể đã bị ghi ở trạng thái `total` != `sum(components)` (vd UEH ghi
 * total sau HCMUT, không có source/timestamp để biết cái nào mới hơn). `repairApplicantProfile`
 * phải phát hiện và sửa AN TOÀN — không đoán, không crash — khi profile được load lại từ storage.
 */
beforeEach(() => {
  globalThis.localStorage = new MemoryStorage() as unknown as Storage;
  // `loadApplicantProfile`/`saveApplicantProfile`/`clearStoredApplicantProfile` đều guard bằng
  // `typeof window === 'undefined'` (an toàn cho SSR/build) — stub tối thiểu để chạy được ở
  // environment 'node' của vitest.
  (globalThis as { window?: unknown }).window = globalThis;
});

describe('repairApplicantProfile', () => {
  it('7. legacy profile conflict (total != sum components) → giữ total, xóa components, không crash', () => {
    const legacy: ApplicantProfile = {
      graduationYear: 2026,
      exams: { vact: { total: 1050, components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 } } }, // sum 980
    };
    const repaired = repairApplicantProfile(legacy);
    expect(repaired.exams?.vact?.total).toBe(1050);
    expect(repaired.exams?.vact?.components).toBeUndefined();
    expect(repaired.exams?.vact?.totalSource).toBe('legacy-import');
    // Field khác không bị đụng tới.
    expect(repaired.graduationYear).toBe(2026);
  });

  it('profile khớp nhau (total === sum components) → giữ nguyên, không sửa gì', () => {
    const consistent: ApplicantProfile = {
      exams: { vact: { total: 980, components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 } } },
    };
    expect(repairApplicantProfile(consistent)).toEqual(consistent);
  });

  it('components không đủ 4 phần → không coi là conflict (không đủ dữ liệu để so sánh), giữ nguyên', () => {
    const partial: ApplicantProfile = { exams: { vact: { total: 1050, components: { vietnamese: 250 } } } };
    expect(repairApplicantProfile(partial)).toEqual(partial);
  });

  it('profile rỗng/không có vact → giữ nguyên, không throw', () => {
    expect(repairApplicantProfile({})).toEqual({});
    expect(() => repairApplicantProfile({})).not.toThrow();
    const noVact: ApplicantProfile = { graduationYear: 2026 };
    expect(repairApplicantProfile(noVact)).toEqual(noVact);
  });

  it('không mutate object truyền vào (pure)', () => {
    const legacy: ApplicantProfile = Object.freeze({
      exams: Object.freeze({
        vact: Object.freeze({ total: 1050, components: Object.freeze({ vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }) }),
      }),
    });
    expect(() => repairApplicantProfile(legacy)).not.toThrow();
    expect(legacy.exams?.vact?.total).toBe(1050);
    expect(legacy.exams?.vact?.components?.vietnamese).toBe(250);
  });
});

/**
 * Batch 7 — rebrand storage `uniscore:applicant-profile:v1` → `uniscorevn:applicant-profile:v1`.
 * Yêu cầu bắt buộc: migrate legacy, current-key ưu tiên nếu cả 2 tồn tại, legacy hỏng → fallback an
 * toàn, migration idempotent, và xóa profile không làm legacy "sống lại".
 */
describe('storage migration uniscore:* → uniscorevn:* (Batch 7)', () => {
  const LEGACY_KEY = APPLICANT_PROFILE_LEGACY_KEYS[0];

  it('legacy key có data hợp lệ, current key chưa có → migrate sang current key', () => {
    const legacyProfile: ApplicantProfile = { graduationYear: 2026, thpt: { scores: { math: 8 } } };
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacyProfile));

    const loaded = loadApplicantProfile();

    expect(loaded).toEqual(legacyProfile);
    expect(localStorage.getItem(APPLICANT_PROFILE_STORAGE_KEY)).toBe(JSON.stringify(legacyProfile));
  });

  it('cả current key và legacy key đều có data → current key thắng (không bị đè bởi legacy)', () => {
    const currentProfile: ApplicantProfile = { graduationYear: 2027 };
    const legacyProfile: ApplicantProfile = { graduationYear: 2020 };
    localStorage.setItem(APPLICANT_PROFILE_STORAGE_KEY, JSON.stringify(currentProfile));
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacyProfile));

    const loaded = loadApplicantProfile();

    expect(loaded).toEqual(currentProfile);
  });

  it('legacy key malformed (không parse được) → fallback an toàn, trả về profile rỗng, không throw', () => {
    localStorage.setItem(LEGACY_KEY, 'not-json{{{');

    expect(() => loadApplicantProfile()).not.toThrow();
    expect(loadApplicantProfile()).toEqual({});
  });

  it('migration idempotent — load 2 lần liên tiếp ra cùng kết quả, lần 2 không migrate lại (đọc thẳng current key)', () => {
    const legacyProfile: ApplicantProfile = { graduationYear: 2026 };
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacyProfile));

    const first = loadApplicantProfile();
    const second = loadApplicantProfile();

    expect(first).toEqual(second);
    expect(localStorage.getItem(APPLICANT_PROFILE_STORAGE_KEY)).toBe(JSON.stringify(legacyProfile));
  });

  it('xóa hồ sơ dùng chung (clearStoredApplicantProfile) rồi reload → KHÔNG bị legacy key làm "sống lại"', () => {
    const legacyProfile: ApplicantProfile = { graduationYear: 2026, thpt: { scores: { math: 9 } } };
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacyProfile));

    // Bước 1: mở app lần đầu → migrate từ legacy.
    const migrated = loadApplicantProfile();
    expect(migrated).toEqual(legacyProfile);
    expect(localStorage.getItem(APPLICANT_PROFILE_STORAGE_KEY)).not.toBeNull();

    // Bước 2: user bấm "Xóa hồ sơ dùng chung".
    clearStoredApplicantProfile();
    saveApplicantProfile({}); // effect thật trong ApplicantProfileContext ghi lại profile rỗng ngay sau đó.

    // Bước 3: reload — legacy key phải đã bị xóa hẳn, không được đọc lại.
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    const afterReload = loadApplicantProfile();
    expect(afterReload).toEqual({});
  });
});
