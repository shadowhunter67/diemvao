import { describe, expect, it } from 'vitest';
import { iuPrograms, findIuProgram } from './programs';
import { iuCutoffs2026, findIuCutoff } from './cutoffs';

describe('iuPrograms', () => {
  it('has 38 programs (24 own-degree + 14 joint)', () => {
    expect(iuPrograms).toHaveLength(38);
  });

  it('has no duplicate ids', () => {
    const ids = iuPrograms.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('finds a program by id or code', () => {
    expect(findIuProgram('iu-7220201')?.name).toBe('Ngôn ngữ Anh');
    expect(findIuProgram('7220201')?.name).toBe('Ngôn ngữ Anh');
    expect(findIuProgram(undefined)).toBeUndefined();
    expect(findIuProgram('does-not-exist')).toBeUndefined();
  });
});

describe('iuCutoffs2026', () => {
  it('has one cutoff per program', () => {
    expect(iuCutoffs2026).toHaveLength(38);
  });

  it('every cutoff references a real program id', () => {
    const programIds = new Set(iuPrograms.map((p) => p.id));
    for (const cutoff of iuCutoffs2026) {
      expect(programIds.has(cutoff.programId)).toBe(true);
    }
  });

  it('finds a cutoff by program id', () => {
    expect(findIuCutoff('iu-7220201')?.score).toBe(73);
    expect(findIuCutoff('iu-7580201')?.score).toBe(50);
    expect(findIuCutoff(undefined)).toBeUndefined();
  });

  it('all scores are on the 0-100 scale', () => {
    for (const cutoff of iuCutoffs2026) {
      expect(cutoff.scoreScale).toBe(100);
      expect(cutoff.score).toBeGreaterThanOrEqual(0);
      expect(cutoff.score).toBeLessThanOrEqual(100);
    }
  });
});
