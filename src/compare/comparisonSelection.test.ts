import { describe, expect, it } from 'vitest';
import {
  addComparisonSelection,
  encodeComparisonSelectionsForUrl,
  moveComparisonSelection,
  parseComparisonSelectionsFromUrl,
  parseStoredComparisonSelections,
  removeComparisonSelection,
  updateComparisonSelection,
  type ComparisonSelection,
} from './comparisonSelection';

const base: ComparisonSelection = { id: 'one', schoolId: 'hcmus', programId: 'hcmus-75202a1', context: { combinationId: 'A00' } };

describe('comparisonSelection', () => {
  it('adds and removes selections by stable entry id', () => {
    const added = addComparisonSelection([], { schoolId: 'hcmus', programId: 'hcmus-75202a1', context: { combinationId: 'A00' } }, 'one');
    expect(added).toEqual([base]);
    expect(removeComparisonSelection(added, 'one')).toEqual([]);
  });

  it('allows the same school with different school-local programs', () => {
    const selections = addComparisonSelection([base], { schoolId: 'hcmus', programId: 'hcmus-7520207', context: { combinationId: 'A00' } }, 'two');
    expect(selections).toHaveLength(2);
    expect(selections.map((selection) => selection.schoolId)).toEqual(['hcmus', 'hcmus']);
  });

  it('prevents exact duplicate school/program/method/context entries', () => {
    const selections = addComparisonSelection([base], { schoolId: 'hcmus', programId: 'hcmus-75202a1', context: { combinationId: 'A00' } }, 'two');
    expect(selections).toEqual([base]);
  });

  it('updates school and program unless it would collide with an existing entry', () => {
    const selections = [
      base,
      { id: 'two', schoolId: 'ueh', programId: 'kinh-te' },
    ];
    expect(updateComparisonSelection(selections, 'two', { schoolId: 'uel', programId: 'kinh-te', context: { combinationId: 'A01' } })[1]).toMatchObject({
      id: 'two',
      schoolId: 'uel',
      programId: 'kinh-te',
    });
    expect(updateComparisonSelection(selections, 'two', { schoolId: 'hcmus', programId: 'hcmus-75202a1', context: { combinationId: 'A00' } })).toEqual(
      selections
    );
  });

  it('reorders selections without changing their ids', () => {
    const selections = [base, { id: 'two', schoolId: 'ueh', programId: 'kinh-te' }];
    expect(moveComparisonSelection(selections, 'two', 'up').map((selection) => selection.id)).toEqual(['two', 'one']);
    expect(moveComparisonSelection(selections, 'one', 'up')).toEqual(selections);
  });

  it('fails malformed storage safely to an empty list', () => {
    expect(parseStoredComparisonSelections('{bad json')).toEqual([]);
    expect(parseStoredComparisonSelections(JSON.stringify({ schoolId: 'hcmus' }))).toEqual([]);
  });

  it('parses share URL selections without applicant profile data', () => {
    const encoded = encodeComparisonSelectionsForUrl([base]);
    const parsed = parseComparisonSelectionsFromUrl(encoded);
    expect(parsed).toEqual([{ ...base, id: 'share-1' }]);
  });
});

/**
 * `isValidContext` xử lý dữ liệu untrusted từ localStorage/URL. Bug đã fix: `!value ||
 * typeof value !== 'object'` coi MỌI primitive (string/number/...) là valid — chỉ `undefined`
 * (context absent, field optional) mới hợp lệ khi không phải object; `null`/string/number/
 * boolean/array phải bị từ chối.
 */
describe('comparisonSelection context validation (parseStoredComparisonSelections)', () => {
  function withContext(context: unknown): string {
    return JSON.stringify([{ id: 'one', schoolId: 'hcmus', context }]);
  }

  it('accepts a selection with undefined (absent) context', () => {
    const raw = JSON.stringify([{ id: 'one', schoolId: 'hcmus' }]);
    expect(parseStoredComparisonSelections(raw)).toEqual([{ id: 'one', schoolId: 'hcmus' }]);
  });

  it('accepts a valid object context', () => {
    const parsed = parseStoredComparisonSelections(withContext({ combinationId: 'A00', hasUsshBonusAchievement: true }));
    expect(parsed).toEqual([{ id: 'one', schoolId: 'hcmus', context: { combinationId: 'A00', hasUsshBonusAchievement: true } }]);
  });

  it('rejects a string context', () => {
    expect(parseStoredComparisonSelections(withContext('hello'))).toEqual([]);
  });

  it('rejects a number context', () => {
    expect(parseStoredComparisonSelections(withContext(123))).toEqual([]);
  });

  it('rejects a null context', () => {
    expect(parseStoredComparisonSelections(withContext(null))).toEqual([]);
  });

  it('rejects an array context', () => {
    expect(parseStoredComparisonSelections(withContext(['A00']))).toEqual([]);
  });

  it('rejects a context with an invalid combinationId/hasUsshBonusAchievement combination', () => {
    expect(parseStoredComparisonSelections(withContext({ combinationId: 'NOT-A-REAL-COMBINATION' }))).toEqual([]);
    expect(parseStoredComparisonSelections(withContext({ hasUsshBonusAchievement: 'yes' }))).toEqual([]);
  });

  it('rejects malformed hcmutBonus (missing/non-numeric fields)', () => {
    expect(parseStoredComparisonSelections(withContext({ hcmutBonus: { reward: 1, considerationReward: 1, encouragement: 1 } }))).toEqual([]);
    expect(
      parseStoredComparisonSelections(withContext({ hcmutBonus: { reward: '1', considerationReward: 1, encouragement: 1, priorityRaw30Scale: 1 } }))
    ).toEqual([]);
    expect(parseStoredComparisonSelections(withContext({ hcmutBonus: null }))).toEqual([]);
    expect(parseStoredComparisonSelections(withContext({ hcmutBonus: [1, 2, 3, 4] }))).toEqual([]);
  });

  it('rejects hcmutBonus with non-finite numeric values', () => {
    expect(
      parseStoredComparisonSelections(
        withContext({ hcmutBonus: { reward: Number.POSITIVE_INFINITY, considerationReward: 1, encouragement: 1, priorityRaw30Scale: 1 } })
      )
    ).toEqual([]);
    expect(
      parseStoredComparisonSelections(withContext({ hcmutBonus: { reward: -1, considerationReward: 1, encouragement: 1, priorityRaw30Scale: 1 } }))
    ).toEqual([]);
  });

  it('accepts a valid hcmutBonus context', () => {
    const bonus = { reward: 2, considerationReward: 1, encouragement: 0, priorityRaw30Scale: 1.5 };
    const parsed = parseStoredComparisonSelections(withContext({ hcmutBonus: bonus }));
    expect(parsed).toEqual([{ id: 'one', schoolId: 'hcmus', context: { hcmutBonus: bonus } }]);
  });
});
