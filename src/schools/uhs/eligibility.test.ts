import { describe, expect, it } from 'vitest';
import { checkUhsEntryEligibility } from './eligibility';

describe('checkUhsEntryEligibility', () => {
  it('requires Tot/Gioi and 20/30 or 8.5 graduation score for medicine-like programs', () => {
    expect(checkUhsEntryEligibility({ programGroup: 'medicine-like', grade12Performance: 'kha', combinationTotal30: 21 }).pass).toBe(false);
    expect(checkUhsEntryEligibility({ programGroup: 'medicine-like', grade12Performance: 'tot', combinationTotal30: 19.9, graduationScore10: 8.49 }).pass).toBe(false);
    expect(checkUhsEntryEligibility({ programGroup: 'medicine-like', grade12Performance: 'tot', combinationTotal30: 20 }).pass).toBe(true);
    expect(checkUhsEntryEligibility({ programGroup: 'medicine-like', grade12Performance: 'tot', graduationScore10: 8.5 }).pass).toBe(true);
  });

  it('uses the lower Kha and 16.5/30 or 6.5 graduation score threshold for nursing', () => {
    expect(checkUhsEntryEligibility({ programGroup: 'nursing', grade12Performance: 'dat', combinationTotal30: 17 }).pass).toBe(false);
    expect(checkUhsEntryEligibility({ programGroup: 'nursing', grade12Performance: 'kha', combinationTotal30: 16.4, graduationScore10: 6.49 }).pass).toBe(false);
    expect(checkUhsEntryEligibility({ programGroup: 'nursing', grade12Performance: 'kha', combinationTotal30: 16.5 }).pass).toBe(true);
    expect(checkUhsEntryEligibility({ programGroup: 'nursing', grade12Performance: 'kha', graduationScore10: 6.5 }).pass).toBe(true);
  });
});
