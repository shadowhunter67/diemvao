import { describe, expect, it } from 'vitest';
import { checkUhsMedicinePharmacyThreshold } from './eligibility';

describe('checkUhsMedicinePharmacyThreshold', () => {
  it('fails when total below 20 and no subject reaches 8.5', () => {
    expect(checkUhsMedicinePharmacyThreshold(18, [6, 6, 6]).pass).toBe(false);
  });

  it('passes by total >= 20 even if no subject reaches 8.5', () => {
    expect(checkUhsMedicinePharmacyThreshold(20, [7, 7, 6]).pass).toBe(true);
  });

  it('passes by a single subject >= 8.5 even if total is below 20', () => {
    expect(checkUhsMedicinePharmacyThreshold(15, [8.5, 4, 2.5]).pass).toBe(true);
  });
});
