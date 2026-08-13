import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadStoredHcmutMethodContext } from './comparisonContextStorage';

function installLocalStorageMock(entries: Record<string, string>) {
  vi.stubGlobal('window', {});
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => entries[key] ?? null),
  });
}

describe('loadStoredHcmutMethodContext', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back safely when stored JSON is malformed', () => {
    installLocalStorageMock({
      'uniscorevn:hcmut:subject-context:v1': '{bad json',
      'uniscorevn:hcmut:input:v1': '{bad json',
    });

    expect(loadStoredHcmutMethodContext()).toBeUndefined();
  });

  it('does not invent a method context when one required numeric field is missing', () => {
    installLocalStorageMock({
      'uniscorevn:hcmut:subject-context:v1': JSON.stringify({ subject2: 'physics', subject3: 'english' }),
      'uniscorevn:hcmut:input:v1': JSON.stringify({
        bonus: { reward: '0', considerationReward: '0' },
        priorityRaw30Scale: '0',
      }),
    });

    expect(loadStoredHcmutMethodContext()).toBeUndefined();
  });
});
