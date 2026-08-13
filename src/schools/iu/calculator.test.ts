import { describe, expect, it } from 'vitest';
import { calculateIuAcademicScore } from './calculator';

describe('calculateIuAcademicScore', () => {
  it('uses full formula with ĐGNL when provided', () => {
    const result = calculateIuAcademicScore({ thptRawTotal30: 24, dgnlRaw1200: 900, transcriptTotal30: 24 });
    // thpt=80, dgnl=75, transcript=80 -> 0.4*80+0.5*75+0.1*80 = 32+37.5+8=77.5
    expect(result.thptScaled100).toBeCloseTo(80, 2);
    expect(result.dgnlScaled100).toBeCloseTo(75, 2);
    expect(result.transcriptScaled100).toBeCloseTo(80, 2);
    expect(result.usedDgnlSubstitute).toBe(false);
    expect(result.academicScore).toBeCloseTo(77.5, 2);
  });

  it('substitutes Hs3*THPT when ĐGNL is missing', () => {
    const result = calculateIuAcademicScore({ thptRawTotal30: 24, transcriptTotal30: 24 });
    // thpt=80, dgnlSubstitute=0.83*80=66.4, transcript=80 -> 0.4*80+0.5*66.4+0.1*80=32+33.2+8=73.2
    expect(result.usedDgnlSubstitute).toBe(true);
    expect(result.academicScore).toBeCloseTo(73.2, 1);
  });
});
