import { describe, expect, it } from 'vitest';
import { checkUmpThreshold } from './eligibility';

describe('checkUmpThreshold', () => {
  it('ngành không xác định → fail, không tra được ngưỡng', () => {
    const result = checkUmpThreshold(undefined, 25);
    expect(result.pass).toBe(false);
    expect(result.requiredText).toContain('Chưa xác định ngành');
  });

  it('Y khoa (7720101) ngưỡng 23.0 — đạt', () => {
    const result = checkUmpThreshold('7720101', 23);
    expect(result.pass).toBe(true);
  });

  it('Y khoa (7720101) ngưỡng 23.0 — không đạt', () => {
    const result = checkUmpThreshold('7720101', 22.99);
    expect(result.pass).toBe(false);
  });

  it('Tâm lý học (7310401) ngưỡng thấp hơn (17.0)', () => {
    expect(checkUmpThreshold('7310401', 17).pass).toBe(true);
    expect(checkUmpThreshold('7310401', 16.99).pass).toBe(false);
  });
});
