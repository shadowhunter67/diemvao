import { describe, expect, it } from 'vitest';
import { calculateHcmusEffectivePriority, lookupHcmusStandardPriority } from './priority';

describe('HCMUS priority 2026', () => {
  it('uses Bo GD&DT base priority values on scale 30', () => {
    expect(lookupHcmusStandardPriority('KV1', 'UT1')).toBe(2.75);
    expect(lookupHcmusStandardPriority('KV2-NT', 'UT2')).toBe(1.5);
    expect(lookupHcmusStandardPriority('KV3', undefined)).toBe(0);
  });

  it('keeps full priority below 22.5/30', () => {
    expect(calculateHcmusEffectivePriority({ academicPlusBonus30: 22.49, standardPriority30: 2.75 })).toEqual({
      effectivePriority30: 2.75,
      reduced: false,
    });
  });

  it('applies official reduction at the exact 22.5/30 threshold', () => {
    expect(calculateHcmusEffectivePriority({ academicPlusBonus30: 22.5, standardPriority30: 2.75 })).toEqual({
      effectivePriority30: 2.75,
      reduced: true,
    });
  });

  it('uses academic plus bonus as the reduction input above threshold', () => {
    expect(calculateHcmusEffectivePriority({ academicPlusBonus30: 27, standardPriority30: 2.75 })).toEqual({
      effectivePriority30: 1.1,
      reduced: true,
    });
  });
});
