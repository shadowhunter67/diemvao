import { describe, expect, it } from 'vitest';
import type { RuleEvidence } from './evidence';
import { enrichRuleEvidenceFromRegistry, isValidDateOnly, resolveRuleEvidenceSources, type AdmissionSource } from './sourceRegistry';

const source: AdmissionSource = {
  id: 'official-source',
  schoolId: 'demo',
  publisher: 'Demo University',
  title: 'Official rule',
  url: 'https://example.edu/rule',
  accessedAt: '2026-08-13',
  publishedAt: '2026-08-01',
  sourceType: 'official-school',
};

describe('source registry resolver', () => {
  it('resolves rule evidence sourceId to canonical source metadata', () => {
    const evidence: RuleEvidence = { sourceId: 'official-source', verification: 'verified', effectiveYear: 2026 };
    const [resolved] = resolveRuleEvidenceSources([evidence], [source]);
    expect(resolved.source).toEqual(source);
    expect(enrichRuleEvidenceFromRegistry(evidence, resolved.source)).toMatchObject({
      sourceId: 'official-source',
      sourceTitle: 'Official rule',
      sourceUrl: 'https://example.edu/rule',
      publishedAt: '2026-08-01',
      sourceType: 'official-school',
    });
  });

  it('returns missingSourceId for orphan evidence without mutating input', () => {
    const evidence: RuleEvidence = { sourceId: 'missing-source', verification: 'verified', effectiveYear: 2026 };
    const [resolved] = resolveRuleEvidenceSources([evidence], [source]);
    expect(resolved).toMatchObject({ evidence, missingSourceId: 'missing-source' });
    expect(evidence).toEqual({ sourceId: 'missing-source', verification: 'verified', effectiveYear: 2026 });
  });

  it('validates date-only metadata structurally and calendar-correctly', () => {
    expect(isValidDateOnly('2026-08-13')).toBe(true);
    expect(isValidDateOnly('2026-02-29')).toBe(false);
    expect(isValidDateOnly('2026-8-13')).toBe(false);
  });
});
