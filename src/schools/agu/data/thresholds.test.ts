import { describe, expect, it } from 'vitest';
import { AGU_BETA_WEIGHTS_2026, AGU_PROGRAM_THRESHOLDS_2026 } from './thresholds';

describe('AGU_PROGRAM_THRESHOLDS_2026', () => {
  it('contains all 43 official AGU 2026 program thresholds', () => {
    expect(AGU_PROGRAM_THRESHOLDS_2026).toHaveLength(43);
  });

  it('keeps program codes unique', () => {
    const codes = AGU_PROGRAM_THRESHOLDS_2026.map((program) => program.programCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('matches verified samples from the official table (teacher-training group, business group, Luật)', () => {
    expect(AGU_PROGRAM_THRESHOLDS_2026.find((p) => p.programCode === '7140202')).toMatchObject({
      name: 'Giáo dục Tiểu học',
      quota: 144,
      thptMin: 20,
      dgnlMin: null,
    });
    expect(AGU_PROGRAM_THRESHOLDS_2026.find((p) => p.programCode === '7480201')).toMatchObject({
      name: 'Công nghệ thông tin',
      quota: 220,
      thptMin: 15,
      dgnlMin: 500,
    });
    expect(AGU_PROGRAM_THRESHOLDS_2026.find((p) => p.programCode === '7380101')).toMatchObject({
      name: 'Luật',
      quota: 77,
      thptMin: 20,
      dgnlMin: null,
    });
  });

  it('stores valid quota and threshold ranges without deriving unstated columns', () => {
    for (const program of AGU_PROGRAM_THRESHOLDS_2026) {
      expect(program.quota).toBeGreaterThan(0);
      expect(program.thptMin).toBeGreaterThan(0);
      expect(program.thptMin).toBeLessThanOrEqual(30);
      if (program.dgnlMin !== null) {
        expect(program.dgnlMin).toBeGreaterThan(0);
        expect(program.dgnlMin).toBeLessThanOrEqual(1200);
      }
    }
  });
});

describe('AGU_BETA_WEIGHTS_2026', () => {
  it('sums to 1 (official beta1/beta2/beta3 from the signed notice)', () => {
    const { beta1Thpt, beta2Dgnl, beta3Transcript } = AGU_BETA_WEIGHTS_2026;
    expect(beta1Thpt + beta2Dgnl + beta3Transcript).toBeCloseTo(1, 10);
    expect(AGU_BETA_WEIGHTS_2026).toEqual({ beta1Thpt: 0.4, beta2Dgnl: 0.4, beta3Transcript: 0.2 });
  });
});
