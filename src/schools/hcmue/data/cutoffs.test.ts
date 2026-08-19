import { describe, expect, it } from 'vitest';
import { hcmueCutoffs, hcmueCutoffsGiaLai, hcmueCutoffsHcmc, hcmueCutoffsLongAn } from './cutoffs';
import { hcmueProgramThresholds } from './programs';

describe('hcmueCutoffs', () => {
  it('has the expected row counts per campus and a matching total', () => {
    expect(hcmueCutoffsHcmc).toHaveLength(47);
    expect(hcmueCutoffsLongAn).toHaveLength(10);
    expect(hcmueCutoffsGiaLai).toHaveLength(5);
    expect(hcmueCutoffs).toHaveLength(62);
  });

  it('has no duplicate programId', () => {
    const ids = hcmueCutoffs.map((cutoff) => cutoff.programId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every programId matches an existing hcmueProgramThresholds entry', () => {
    const knownIds = new Set(hcmueProgramThresholds.map((program) => program.id));
    for (const cutoff of hcmueCutoffs) {
      expect(knownIds.has(cutoff.programId as string)).toBe(true);
    }
  });

  it('every hcmc-campus threshold program has a matching cutoff row', () => {
    const cutoffIds = new Set(hcmueCutoffsHcmc.map((cutoff) => cutoff.programId));
    const hcmcPrograms = hcmueProgramThresholds.filter((program) => program.campus === 'hcmc');
    expect(hcmcPrograms).toHaveLength(47);
    for (const program of hcmcPrograms) {
      expect(cutoffIds.has(program.id)).toBe(true);
    }
  });

  it('every long-an/gia-lai threshold program has a matching cutoff row', () => {
    const cutoffIds = new Set([...hcmueCutoffsLongAn, ...hcmueCutoffsGiaLai].map((cutoff) => cutoff.programId));
    const branchPrograms = hcmueProgramThresholds.filter((program) => program.campus === 'long-an' || program.campus === 'gia-lai');
    expect(branchPrograms).toHaveLength(15);
    for (const program of branchPrograms) {
      expect(cutoffIds.has(program.id)).toBe(true);
    }
  });

  it('all scores are on the 30-point scale and within a plausible range', () => {
    for (const cutoff of hcmueCutoffs) {
      expect(cutoff.scoreScale).toBe(30);
      expect(cutoff.score).toBeGreaterThan(0);
      expect(cutoff.score).toBeLessThanOrEqual(30);
    }
  });

  it('spot-checks known values from the official table', () => {
    expect(hcmueCutoffs.find((c) => c.programId === 'hcmue-7140209')).toMatchObject({ combinationId: 'A00', score: 29.49 });
    expect(hcmueCutoffs.find((c) => c.programId === 'hcmue-7480201')).toMatchObject({ combinationId: 'A01', score: 18 });
    expect(hcmueCutoffs.find((c) => c.programId === 'hcmue-7140209-longan')).toMatchObject({ combinationId: 'A00', score: 28.84 });
    expect(hcmueCutoffs.find((c) => c.programId === 'hcmue-7810101-gialai')).toMatchObject({ combinationId: 'C00', score: 18 });
  });
});
