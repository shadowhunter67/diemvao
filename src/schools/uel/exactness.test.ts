import { describe, expect, it } from 'vitest';
import { canUnlockUelExactCalculator, getUelExactBlockingRules, uelExactRuleChecklist } from './exactness';
import { uelKnowledgeGaps } from './knowledgeGaps';
import { uelAdmissionMethods } from './methods';
import { uelSourceRegistry } from '../sourceRegistry';

describe('UEL exactness gate', () => {
  it('keeps UEL exact blocked while the official Appendix 2 bonus table is unparsed', () => {
    expect(canUnlockUelExactCalculator()).toBe(false);
    expect(uelAdmissionMethods[0].capabilities.exactCalculator).toBe(false);
    expect(getUelExactBlockingRules()).toContainEqual(
      expect.objectContaining({
        id: 'uel-certificate-bonus-table',
        sourceId: 'uel-admission-pdf-2026-unparsed',
        scoreAffecting: true,
      })
    );
  });

  it('keeps a reconstructable rule checklist for the future exact calculator decision', () => {
    expect(uelExactRuleChecklist).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rule: 'V-ACT conversion', known: true, evidence: true, implemented: true }),
        expect.objectContaining({ rule: 'Foreign-language certificate bonus table', known: false, evidence: false, implemented: false }),
        expect.objectContaining({ rule: 'Priority reduction', known: true, evidence: true, implemented: true }),
      ])
    );
  });

  it('records why the current blocker cannot be inferred from partial examples', () => {
    expect(uelKnowledgeGaps[0]).toMatchObject({
      ruleId: 'foreign-language-bonus-table',
      artifactStatus: 'official-drive-view-only-download-denied',
      impact: 'exact-final-score-blocking',
    });
    expect(uelKnowledgeGaps[0].whyNotInferred).toContain('Không suy');
  });

  it('resolves every checklist source id through the canonical UEL source registry', () => {
    const registryIds = new Set(uelSourceRegistry.map((source) => source.id));
    expect(uelExactRuleChecklist.filter((item) => item.sourceId).every((item) => registryIds.has(item.sourceId ?? ''))).toBe(true);
  });
});
