import { describe, expect, it } from 'vitest';
import {
  checkUsshDgnlThreshold,
  checkUsshThptThreshold,
  checkUsshTranscriptThreshold,
  USSH_DGNL_THRESHOLD_1200,
  USSH_THPT_COMBINATION_THRESHOLD_30,
} from './eligibility';

describe('checkUsshThptThreshold', () => {
  it('below/exact/above', () => {
    expect(checkUsshThptThreshold(USSH_THPT_COMBINATION_THRESHOLD_30 - 0.01).pass).toBe(false);
    expect(checkUsshThptThreshold(USSH_THPT_COMBINATION_THRESHOLD_30).pass).toBe(true);
    expect(checkUsshThptThreshold(USSH_THPT_COMBINATION_THRESHOLD_30 + 1).pass).toBe(true);
  });
});

describe('checkUsshTranscriptThreshold', () => {
  it('below/exact', () => {
    expect(checkUsshTranscriptThreshold(16.99).pass).toBe(false);
    expect(checkUsshTranscriptThreshold(17).pass).toBe(true);
  });
});

describe('checkUsshDgnlThreshold', () => {
  it('below/exact/above', () => {
    expect(checkUsshDgnlThreshold(USSH_DGNL_THRESHOLD_1200 - 1).pass).toBe(false);
    expect(checkUsshDgnlThreshold(USSH_DGNL_THRESHOLD_1200).pass).toBe(true);
    expect(checkUsshDgnlThreshold(USSH_DGNL_THRESHOLD_1200 + 100).pass).toBe(true);
  });
});
