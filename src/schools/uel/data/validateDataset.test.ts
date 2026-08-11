import { describe, expect, it } from 'vitest';
import type { UelCutoff, UelProgram } from '../types/programs';
import { validateUelDataset } from './validateDataset';

const source = {
  scoreScale: 100,
  sourceLabel: 'test',
  sourceUrl: 'https://example.com',
  publishedAt: '2026-08-09',
  accessedAt: '2026-08-11',
};

describe('validateUelDataset', () => {
  it('dataset thật trong repo không có lỗi', () => {
    expect(validateUelDataset()).toEqual([]);
  });

  it('phát hiện duplicate program id', () => {
    const programs: UelProgram[] = [
      { id: 'a', code: '1', name: 'Ngành A', group: 'Kinh tế' },
      { id: 'a', code: '2', name: 'Ngành A trùng', group: 'Kinh tế' },
    ];
    expect(validateUelDataset(programs, []).some((i) => i.type === 'duplicate-program-id')).toBe(true);
  });

  it('phát hiện cutoff trỏ tới ngành không tồn tại', () => {
    const programs: UelProgram[] = [{ id: 'a', code: '1', name: 'Ngành A', group: 'Kinh tế' }];
    const cutoffs: UelCutoff[] = [{ year: 2026, programId: 'b', score: 80, ...source }];
    expect(validateUelDataset(programs, cutoffs).some((i) => i.type === 'cutoff-unknown-program')).toBe(true);
  });

  it('phát hiện >1 bản final cho cùng (năm, ngành)', () => {
    const programs: UelProgram[] = [{ id: 'a', code: '1', name: 'Ngành A', group: 'Kinh tế' }];
    const cutoffs: UelCutoff[] = [
      { year: 2026, programId: 'a', score: 80, ...source },
      { year: 2026, programId: 'a', score: 81, ...source },
    ];
    expect(validateUelDataset(programs, cutoffs).some((i) => i.type === 'multiple-final-year-program')).toBe(true);
  });

  it('phát hiện điểm ngoài khoảng 0..100', () => {
    const programs: UelProgram[] = [{ id: 'a', code: '1', name: 'Ngành A', group: 'Kinh tế' }];
    const cutoffs: UelCutoff[] = [{ year: 2026, programId: 'a', score: 105, ...source }];
    expect(validateUelDataset(programs, cutoffs).some((i) => i.type === 'score-out-of-range')).toBe(true);
  });
});
