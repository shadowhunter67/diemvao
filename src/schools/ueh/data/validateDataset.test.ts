import { describe, expect, it } from 'vitest';
import type { UehCutoff, UehProgram } from '../types/programs';
import { validateUehDataset } from './validateDataset';

const source = {
  scoreScale: 100,
  sourceLabel: 'test',
  sourceUrl: 'https://example.com',
  publishedAt: '2026-08-11',
  accessedAt: '2026-08-11',
};

describe('validateUehDataset', () => {
  it('dataset thật trong repo không có lỗi', () => {
    expect(validateUehDataset()).toEqual([]);
  });

  it('phát hiện duplicate program id', () => {
    const programs: UehProgram[] = [
      { id: 'a', code: '1', name: 'Ngành A', campus: 'hcmc' },
      { id: 'a', code: '2', name: 'Ngành A trùng', campus: 'hcmc' },
    ];
    expect(validateUehDataset(programs, []).some((i) => i.type === 'duplicate-program-id')).toBe(true);
  });

  it('phát hiện cutoff trỏ tới ngành không tồn tại', () => {
    const programs: UehProgram[] = [{ id: 'a', code: '1', name: 'Ngành A', campus: 'hcmc' }];
    const cutoffs: UehCutoff[] = [{ year: 2026, programId: 'b', score: 80, ...source }];
    expect(validateUehDataset(programs, cutoffs).some((i) => i.type === 'cutoff-unknown-program')).toBe(true);
  });

  it('phát hiện >1 bản final cho cùng (năm, ngành)', () => {
    const programs: UehProgram[] = [{ id: 'a', code: '1', name: 'Ngành A', campus: 'hcmc' }];
    const cutoffs: UehCutoff[] = [
      { year: 2026, programId: 'a', score: 80, ...source },
      { year: 2026, programId: 'a', score: 81, ...source },
    ];
    expect(validateUehDataset(programs, cutoffs).some((i) => i.type === 'multiple-final-year-program')).toBe(true);
  });

  it('phát hiện điểm ngoài khoảng 0..100', () => {
    const programs: UehProgram[] = [{ id: 'a', code: '1', name: 'Ngành A', campus: 'hcmc' }];
    const cutoffs: UehCutoff[] = [{ year: 2026, programId: 'a', score: 105, ...source }];
    expect(validateUehDataset(programs, cutoffs).some((i) => i.type === 'score-out-of-range')).toBe(true);
  });
});
