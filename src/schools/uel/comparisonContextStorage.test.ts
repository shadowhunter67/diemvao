import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadStoredUelCombinationId, parseUelCombinationId, saveStoredUelCombinationId } from './comparisonContextStorage';

function installLocalStorageMock() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
  vi.stubGlobal('window', {});
  vi.stubGlobal('localStorage', localStorage);
  return localStorage;
}

describe('UEL comparison context storage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('persists and reloads selected A01 combination', () => {
    const localStorage = installLocalStorageMock();
    saveStoredUelCombinationId('A01');
    expect(localStorage.setItem).toHaveBeenCalledWith('uniscorevn:uel:subject-context:v1', JSON.stringify({ combinationId: 'A01' }));
    expect(loadStoredUelCombinationId()).toBe('A01');
  });

  it('falls back safely for malformed or unsupported context', () => {
    expect(parseUelCombinationId('{not json')).toBe('');
    expect(parseUelCombinationId(JSON.stringify({ combinationId: 'NOPE' }))).toBe('');
    expect(parseUelCombinationId(JSON.stringify({ combinationId: 'A01' }))).toBe('A01');
  });
});
