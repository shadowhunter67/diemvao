import { describe, expect, it } from 'vitest';
import { findCutoffComparison } from './cutoffComparison';

describe('findCutoffComparison', () => {
  function deepFreeze<T>(value: T): T {
    if (value && typeof value === 'object') {
      Object.freeze(value);
      for (const nested of Object.values(value)) deepFreeze(nested);
    }
    return value;
  }

  it('cùng scale + cùng context → tính gap', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
    });
    expect(comparison.comparable).toBe(true);
    expect(comparison.difference).toBe(2.5);
  });

  it('khác scale → không tính gap', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, score: 25, scoreScale: 30 }],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
    });
    expect(comparison.comparable).toBe(false);
    expect(comparison.difference).toBeUndefined();
  });

  it('historical comparableToPrevious=false → không tính gap', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2025, score: 80, scoreScale: 100, comparableToPrevious: false }],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
    });
    expect(comparison.referenceType).toBe('historical');
    expect(comparison.comparable).toBe(false);
  });

  it('current missing + previous comparable → dùng mốc lịch sử gần nhất', () => {
    const comparison = findCutoffComparison({
      records: [
        { year: 2024, score: 78, scoreScale: 100 },
        { year: 2025, score: 80, scoreScale: 100 },
      ],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
      notPublishedChecks: [{ year: 2026 }],
    });
    expect(comparison.availability).toBe('not-published');
    expect(comparison.referenceType).toBe('historical');
    expect(comparison.year).toBe(2025);
    expect(comparison.difference).toBe(2.5);
  });

  it('unknown current state khác confirmed not-published', () => {
    const unknown = findCutoffComparison({ records: [], targetYear: 2026, applicantScore: 82.5, applicantScale: 100 });
    const notPublished = findCutoffComparison({
      records: [],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
      notPublishedChecks: [{ year: 2026 }],
    });
    expect(unknown.availability).toBe('unknown');
    expect(notPublished.availability).toBe('not-published');
  });

  it('wrong program context upstream → không có comparison record', () => {
    const comparison = findCutoffComparison({ records: [], targetYear: 2026, applicantScore: 82.5, applicantScale: 100 });
    expect(comparison.referenceType).toBe('none');
    expect(comparison.comparable).toBe(false);
  });
  it('exact score /100 vs cutoff /100 with matching program/method is allowed', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 82,
      applicantScale: 100,
      selection: { programId: 'cs', methodId: 'combined' },
    });
    expect(comparison.comparable).toBe(true);
    expect(comparison.difference).toBe(2);
  });

  it('exact score /30 vs cutoff /100 is forbidden', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 25,
      applicantScale: 30,
      selection: { programId: 'cs', methodId: 'combined' },
    });
    expect(comparison.comparable).toBe(false);
    expect(comparison.difference).toBeUndefined();
  });

  it('same program but different method is forbidden', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, programId: 'cs', methodId: 'transcript', score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 82,
      applicantScale: 100,
      selection: { programId: 'cs', methodId: 'combined' },
    });
    expect(comparison.referenceType).toBe('none');
    expect(comparison.comparable).toBe(false);
  });

  it('record with program context but no selected program does not produce a gap', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 82,
      applicantScale: 100,
    });
    expect(comparison.referenceType).toBe('none');
    expect(comparison.difference).toBeUndefined();
  });

  it('same program and method but different campus is forbidden when campus dimension exists', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, programId: 'econ', methodId: 'integrated', campusId: 'mekong', score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 82,
      applicantScale: 100,
      selection: { programId: 'econ', methodId: 'integrated', campusId: 'hcmc' },
    });
    expect(comparison.referenceType).toBe('none');
    expect(comparison.difference).toBeUndefined();
  });

  it('same program and method but different applicant type is forbidden when applicant type dimension exists', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, programId: 'cs', methodId: 'combined', applicantTypeId: 'no-dgnl', score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 82,
      applicantScale: 100,
      selection: { programId: 'cs', methodId: 'combined', applicantTypeId: 'dgnl' },
    });
    expect(comparison.referenceType).toBe('none');
    expect(comparison.difference).toBeUndefined();
  });

  it('combination mismatch is forbidden when cutoff record is combination-specific', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, programId: 'law', methodId: 'combined', combinationId: 'D01', score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 82,
      applicantScale: 100,
      selection: { programId: 'law', methodId: 'combined', combinationId: 'A01' },
    });
    expect(comparison.referenceType).toBe('none');
    expect(comparison.difference).toBeUndefined();
  });

  it('method changed between years does not create historical comparison', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2025, programId: 'cs', methodId: 'old-method', score: 80, scoreScale: 100 }],
      targetYear: 2026,
      applicantScore: 82,
      applicantScale: 100,
      selection: { programId: 'cs', methodId: 'combined' },
      notPublishedChecks: [{ year: 2026 }],
    });
    expect(comparison.referenceType).toBe('none');
    expect(comparison.availability).toBe('not-published');
    expect(comparison.difference).toBeUndefined();
  });

  it('does not mutate cutoff records while filtering context', () => {
    const records = deepFreeze([{ year: 2026, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100 }]);
    findCutoffComparison({
      records,
      targetYear: 2026,
      applicantScore: 82,
      applicantScale: 100,
      selection: { programId: 'cs', methodId: 'combined' },
    });
    expect(records).toEqual([{ year: 2026, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100 }]);
  });
});
