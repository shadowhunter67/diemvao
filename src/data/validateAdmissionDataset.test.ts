import { describe, expect, it } from 'vitest';
import type { AdmissionCutoff, HcmutProgram } from '../types/programs';
import { validateAdmissionDataset } from './validateAdmissionDataset';

const source = { sourceLabel: 'test', sourceUrl: 'https://example.com', accessedAt: '2026-08-09' };

describe('validateAdmissionDataset', () => {
  it('dataset thật trong repo không có lỗi', () => {
    expect(validateAdmissionDataset()).toEqual([]);
  });

  it('phát hiện duplicate program id', () => {
    const programs: HcmutProgram[] = [
      { id: 'a', name: 'Ngành A' },
      { id: 'a', name: 'Ngành A trùng' },
    ];
    const issues = validateAdmissionDataset(programs, []);
    expect(issues.some((i) => i.type === 'duplicate-program-id')).toBe(true);
  });

  it('phát hiện cutoff trỏ tới ngành không tồn tại', () => {
    const programs: HcmutProgram[] = [{ id: 'a', name: 'Ngành A' }];
    const cutoffs: AdmissionCutoff[] = [{ year: 2026, programId: 'b', score: 80, method: 'combined', ...source }];
    const issues = validateAdmissionDataset(programs, cutoffs);
    expect(issues.some((i) => i.type === 'cutoff-unknown-program')).toBe(true);
  });

  it('phát hiện trùng (năm, ngành)', () => {
    const programs: HcmutProgram[] = [{ id: 'a', name: 'Ngành A' }];
    const cutoffs: AdmissionCutoff[] = [
      { year: 2026, programId: 'a', score: 80, method: 'combined', ...source },
      { year: 2026, programId: 'a', score: 81, method: 'combined', ...source },
    ];
    const issues = validateAdmissionDataset(programs, cutoffs);
    expect(issues.some((i) => i.type === 'duplicate-year-program')).toBe(true);
  });

  it('phát hiện điểm ngoài khoảng 0..100', () => {
    const programs: HcmutProgram[] = [{ id: 'a', name: 'Ngành A' }];
    const cutoffs: AdmissionCutoff[] = [{ year: 2026, programId: 'a', score: 105, method: 'combined', ...source }];
    const issues = validateAdmissionDataset(programs, cutoffs);
    expect(issues.some((i) => i.type === 'score-out-of-range')).toBe(true);
  });

  it('phát hiện năm không hợp lệ', () => {
    const programs: HcmutProgram[] = [{ id: 'a', name: 'Ngành A' }];
    const cutoffs: AdmissionCutoff[] = [{ year: 1899, programId: 'a', score: 80, method: 'combined', ...source }];
    const issues = validateAdmissionDataset(programs, cutoffs);
    expect(issues.some((i) => i.type === 'invalid-year')).toBe(true);
  });
});
