import { describe, expect, it } from 'vitest';
import { checkHutechThptThreshold, checkHutechDgnlThreshold, checkHutechVsatThreshold, checkHutechHocbaThreshold } from './eligibility';

describe('checkHutechThptThreshold — Thông báo 04/7/2026', () => {
  it('standard group threshold is 15/30', () => {
    expect(checkHutechThptThreshold(15, 'standard').pass).toBe(true);
    expect(checkHutechThptThreshold(14.99, 'standard').pass).toBe(false);
  });

  it('medicine threshold is 22/30', () => {
    expect(checkHutechThptThreshold(21.99, 'medicine').pass).toBe(false);
    expect(checkHutechThptThreshold(22, 'medicine').pass).toBe(true);
  });

  it('pharmacy-law threshold is 20/30', () => {
    expect(checkHutechThptThreshold(19.99, 'pharmacy-law').pass).toBe(false);
    expect(checkHutechThptThreshold(20, 'pharmacy-law').pass).toBe(true);
  });

  it('nursing-lab threshold is 18/30', () => {
    expect(checkHutechThptThreshold(17.99, 'nursing-lab').pass).toBe(false);
    expect(checkHutechThptThreshold(18, 'nursing-lab').pass).toBe(true);
  });
});

describe('checkHutechDgnlThreshold', () => {
  it('standard group threshold is 550/1200', () => {
    expect(checkHutechDgnlThreshold(550, 'standard').pass).toBe(true);
    expect(checkHutechDgnlThreshold(549, 'standard').pass).toBe(false);
  });

  it('medicine threshold is 650/1200', () => {
    expect(checkHutechDgnlThreshold(649, 'medicine').pass).toBe(false);
    expect(checkHutechDgnlThreshold(650, 'medicine').pass).toBe(true);
  });

  it('pharmacy threshold is 570/1200', () => {
    expect(checkHutechDgnlThreshold(569, 'pharmacy').pass).toBe(false);
    expect(checkHutechDgnlThreshold(570, 'pharmacy').pass).toBe(true);
  });
});

describe('checkHutechVsatThreshold', () => {
  it('medicine/pharmacy group threshold is 250', () => {
    expect(checkHutechVsatThreshold(249, 'medicine').pass).toBe(false);
    expect(checkHutechVsatThreshold(250, 'medicine').pass).toBe(true);
    expect(checkHutechVsatThreshold(250, 'pharmacy').pass).toBe(true);
  });

  it('standard group threshold is 225', () => {
    expect(checkHutechVsatThreshold(224, 'standard').pass).toBe(false);
    expect(checkHutechVsatThreshold(225, 'standard').pass).toBe(true);
  });
});

describe('checkHutechHocbaThreshold', () => {
  it('medicine threshold is 23/30', () => {
    expect(checkHutechHocbaThreshold(22.99, 'medicine').pass).toBe(false);
    expect(checkHutechHocbaThreshold(23, 'medicine').pass).toBe(true);
  });

  it('pharmacy threshold is 21/30', () => {
    expect(checkHutechHocbaThreshold(20.99, 'pharmacy').pass).toBe(false);
    expect(checkHutechHocbaThreshold(21, 'pharmacy').pass).toBe(true);
  });

  it('nursing-lab threshold is 19/30', () => {
    expect(checkHutechHocbaThreshold(18.99, 'nursing-lab').pass).toBe(false);
    expect(checkHutechHocbaThreshold(19, 'nursing-lab').pass).toBe(true);
  });

  it('standard threshold is 18/30', () => {
    expect(checkHutechHocbaThreshold(17.99, 'standard').pass).toBe(false);
    expect(checkHutechHocbaThreshold(18, 'standard').pass).toBe(true);
  });
});
