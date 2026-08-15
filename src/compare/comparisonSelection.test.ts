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
