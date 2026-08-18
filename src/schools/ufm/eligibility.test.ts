import { describe, expect, it } from 'vitest';
import { checkUfmThptThreshold, checkUfmDgnlThreshold, checkUfmVsatThreshold, checkUfmHocbaThreshold } from './eligibility';

describe('checkUfmThptThreshold — Thông báo 10/7/2026', () => {
  it('standard group threshold is 16/30, no sub-conditions', () => {
    expect(checkUfmThptThreshold({ total30: 16, group: 'standard' }).pass).toBe(true);
    expect(checkUfmThptThreshold({ total30: 15.99, group: 'standard' }).pass).toBe(false);
  });

  it('law-economics requires total >=20 AND math >=6 AND every subject >=1', () => {
    expect(checkUfmThptThreshold({ total30: 20, group: 'law-economics', mathRawScore: 6, subjectRawScores: [6, 7, 7] }).pass).toBe(true);
    expect(checkUfmThptThreshold({ total30: 20, group: 'law-economics', mathRawScore: 5.99, subjectRawScores: [5.99, 7, 7] }).pass).toBe(false);
    expect(checkUfmThptThreshold({ total30: 20, group: 'law-economics', mathRawScore: 6, subjectRawScores: [6, 0.99, 13] }).pass).toBe(false);
    expect(checkUfmThptThreshold({ total30: 19.99, group: 'law-economics', mathRawScore: 6, subjectRawScores: [6, 7, 6.99] }).pass).toBe(false);
  });

  it('law-economics fails safe (not eligible) when math/subject raw scores are not provided', () => {
    expect(checkUfmThptThreshold({ total30: 25, group: 'law-economics' }).pass).toBe(false);
  });
});

describe('checkUfmDgnlThreshold', () => {
  it('standard group threshold is 657/1200', () => {
    expect(checkUfmDgnlThreshold(657, 'standard').pass).toBe(true);
    expect(checkUfmDgnlThreshold(656, 'standard').pass).toBe(false);
  });

  it('law-economics threshold is 720/1200', () => {
    expect(checkUfmDgnlThreshold(719, 'law-economics').pass).toBe(false);
    expect(checkUfmDgnlThreshold(720, 'law-economics').pass).toBe(true);
  });
});

describe('checkUfmVsatThreshold', () => {
  it('standard group threshold is 241', () => {
    expect(checkUfmVsatThreshold(240, 'standard').pass).toBe(false);
    expect(checkUfmVsatThreshold(241, 'standard').pass).toBe(true);
  });

  it('law-economics threshold is 270', () => {
    expect(checkUfmVsatThreshold(269, 'law-economics').pass).toBe(false);
    expect(checkUfmVsatThreshold(270, 'law-economics').pass).toBe(true);
  });
});

describe('checkUfmHocbaThreshold', () => {
  it('both groups share the 18/30 threshold', () => {
    expect(checkUfmHocbaThreshold(17.99, 'standard').pass).toBe(false);
    expect(checkUfmHocbaThreshold(18, 'standard').pass).toBe(true);
    expect(checkUfmHocbaThreshold(17.99, 'law-economics').pass).toBe(false);
    expect(checkUfmHocbaThreshold(18, 'law-economics').pass).toBe(true);
  });
});
