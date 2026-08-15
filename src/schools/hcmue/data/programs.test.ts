import { describe, expect, it } from 'vitest';
import { hcmueProgramThresholds } from './programs';

describe('hcmueProgramThresholds', () => {
  it('contains the official 47 HCMUE main-campus threshold rows', () => {
    expect(hcmueProgramThresholds).toHaveLength(47);
    expect(hcmueProgramThresholds.find((program) => program.code === '7140209')).toMatchObject({
      name: 'Su pham Toan hoc',
      thptThreshold30: 24,
      dgnlcbThreshold30: 22,
    });
    expect(hcmueProgramThresholds.find((program) => program.code === '7480201')).toMatchObject({
      name: 'Cong nghe thong tin',
      thptThreshold30: 18,
      dgnlcbThreshold30: 17,
    });
  });
});
