import { describe, expect, it } from 'vitest';
import { checkHcmusThptThreshold, checkHcmusNuclearEngineeringCondition, HCMUS_THPT_COMBINATION_THRESHOLD_30 } from './eligibility';

describe('checkHcmusThptThreshold', () => {
  it('fails below threshold', () => {
    expect(checkHcmusThptThreshold(HCMUS_THPT_COMBINATION_THRESHOLD_30 - 0.01).pass).toBe(false);
  });

  it('passes at exact threshold', () => {
    expect(checkHcmusThptThreshold(HCMUS_THPT_COMBINATION_THRESHOLD_30).pass).toBe(true);
  });

  it('passes above threshold', () => {
    expect(checkHcmusThptThreshold(HCMUS_THPT_COMBINATION_THRESHOLD_30 + 5).pass).toBe(true);
  });
});

describe('checkHcmusNuclearEngineeringCondition', () => {
  it('fails when either subject below 7.5', () => {
    expect(checkHcmusNuclearEngineeringCondition(7.4, 8).pass).toBe(false);
    expect(checkHcmusNuclearEngineeringCondition(8, 7.4).pass).toBe(false);
  });

  it('passes when both subjects meet the threshold exactly', () => {
    expect(checkHcmusNuclearEngineeringCondition(7.5, 7.5).pass).toBe(true);
  });
});
