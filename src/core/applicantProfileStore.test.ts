import { beforeEach, describe, expect, it } from 'vitest';
import { createApplicantProfileStore } from './applicantProfileStore';

/** vitest mặc định chạy environment 'node' — stub tối thiểu, cùng convention với các test storage
 * khác trong repo (`core/storage.test.ts`, `core/applicantProfileStorage.test.ts`). */
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

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage() as unknown as Storage;
});

describe('applicantProfileStore — race condition regression (batch: bỏ ref/state 2 nguồn sự thật)', () => {
  it('2 update liên tiếp trong cùng lệnh gọi (không có render/effect ở giữa): update sau đọc đúng kết quả của update trước', () => {
    const store = createApplicantProfileStore({});

    // Trước fix: nếu updateVactComponents/updateVactTotal đọc profile qua 1 ref chỉ đồng bộ bởi
    // useEffect, gọi liên tiếp thế này (không có render nào chen giữa) sẽ khiến lệnh thứ 2 đọc
    // snapshot CŨ. Store mới không có effect nào ở giữa — mọi lệnh đọc `profile` closure hiện tại.
    store.updateVactComponents({ vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }); // sum 980
    const { componentsCleared } = store.updateVactTotal(980, 'user-total-input'); // khớp sum → giữ components

    expect(componentsCleared).toBe(false);
    expect(store.getProfile().exams?.vact?.total).toBe(980);
    expect(store.getProfile().exams?.vact?.components).toEqual({ vietnamese: 250, english: 230, math: 260, scientificThinking: 240 });
  });

  it('components → total: total khác sum(components) hiện có → xóa components (xung đột thật, không phải stale-read)', () => {
    const store = createApplicantProfileStore({});

    store.updateVactComponents({ vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }); // sum 980
    const { componentsCleared } = store.updateVactTotal(1050, 'user-total-input'); // khác sum → conflict

    expect(componentsCleared).toBe(true);
    expect(store.getProfile().exams?.vact?.total).toBe(1050);
    expect(store.getProfile().exams?.vact?.components).toBeUndefined();
  });

  it('total → components: components mới nhập sau khi đã có total → derive total mới từ components, không giữ total cũ', () => {
    const store = createApplicantProfileStore({});

    store.updateVactTotal(900, 'user-total-input');
    store.updateVactComponents({ vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }); // sum 980, đủ 4 phần

    expect(store.getProfile().exams?.vact?.total).toBe(980);
    expect(store.getProfile().exams?.vact?.totalSource).toBe('derived-from-components');
  });

  it('same-value/no-conflict: gọi updateVactTotal lặp lại đúng giá trị đã khớp components — không xóa components, không đổi gì thêm', () => {
    const store = createApplicantProfileStore({});
    store.updateVactComponents({ vietnamese: 250, english: 230, math: 260, scientificThinking: 240 }); // sum 980

    const first = store.updateVactTotal(980, 'user-total-input');
    const second = store.updateVactTotal(980, 'user-total-input');

    expect(first.componentsCleared).toBe(false);
    expect(second.componentsCleared).toBe(false);
    expect(store.getProfile().exams?.vact?.components).toEqual({ vietnamese: 250, english: 230, math: 260, scientificThinking: 240 });
  });

  it('cross-school flow: updateProfile ghi thpt (trường A) rồi updateVactTotal ghi V-ACT (trường B) liên tiếp — cả 2 field cùng tồn tại, không field nào bị mất do stale overwrite', () => {
    const store = createApplicantProfileStore({});

    store.updateProfile((current) => ({ ...current, thpt: { scores: { math: 8, physics: 7.5, chemistry: 8.5 } } }));
    store.updateVactTotal(950, 'user-total-input');
    store.updateProfile((current) => ({ ...current, graduationYear: 2026 }));

    const profile = store.getProfile();
    expect(profile.thpt?.scores).toEqual({ math: 8, physics: 7.5, chemistry: 8.5 });
    expect(profile.exams?.vact?.total).toBe(950);
    expect(profile.graduationYear).toBe(2026);
  });

  it('clearProfile xóa sạch profile và không throw dù storage bị chặn', () => {
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('quota exceeded', 'QuotaExceededError');
      },
      removeItem: () => {
        throw new DOMException('blocked', 'SecurityError');
      },
      clear: () => {},
      key: () => null,
      length: 0,
    } as Storage;

    const store = createApplicantProfileStore({ graduationYear: 2026, exams: { vact: { total: 900 } } });
    expect(() => store.clearProfile()).not.toThrow();
    expect(store.getProfile()).toEqual({});
  });

  it('subscribe/notify: mọi mutation đều gọi listener đúng 1 lần mỗi lệnh, unsubscribe dừng nhận notify', () => {
    const store = createApplicantProfileStore({});
    let callCount = 0;
    const unsubscribe = store.subscribe(() => {
      callCount += 1;
    });

    store.updateProfile((current) => ({ ...current, graduationYear: 2026 }));
    expect(callCount).toBe(1);

    unsubscribe();
    store.updateProfile((current) => ({ ...current, graduationYear: 2027 }));
    expect(callCount).toBe(1);
  });
});
