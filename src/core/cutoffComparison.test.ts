import { describe, expect, it } from 'vitest';
import { findCutoffComparison, findRecentCutoffComparisons } from './cutoffComparison';

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

  it('current superseded + final replacement -> chooses final replacement', () => {
    const comparison = findCutoffComparison({
      records: [
        { year: 2026, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100, status: 'superseded' },
        { year: 2026, programId: 'cs', methodId: 'combined', score: 81, scoreScale: 100, status: 'final' },
      ],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
      selection: { programId: 'cs', methodId: 'combined' },
    });

    expect(comparison.availability).toBe('published');
    expect(comparison.referenceType).toBe('current');
    expect(comparison.cutoff).toBe(81);
    expect(comparison.difference).toBe(1.5);
  });

  it('current superseded without final replacement is not silently treated as unknown', () => {
    const comparison = findCutoffComparison({
      records: [{ year: 2026, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100, status: 'superseded' }],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
      selection: { programId: 'cs', methodId: 'combined' },
    });

    expect(comparison.availability).toBe('superseded');
    expect(comparison.referenceType).toBe('none');
    expect(comparison.difference).toBeUndefined();
  });
});

describe('findRecentCutoffComparisons', () => {
  it('returns the 2 most recent distinct final years, newest first', () => {
    const comparisons = findRecentCutoffComparisons({
      records: [
        { year: 2024, programId: 'cs', score: 78, scoreScale: 100 },
        { year: 2025, programId: 'cs', score: 79, scoreScale: 100 },
        { year: 2026, programId: 'cs', score: 80, scoreScale: 100 },
      ],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
      selection: { programId: 'cs' },
    });

    expect(comparisons.map((c) => c.year)).toEqual([2026, 2025]);
    expect(comparisons[0].referenceType).toBe('current');
    expect(comparisons[0].difference).toBe(2.5);
    expect(comparisons[1].referenceType).toBe('historical');
    expect(comparisons[1].difference).toBeCloseTo(3.5);
  });

  it('falls back to the 2 most recent PAST years when the target year is not published yet', () => {
    const comparisons = findRecentCutoffComparisons({
      records: [
        { year: 2023, programId: 'cs', score: 77, scoreScale: 100 },
        { year: 2024, programId: 'cs', score: 78, scoreScale: 100 },
        { year: 2025, programId: 'cs', score: 79, scoreScale: 100 },
      ],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
      selection: { programId: 'cs' },
    });

    expect(comparisons.map((c) => c.year)).toEqual([2025, 2024]);
    expect(comparisons.every((c) => c.referenceType === 'historical')).toBe(true);
  });

  it('deduplicates a year with both superseded and final records, keeping only final', () => {
    const comparisons = findRecentCutoffComparisons({
      records: [
        { year: 2026, programId: 'cs', score: 80, scoreScale: 100, status: 'superseded' },
        { year: 2026, programId: 'cs', score: 81, scoreScale: 100, status: 'final' },
        { year: 2025, programId: 'cs', score: 79, scoreScale: 100 },
      ],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
      selection: { programId: 'cs' },
    });

    expect(comparisons).toHaveLength(2);
    expect(comparisons[0].cutoff).toBe(81);
  });

  it('returns a single "none" entry when no year is published at all', () => {
    const comparisons = findRecentCutoffComparisons({
      records: [],
      targetYear: 2026,
      applicantScore: 82.5,
      applicantScale: 100,
      selection: { programId: 'cs' },
    });

    expect(comparisons).toHaveLength(1);
    expect(comparisons[0].referenceType).toBe('none');
  });
});
