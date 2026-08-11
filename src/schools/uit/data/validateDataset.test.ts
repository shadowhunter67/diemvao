import { describe, expect, it } from 'vitest';
import type { UitCutoff, UitProgram } from '../types/programs';
import { validateUitDataset } from './validateDataset';

const source = {
  scoreScale: 100,
  sourceLabel: 'test',
  sourceUrl: 'https://example.com',
  publishedAt: '2026-08-10',
  accessedAt: '2026-08-10',
};

describe('validateUitDataset', () => {
  it('dataset thật trong repo không có lỗi', () => {
    expect(validateUitDataset()).toEqual([]);
  });

  it('phát hiện duplicate program id', () => {
    const programs: UitProgram[] = [
      { id: 'a', code: 'X1', name: 'Ngành A' },
      { id: 'a', code: 'X2', name: 'Ngành A trùng' },
    ];
    const issues = validateUitDataset(programs, []);
    expect(issues.some((i) => i.type === 'duplicate-program-id')).toBe(true);
  });

  it('phát hiện cutoff trỏ tới ngành không tồn tại', () => {
    const programs: UitProgram[] = [{ id: 'a', code: 'X1', name: 'Ngành A' }];
    const cutoffs: UitCutoff[] = [{ year: 2026, programId: 'b', score: 80, ...source }];
    const issues = validateUitDataset(programs, cutoffs);
    expect(issues.some((i) => i.type === 'cutoff-unknown-program')).toBe(true);
  });

  it('phát hiện >1 bản final cho cùng (năm, ngành)', () => {
    const programs: UitProgram[] = [{ id: 'a', code: 'X1', name: 'Ngành A' }];
    const cutoffs: UitCutoff[] = [
      { year: 2026, programId: 'a', score: 80, ...source },
      { year: 2026, programId: 'a', score: 81, ...source },
    ];
    const issues = validateUitDataset(programs, cutoffs);
    expect(issues.some((i) => i.type === 'multiple-final-year-program')).toBe(true);
  });

  it('KHÔNG lỗi khi 1 bản final + 1 bản superseded cùng (năm, ngành)', () => {
    const programs: UitProgram[] = [{ id: 'a', code: 'X1', name: 'Ngành A' }];
    const cutoffs: UitCutoff[] = [
      { year: 2026, programId: 'a', score: 75, status: 'superseded', ...source },
      { year: 2026, programId: 'a', score: 81, status: 'final', ...source },
    ];
    const issues = validateUitDataset(programs, cutoffs);
    expect(issues).toEqual([]);
  });

  it('phát hiện điểm ngoài khoảng 0..100', () => {
    const programs: UitProgram[] = [{ id: 'a', code: 'X1', name: 'Ngành A' }];
    const cutoffs: UitCutoff[] = [{ year: 2026, programId: 'a', score: 105, ...source }];
    const issues = validateUitDataset(programs, cutoffs);
    expect(issues.some((i) => i.type === 'score-out-of-range')).toBe(true);
  });
});
