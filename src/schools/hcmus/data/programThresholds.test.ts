import { describe, expect, it } from 'vitest';
import { findHcmusProgramThreshold, hcmusProgramThresholds } from './programThresholds';

describe('hcmusProgramThresholds', () => {
  it('contains all 39 official HCMUS 2026 program thresholds', () => {
    expect(hcmusProgramThresholds).toHaveLength(39);
  });

  it('keeps program ids unique and does not merge similarly named tracks', () => {
    const ids = hcmusProgramThresholds.map((program) => program.id);
    const codes = hcmusProgramThresholds.map((program) => program.code);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(codes).size).toBe(codes.length);
    expect(findHcmusProgramThreshold('hcmus-7420101')?.name).toBe('Sinh học');
    expect(findHcmusProgramThreshold('hcmus-7420101KD')?.name).toBe('Sinh học (CT TCTA)');
  });

  it('matches verified samples from top, middle, and bottom of the official table', () => {
    expect(findHcmusProgramThreshold('hcmus-7420101')).toMatchObject({
      code: '7420101',
      quota2026: 215,
      minimumCompositeScore: { scale30: 17, scale100: 56.7 },
    });
    expect(findHcmusProgramThreshold('hcmus-74401a1')).toMatchObject({
      code: '74401a1',
      quota2026: 70,
      minimumCompositeScore: { scale30: 24, scale100: 80 },
    });
    expect(findHcmusProgramThreshold('hcmus-7460101NN')).toMatchObject({
      code: '7460101NN',
      quota2026: 180,
      minimumCompositeScore: { scale30: 21, scale100: 70 },
    });
    expect(findHcmusProgramThreshold('hcmus-7480107')).toMatchObject({
      code: '7480107',
      quota2026: 90,
      minimumCompositeScore: { scale30: 24, scale100: 80 },
    });
    expect(findHcmusProgramThreshold('hcmus-75202a1')).toMatchObject({
      code: '75202a1',
      quota2026: 80,
      minimumCompositeScore: { scale30: 24, scale100: 80 },
    });
    expect(findHcmusProgramThreshold('hcmus-7140103')).toMatchObject({
      code: '7140103',
      quota2026: 100,
      minimumCompositeScore: { scale30: 18, scale100: 60 },
    });
  });

  it('stores valid quota and threshold ranges without deriving official columns', () => {
    for (const program of hcmusProgramThresholds) {
      expect(program.quota2026).toBeGreaterThan(0);
      expect(program.minimumCompositeScore.scale30).toBeGreaterThanOrEqual(0);
      expect(program.minimumCompositeScore.scale30).toBeLessThanOrEqual(30);
      expect(program.minimumCompositeScore.scale100).toBeGreaterThanOrEqual(0);
      expect(program.minimumCompositeScore.scale100).toBeLessThanOrEqual(100);
      expect(program.minimumCompositeScore.scale100).toBeCloseTo((program.minimumCompositeScore.scale30 * 100) / 30, 1);
      expect(program.sourceId).toBe('hcmus-threshold-method2-2026');
    }
  });
});
