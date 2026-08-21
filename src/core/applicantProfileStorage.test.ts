import { beforeEach, describe, expect, it } from 'vitest';
import type { ApplicantProfile } from './applicantProfile';
import {
  APPLICANT_PROFILE_LEGACY_KEYS,
  APPLICANT_PROFILE_STORAGE_KEY,
  clearStoredApplicantProfile,
  loadApplicantProfile,
  repairApplicantProfile,
  sanitizeApplicantProfile,
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

/**
 * Hardening runtime validation cho `ApplicantProfile` từ localStorage/URL (untrusted input) —
 * trước đây `parseApplicantProfile` chỉ check root là object rồi cast thẳng sang `ApplicantProfile`,
 * không validate field con nào. `sanitizeApplicantProfile` drop field sai type/range, giữ field
 * hợp lệ khác — không bao giờ throw, không mất toàn bộ profile chỉ vì 1 field hỏng.
 */
describe('sanitizeApplicantProfile', () => {
  it('giữ nguyên một profile hợp lệ đầy đủ field', () => {
    const valid: ApplicantProfile = {
      graduationYear: 2026,
      thpt: { scores: { math: 8.5, literature: 7 } },
      transcript: { grade10: { math: 8 }, grade11: { math: 8.5 }, grade12: { math: 9 } },
      exams: { vact: { total: 980, components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }, totalSource: 'derived-from-components', componentsSource: 'user-components-input' } },
      certificates: { ielts: 6.5, sat: 1400 },
      priority: { region: 'KV1', category: 'UT1' },
    };
    expect(sanitizeApplicantProfile(valid)).toEqual(valid);
  });

  it('giữ nguyên một profile hợp lệ chỉ có vài field (partial)', () => {
    const partial: ApplicantProfile = { graduationYear: 2026, thpt: { scores: { math: 8 } } };
    expect(sanitizeApplicantProfile(partial)).toEqual(partial);
  });

  it('root không phải object (string/number/array/null) → trả {}', () => {
    expect(sanitizeApplicantProfile('not-an-object')).toEqual({});
    expect(sanitizeApplicantProfile(123)).toEqual({});
    expect(sanitizeApplicantProfile(null)).toEqual({});
    expect(sanitizeApplicantProfile(undefined)).toEqual({});
    expect(sanitizeApplicantProfile(['a', 'b'])).toEqual({});
    expect(sanitizeApplicantProfile(true)).toEqual({});
  });

  it('THPT scores lồng bị hỏng — key lạ/value sai type bị drop, giữ nguyên entry hợp lệ khác', () => {
    const result = sanitizeApplicantProfile({
      thpt: { scores: { math: 8, literature: 'bad', notASubject: 5, physics: [1, 2] } },
    });
    expect(result).toEqual({ thpt: { scores: { math: 8 } } });
  });

  it('transcript lồng bị hỏng — grade sai type bị drop riêng lẻ, giữ grade hợp lệ khác', () => {
    const result = sanitizeApplicantProfile({
      transcript: { grade10: { math: 8 }, grade11: 'not-an-object', grade12: { math: 9, badSubject: 20 } },
    });
    expect(result).toEqual({ transcript: { grade10: { math: 8 }, grade12: { math: 9 } } });
  });

  it('NaN/Infinity qua direct object (không đi qua JSON.parse) bị coi là invalid, drop field', () => {
    const result = sanitizeApplicantProfile({
      thpt: { scores: { math: Number.NaN, literature: Number.POSITIVE_INFINITY, english: 7 } },
      graduationYear: Number.NaN,
      certificates: { ielts: Number.NEGATIVE_INFINITY, sat: 1400 },
    });
    expect(result).toEqual({ thpt: { scores: { english: 7 } }, certificates: { sat: 1400 } });
  });

  it('score ngoài range (thang 10) bị drop', () => {
    const result = sanitizeApplicantProfile({ thpt: { scores: { math: 15, literature: -1, english: 10 } } });
    expect(result).toEqual({ thpt: { scores: { english: 10 } } });
  });

  it('V-ACT total/components malformed — sai range/type bị drop từng field, invariant vactProfile.ts vẫn áp dụng', () => {
    const result = sanitizeApplicantProfile({
      exams: {
        vact: {
          total: 5000, // ngoài VACT_TOTAL_RANGE (0-1200)
          components: { vietnamese: 250, english: 'bad', math: 999, scientificThinking: 240 }, // math ngoài VACT_COMPONENT_RANGE (0-300)
          totalSource: 'not-a-real-source',
          componentsSource: 'user-components-input',
        },
      },
    });
    expect(result).toEqual({
      exams: { vact: { components: { vietnamese: 250, scientificThinking: 240 }, componentsSource: 'user-components-input' } },
    });
  });

  it('V-ACT source string không hợp lệ bị drop nhưng total/components hợp lệ vẫn giữ', () => {
    const result = sanitizeApplicantProfile({
      exams: { vact: { total: 900, totalSource: 'hacked-source' } },
    });
    expect(result).toEqual({ exams: { vact: { total: 900 } } });
  });

  it('V-ACT không phải object bị drop toàn bộ exams', () => {
    expect(sanitizeApplicantProfile({ exams: { vact: 'not-an-object' } })).toEqual({});
    expect(sanitizeApplicantProfile({ exams: 'not-an-object' })).toEqual({});
  });

  it('certificates malformed — key lạ/out-of-range/sai type bị drop riêng lẻ', () => {
    const result = sanitizeApplicantProfile({
      certificates: { ielts: 12, toeflIbt: 90, toeic: 'high', act: 36, unknownCert: 100 },
    });
    expect(result).toEqual({ certificates: { toeflIbt: 90, act: 36 } });
  });

  it('graduationYear không phải integer hợp lý bị drop, không ảnh hưởng field khác', () => {
    expect(sanitizeApplicantProfile({ graduationYear: 2026.5, thpt: { scores: { math: 8 } } })).toEqual({ thpt: { scores: { math: 8 } } });
    expect(sanitizeApplicantProfile({ graduationYear: 30000, thpt: { scores: { math: 8 } } })).toEqual({ thpt: { scores: { math: 8 } } });
    expect(sanitizeApplicantProfile({ graduationYear: '2026' })).toEqual({});
  });

  it('field optional hỏng không làm mất các factual field hợp lệ khác trong cùng profile', () => {
    const result = sanitizeApplicantProfile({
      graduationYear: 'garbage',
      thpt: { scores: { math: 8 } },
      transcript: 'not-an-object',
      exams: { vact: { total: 900 } },
      certificates: 42,
      priority: { region: 'KV1', category: 123 },
    });
    expect(result).toEqual({
      thpt: { scores: { math: 8 } },
      exams: { vact: { total: 900 } },
      priority: { region: 'KV1' },
    });
  });

  it('không throw với input adversarial (browser extension/schema cũ/corrupt)', () => {
    expect(() => sanitizeApplicantProfile({ thpt: null, transcript: [1, 2, 3], exams: { vact: { components: null } } })).not.toThrow();
    expect(() => sanitizeApplicantProfile(Symbol('weird'))).not.toThrow();
  });
});

describe('parseApplicantProfile / loadApplicantProfile — end-to-end qua localStorage (untrusted input)', () => {
  it('legacy migration vẫn hoạt động khi profile legacy có field hỏng lẫn field hợp lệ', () => {
    const LEGACY_KEY = APPLICANT_PROFILE_LEGACY_KEYS[0];
    localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify({ graduationYear: 2026, thpt: { scores: { math: 8, badSubject: 99 } }, certificates: { ielts: 999 } })
    );

    const loaded = loadApplicantProfile();

    expect(loaded).toEqual({ graduationYear: 2026, thpt: { scores: { math: 8 } } });
    expect(localStorage.getItem(APPLICANT_PROFILE_STORAGE_KEY)).not.toBeNull();
  });

  it('repair conflict V-ACT vẫn hoạt động sau khi profile đi qua sanitize (range hợp lệ nhưng total != sum components)', () => {
    localStorage.setItem(
      APPLICANT_PROFILE_STORAGE_KEY,
      JSON.stringify({
        exams: { vact: { total: 1050, components: { vietnamese: 250, english: 230, math: 260, scientificThinking: 240 } } }, // sum 980
      })
    );

    const loaded = loadApplicantProfile();

    expect(loaded.exams?.vact?.total).toBe(1050);
    expect(loaded.exams?.vact?.components).toBeUndefined();
    expect(loaded.exams?.vact?.totalSource).toBe('legacy-import');
  });

  it('root JSON không phải object → profile rỗng, không crash', () => {
    localStorage.setItem(APPLICANT_PROFILE_STORAGE_KEY, JSON.stringify('just-a-string'));
    expect(() => loadApplicantProfile()).not.toThrow();
    expect(loadApplicantProfile()).toEqual({});
  });

  it('root JSON là array → profile rỗng, không crash', () => {
    localStorage.setItem(APPLICANT_PROFILE_STORAGE_KEY, JSON.stringify([1, 2, 3]));
    expect(loadApplicantProfile()).toEqual({});
  });
});

/** Storage bị chặn hoàn toàn (quota exceeded / disabled / private mode / policy) — mọi method
 * throw. `saveApplicantProfile`/`clearStoredApplicantProfile`/`loadApplicantProfile` phải tiếp tục
 * hoạt động bằng in-memory state, KHÔNG throw ra ngoài (xem `safeStorage.ts`). */
class ThrowingStorage {
  getItem(): string | null {
    throw new DOMException('blocked', 'SecurityError');
  }
  setItem(): void {
    throw new DOMException('quota exceeded', 'QuotaExceededError');
  }
  removeItem(): void {
    throw new DOMException('blocked', 'SecurityError');
  }
  clear(): void {
    throw new DOMException('blocked', 'SecurityError');
  }
}

describe('khi storage throw (quota/disabled/private mode/policy)', () => {
  beforeEach(() => {
    globalThis.localStorage = new ThrowingStorage() as unknown as Storage;
    (globalThis as { window?: unknown }).window = globalThis;
  });

  it('saveApplicantProfile không throw khi setItem throw', () => {
    expect(() => saveApplicantProfile({ graduationYear: 2026 })).not.toThrow();
  });

  it('loadApplicantProfile không throw khi getItem throw — trả profile rỗng thay vì crash', () => {
    expect(() => loadApplicantProfile()).not.toThrow();
    expect(loadApplicantProfile()).toEqual({});
  });

  it('clearStoredApplicantProfile không throw khi removeItem throw (xóa hồ sơ vẫn an toàn dù storage bị chặn)', () => {
    expect(() => clearStoredApplicantProfile()).not.toThrow();
  });
});
