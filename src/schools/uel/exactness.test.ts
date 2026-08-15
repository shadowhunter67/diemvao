import { describe, expect, it } from 'vitest';
import { canUnlockUelExactCalculator, getUelExactBlockingRules, uelExactRuleChecklist } from './exactness';
import { uelKnowledgeGaps } from './knowledgeGaps';
import { uelAdmissionMethods } from './methods';
import { uelSourceRegistry } from '../sourceRegistry';

describe('UEL exactness gate', () => {
  it('unlocks UEL exact after the public HTML certificate table is parsed', () => {
    expect(canUnlockUelExactCalculator()).toBe(true);
    expect(uelAdmissionMethods[0].capabilities.exactCalculator).toBe(true);
    expect(getUelExactBlockingRules()).toEqual([]);
    expect(uelKnowledgeGaps).toEqual([]);
  });

  it('keeps a reconstructable rule checklist for the exact calculator decision', () => {
    expect(uelExactRuleChecklist).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rule: 'V-ACT conversion', known: true, evidence: true, implemented: true }),
        expect.objectContaining({ rule: 'Foreign-language certificate bonus table', known: true, evidence: true, implemented: true }),
        expect.objectContaining({ rule: 'Priority reduction', known: true, evidence: true, implemented: true }),
      ])
    );
  });

  it('resolves every checklist source id through the canonical UEL source registry', () => {
    const registryIds = new Set(uelSourceRegistry.map((source) => source.id));
    expect(uelExactRuleChecklist.filter((item) => item.sourceId).every((item) => registryIds.has(item.sourceId ?? ''))).toBe(true);
  });
});
