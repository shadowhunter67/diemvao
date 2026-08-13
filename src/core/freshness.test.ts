import { describe, expect, it } from 'vitest';
import { CURRENT_ADMISSION_YEAR } from './admissionYear';
import type { RuleEvidence } from './evidence';
import { assessCutoffFreshness, assessRuleEvidenceForCurrentUse, assessRuleFreshness } from './freshness';

describe('freshness lifecycle', () => {
  it('keeps verification and freshness as separate dimensions', () => {
    const officialButSuperseded: RuleEvidence = {
      sourceId: 'source-a',
      verification: 'verified',
      effectiveYear: CURRENT_ADMISSION_YEAR,
      lifecycle: {
        effectiveYear: CURRENT_ADMISSION_YEAR,
        status: 'superseded',
        supersededBy: 'source-b',
      },
    };

    const assessment = assessRuleEvidenceForCurrentUse(officialButSuperseded, CURRENT_ADMISSION_YEAR);
    expect(officialButSuperseded.verification).toBe('verified');
    expect(assessment).toMatchObject({ usable: false, freshness: 'superseded' });
  });

  it('treats previous-year final cutoffs as historical reference, not stale', () => {
    expect(assessCutoffFreshness({ effectiveYear: 2025, currentAdmissionYear: 2026, status: 'final' })).toBe('historical');
  });

  it('does not make calendar-age guesses without semantic lifecycle evidence', () => {
    expect(assessRuleFreshness({ effectiveYear: 2026, currentAdmissionYear: 2026, status: 'current' })).toBe('current');
    expect(assessRuleFreshness({ currentAdmissionYear: 2026 })).toBe('unknown');
  });

  it('allows informational evidence to be non-current without blocking score-affecting exact rules', () => {
    const informational: RuleEvidence = {
      sourceId: 'old-copy',
      verification: 'verified',
      effectiveYear: 2025,
      criticality: 'informational',
    };
    expect(assessRuleEvidenceForCurrentUse(informational, 2026)).toMatchObject({ usable: true, freshness: 'historical' });
  });
});
