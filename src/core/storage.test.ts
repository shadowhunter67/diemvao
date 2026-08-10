import { beforeEach, describe, expect, it } from 'vitest';
import { getSchoolStorageKey, readWithMigration } from './storage';

/** vitest mặc định chạy environment 'node', không có localStorage — stub tối thiểu trong bộ nhớ cho test này. */
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

function jsonParse(raw: string): { value: string } | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && typeof parsed.value === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

describe('getSchoolStorageKey', () => {
  it('builds a namespaced key', () => {
    expect(getSchoolStorageKey('hcmut', 'input', 1)).toBe('uniscore:hcmut:input:v1');
    expect(getSchoolStorageKey('uit', 'target', 2)).toBe('uniscore:uit:target:v2');
  });
});

describe('readWithMigration', () => {
  const NEW_KEY = 'uniscore:hcmut:input:v1';
  const LEGACY_KEYS = ['uniscore-input-v1', 'hcmut-score-input-v2'];

  it('uses the new key directly when it already exists', () => {
    localStorage.setItem(NEW_KEY, JSON.stringify({ value: 'new' }));
    localStorage.setItem(LEGACY_KEYS[0], JSON.stringify({ value: 'legacy1' }));

    const result = readWithMigration(NEW_KEY, LEGACY_KEYS, jsonParse);

    expect(result).toEqual({ value: 'new' });
  });

  it('migrates from the first valid legacy key when new key is absent', () => {
    localStorage.setItem(LEGACY_KEYS[0], JSON.stringify({ value: 'legacy1' }));
    localStorage.setItem(LEGACY_KEYS[1], JSON.stringify({ value: 'legacy2' }));

    const result = readWithMigration(NEW_KEY, LEGACY_KEYS, jsonParse);

    expect(result).toEqual({ value: 'legacy1' });
    expect(localStorage.getItem(NEW_KEY)).toBe(JSON.stringify({ value: 'legacy1' }));
  });

  it('falls through to the next legacy key when the first one is malformed', () => {
    localStorage.setItem(LEGACY_KEYS[0], 'not-json{{{');
    localStorage.setItem(LEGACY_KEYS[1], JSON.stringify({ value: 'legacy2' }));

    const result = readWithMigration(NEW_KEY, LEGACY_KEYS, jsonParse);

    expect(result).toEqual({ value: 'legacy2' });
    expect(localStorage.getItem(NEW_KEY)).toBe(JSON.stringify({ value: 'legacy2' }));
  });

  it('does not crash and returns null when every key is missing or malformed', () => {
    localStorage.setItem(LEGACY_KEYS[0], 'not-json{{{');

    const result = readWithMigration(NEW_KEY, LEGACY_KEYS, jsonParse);

    expect(result).toBeNull();
    expect(localStorage.getItem(NEW_KEY)).toBeNull();
  });

  it('returns null (not a legacy value) when the new key itself is malformed', () => {
    localStorage.setItem(NEW_KEY, 'not-json{{{');
    localStorage.setItem(LEGACY_KEYS[0], JSON.stringify({ value: 'legacy1' }));

    const result = readWithMigration(NEW_KEY, LEGACY_KEYS, jsonParse);

    expect(result).toBeNull();
  });
});
