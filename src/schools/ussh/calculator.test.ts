import { describe, expect, it } from 'vitest';
import { calculateUsshDt3Score, describeUsshDt1Dt2Blocker } from './calculator';

describe('calculateUsshDt3Score', () => {
  it('0.9×(ĐGNL×100/1200) + 0.1×(học bạ×100/30) — không chứa α1/α2', () => {
    const result = calculateUsshDt3Score({ dgnlRaw1200: 900, transcriptTotal30: 24 });
    // dgnlComponent = 0.9 × (900×100/1200) = 0.9×75 = 67.5
    // transcriptComponent = 0.1 × (24×100/30) = 0.1×80 = 8
    expect(result.dgnlComponent).toBeCloseTo(67.5, 5);
    expect(result.transcriptComponent).toBeCloseTo(8, 5);
    expect(result.scoreBeforeBonusAndPriority).toBeCloseTo(75.5, 5);
  });

  it('min: ĐGNL=0, học bạ=0 → 0', () => {
    const result = calculateUsshDt3Score({ dgnlRaw1200: 0, transcriptTotal30: 0 });
    expect(result.scoreBeforeBonusAndPriority).toBe(0);
  });

  it('max: ĐGNL=1200, học bạ=30 → 100', () => {
    const result = calculateUsshDt3Score({ dgnlRaw1200: 1200, transcriptTotal30: 30 });
    expect(result.scoreBeforeBonusAndPriority).toBe(100);
  });
});

describe('describeUsshDt1Dt2Blocker', () => {
  it('liệt kê α1/α2 unresolved cho cả ĐT1 và ĐT2, KHÔNG trả về số', () => {
    const dt1 = describeUsshDt1Dt2Blocker('DT1');
    const dt2 = describeUsshDt1Dt2Blocker('DT2');
    expect(dt1.unresolvedSymbols.length).toBeGreaterThan(0);
    expect(dt2.unresolvedSymbols.length).toBeGreaterThan(0);
    expect(dt1.knownWeights).toContain('0.45');
    expect(dt2.knownWeights).toContain('0.90');
  });
});
