import { beforeEach, describe, expect, it } from 'vitest';
import { safeGetItem, safeRemoveItem, safeSetItem } from './safeStorage';

/** vitest mặc định chạy environment 'node', không có localStorage thật — stub tối thiểu trong bộ
 * nhớ, cùng convention với `storage.test.ts`. `ThrowingStorage` mô phỏng storage bị chặn hoàn toàn
 * (quota exceeded / disabled / private mode / policy) — mọi method throw. */
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

describe('safeStorage', () => {
  beforeEach(() => {
    globalThis.localStorage = new MemoryStorage() as unknown as Storage;
  });

  it('safeGetItem đọc bình thường khi storage hoạt động', () => {
    localStorage.setItem('k', 'v');
    expect(safeGetItem('k')).toBe('v');
  });

  it('safeSetItem ghi bình thường và trả true khi storage hoạt động', () => {
    expect(safeSetItem('k', 'v')).toBe(true);
    expect(localStorage.getItem('k')).toBe('v');
  });

  it('safeRemoveItem xóa bình thường và trả true khi storage hoạt động', () => {
    localStorage.setItem('k', 'v');
    expect(safeRemoveItem('k')).toBe(true);
    expect(localStorage.getItem('k')).toBeNull();
  });

  describe('khi storage throw (quota/disabled/private mode/policy)', () => {
    beforeEach(() => {
      globalThis.localStorage = new ThrowingStorage() as unknown as Storage;
    });

    it('safeGetItem trả null, không throw', () => {
      expect(() => safeGetItem('k')).not.toThrow();
      expect(safeGetItem('k')).toBeNull();
    });

    it('safeSetItem trả false, không throw', () => {
      expect(() => safeSetItem('k', 'v')).not.toThrow();
      expect(safeSetItem('k', 'v')).toBe(false);
    });

    it('safeRemoveItem trả false, không throw', () => {
      expect(() => safeRemoveItem('k')).not.toThrow();
      expect(safeRemoveItem('k')).toBe(false);
    });
  });
});
