import { describe, expect, it } from 'vitest';
import {
  calculateUhsNormalizedComponents,
  inferUhsDgnlFromThpt100,
  inferUhsThptFromDgnl100,
  normalizeUhsDgnlTo100,
  normalizeUhsThptTo100,
  normalizeUhsTranscriptTo100,
} from './calculator';

describe('UHS calculator components', () => {
  it('normalizes THPT, ĐGNL, and học bạ to scale 100', () => {
    expect(normalizeUhsThptTo100(24)).toBe(80);
    expect(normalizeUhsDgnlTo100(960)).toBe(80);
    expect(normalizeUhsTranscriptTo100(24)).toBe(80);
  });

  it('infers missing ĐGNL for 2026 THPT candidates using official x0.87 rule', () => {
    expect(inferUhsDgnlFromThpt100(80)).toBe(69.6);
    expect(calculateUhsNormalizedComponents({ graduationYear: 2026, thptTotal30: 24 }).dgnl100).toBe(69.6);
  });

  it('infers missing THPT for pre-2026 graduates using official x1.15 rule', () => {
    expect(inferUhsThptFromDgnl100(80)).toBe(92);
    expect(calculateUhsNormalizedComponents({ graduationYear: 2025, dgnlRaw1200: 960 }).thpt100).toBe(92);
  });
});
