import { describe, expect, it } from 'vitest';
import { lookupIuStandardPriority } from './priority';

describe('lookupIuStandardPriority', () => {
  it('returns 0 when no region/category given', () => {
    expect(lookupIuStandardPriority(undefined, undefined)).toBe(0);
  });

  it('looks up region points', () => {
    expect(lookupIuStandardPriority('KV1', undefined)).toBe(2.5);
    expect(lookupIuStandardPriority('KV2-NT', undefined)).toBe(1.67);
    expect(lookupIuStandardPriority('KV2', undefined)).toBe(0.83);
    expect(lookupIuStandardPriority('KV3', undefined)).toBe(0);
  });

  it('looks up category points', () => {
    expect(lookupIuStandardPriority(undefined, 'UT1')).toBe(6.66);
    expect(lookupIuStandardPriority(undefined, 'UT2')).toBe(3.33);
  });

  it('sums region + category when both present', () => {
    expect(lookupIuStandardPriority('KV1', 'UT1')).toBe(2.5 + 6.66);
  });

  it('unknown codes are treated as 0, never guessed', () => {
    expect(lookupIuStandardPriority('KV99', 'UT99')).toBe(0);
  });
});
