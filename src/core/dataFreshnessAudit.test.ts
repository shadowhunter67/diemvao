import { describe, expect, it } from 'vitest';
import { CURRENT_ADMISSION_YEAR } from './admissionYear';
import { auditAdmissionDataFreshness, getCutoffPublicationStatus } from './dataFreshnessAudit';

describe('auditAdmissionDataFreshness', () => {
  it('flags current final cutoffs that are missing source metadata', () => {
    const issues = auditAdmissionDataFreshness({
      currentAdmissionYear: CURRENT_ADMISSION_YEAR,
      cutoffs: [{ schoolId: 'demo', year: CURRENT_ADMISSION_YEAR, programId: 'cs', score: 80 }],
    });

    expect(issues.some((issue) => issue.id.startsWith('cutoff-source:'))).toBe(true);
    expect(issues).toContainEqual(expect.objectContaining({ code: 'CURRENT_CUTOFF_MISSING_SOURCE', severity: 'error' }));
  });

  it('flags conflicting duplicate current final cutoffs in the same context', () => {
    const source = { sourceLabel: 'Official notice', sourceUrl: 'https://example.edu/cutoff' };
    const issues = auditAdmissionDataFreshness({
      currentAdmissionYear: CURRENT_ADMISSION_YEAR,
      cutoffs: [
        { schoolId: 'demo', year: CURRENT_ADMISSION_YEAR, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100, ...source },
        { schoolId: 'demo', year: CURRENT_ADMISSION_YEAR, programId: 'cs', methodId: 'combined', score: 81, scoreScale: 100, ...source },
      ],
    });

    expect(issues.some((issue) => issue.id.startsWith('cutoff-conflict:'))).toBe(true);
    expect(issues).toContainEqual(expect.objectContaining({ code: 'DUPLICATE_CURRENT_CUTOFF', severity: 'error' }));
  });

  it('does not treat superseded current cutoff plus final replacement as a duplicate conflict', () => {
    const source = { sourceLabel: 'Official notice', sourceUrl: 'https://example.edu/cutoff' };
    const issues = auditAdmissionDataFreshness({
      currentAdmissionYear: CURRENT_ADMISSION_YEAR,
      cutoffs: [
        { schoolId: 'demo', year: CURRENT_ADMISSION_YEAR, programId: 'cs', methodId: 'combined', score: 80, scoreScale: 100, status: 'superseded', ...source },
        { schoolId: 'demo', year: CURRENT_ADMISSION_YEAR, programId: 'cs', methodId: 'combined', score: 81, scoreScale: 100, status: 'final', ...source },
      ],
    });

    expect(issues.some((issue) => issue.id.startsWith('cutoff-conflict:'))).toBe(false);
    expect(getCutoffPublicationStatus([{ year: CURRENT_ADMISSION_YEAR, score: 81, status: 'final', ...source }], CURRENT_ADMISSION_YEAR)).toBe('published');
  });

  it('preserves superseded as a cutoff publication state when no final replacement is available', () => {
    expect(
      getCutoffPublicationStatus(
        [{ schoolId: 'demo', year: CURRENT_ADMISSION_YEAR, programId: 'cs', score: 80, status: 'superseded' }],
        CURRENT_ADMISSION_YEAR
      )
    ).toBe('superseded');
  });

  it('flags superseded score-affecting rule evidence', () => {
    const issues = auditAdmissionDataFreshness({
      currentAdmissionYear: CURRENT_ADMISSION_YEAR,
      ruleEvidence: [
        {
          sourceId: 'old-rule',
          verification: 'verified',
          effectiveYear: CURRENT_ADMISSION_YEAR,
          lifecycle: { effectiveYear: CURRENT_ADMISSION_YEAR, status: 'superseded', supersededBy: 'new-rule' },
        },
      ],
    });

    expect(issues).toContainEqual(expect.objectContaining({ kind: 'rule', severity: 'error' }));
    expect(issues).toContainEqual(expect.objectContaining({ code: 'SUPERSEDED_SOURCE_IN_CURRENT_RULE' }));
  });

  it('flags methods that do not match the configured admission year', () => {
    const issues = auditAdmissionDataFreshness({
      currentAdmissionYear: CURRENT_ADMISSION_YEAR,
      methods: [
        {
          id: 'old-method',
          schoolId: 'demo',
          name: 'Old method',
          year: CURRENT_ADMISSION_YEAR - 1,
          capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: false, exactCalculator: true },
        },
      ],
    });

    expect(issues.some((issue) => issue.id === 'method-freshness:old-method')).toBe(true);
    expect(issues).toContainEqual(expect.objectContaining({ code: 'METHOD_YEAR_MISMATCH' }));
  });

  it('keeps known official-but-unparsed gaps as warnings unless a method claims exact', () => {
    const partialIssues = auditAdmissionDataFreshness({
      currentAdmissionYear: CURRENT_ADMISSION_YEAR,
      knowledgeGaps: [{ id: 'appendix-2', label: 'Official appendix is known but unparsed', status: 'official-but-unparsed', schoolId: 'uel' }],
    });
    expect(partialIssues).toContainEqual(expect.objectContaining({ code: 'UNPARSED_OFFICIAL_RULE', severity: 'warning' }));

    const exactIssues = auditAdmissionDataFreshness({
      currentAdmissionYear: CURRENT_ADMISSION_YEAR,
      methods: [
        {
          id: 'unsafe-exact',
          schoolId: 'uel',
          name: 'Unsafe exact',
          year: CURRENT_ADMISSION_YEAR,
          capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: false, exactCalculator: true },
          knowledgeGaps: [{ id: 'appendix-2', label: 'Official appendix is known but unparsed', status: 'official-but-unparsed' }],
        },
      ],
    });
    expect(exactIssues).toContainEqual(expect.objectContaining({ code: 'EXACT_METHOD_HAS_UNRESOLVED_GAPS', severity: 'error' }));
  });
});
