import { describe, expect, it } from 'vitest';
import { hcmueProgramThresholds } from './programs';

describe('hcmueProgramThresholds', () => {
  it('contains the official 47 HCMUE main-campus threshold rows', () => {
    const hcmcPrograms = hcmueProgramThresholds.filter((program) => program.campus === 'hcmc');
    expect(hcmcPrograms).toHaveLength(47);
    expect(hcmueProgramThresholds.find((program) => program.code === '7140209' && program.campus === 'hcmc')).toMatchObject({
      name: 'Su pham Toan hoc',
      thptThreshold30: 24,
      dgnlcbThreshold30: 22,
    });
    expect(hcmueProgramThresholds.find((program) => program.code === '7480201' && program.campus === 'hcmc')).toMatchObject({
      name: 'Cong nghe thong tin',
      thptThreshold30: 18,
      dgnlcbThreshold30: 17,
    });
  });

  it('contains 10 Long An branch programs and 5 Gia Lai branch programs, without a published threshold', () => {
    const longAn = hcmueProgramThresholds.filter((program) => program.campus === 'long-an');
    const giaLai = hcmueProgramThresholds.filter((program) => program.campus === 'gia-lai');
    expect(longAn).toHaveLength(10);
    expect(giaLai).toHaveLength(5);
    for (const program of [...longAn, ...giaLai]) {
      expect(program.thptThreshold30).toBeUndefined();
      expect(program.dgnlcbThreshold30).toBeUndefined();
    }
  });

  it('has no duplicate ids across all campuses', () => {
    const ids = hcmueProgramThresholds.map((program) => program.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a total of 62 programs across all campuses', () => {
    expect(hcmueProgramThresholds).toHaveLength(62);
  });
});
