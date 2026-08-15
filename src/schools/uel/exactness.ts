import type { KnowledgeGap } from '../../core/knowledgeStatus';
import { uelKnowledgeGaps } from './knowledgeGaps';

export interface UelExactRuleChecklistItem {
  rule: string;
  known: boolean;
  evidence: boolean;
  sourceId?: string;
  scoreAffecting: boolean;
  implemented: boolean;
}

export const uelExactRuleChecklist: UelExactRuleChecklistItem[] = [
  {
    rule: 'V-ACT conversion',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: 'THPT conversion',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: 'Transcript conversion',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: '2026 method weights and applicant-track formulas',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: 'Foreign-language certificate bonus table',
    known: true,
    evidence: true,
    sourceId: 'uel-certificate-bonus-html-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: 'Priority-school bonus',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: 'Bonus cap',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: 'Priority table',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: 'Priority reduction',
    known: true,
    evidence: true,
    sourceId: 'uel-priority-reduction-2026',
    scoreAffecting: true,
    implemented: true,
  },
  {
    rule: 'Final rounding',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: true,
  },
];

export function getUelExactBlockingRules(gaps: readonly KnowledgeGap[] = uelKnowledgeGaps): KnowledgeGap[] {
  return gaps.filter((gap) => gap.scoreAffecting !== false && gap.status !== 'verified');
}

export function canUnlockUelExactCalculator(
  checklist: readonly UelExactRuleChecklistItem[] = uelExactRuleChecklist,
  gaps: readonly KnowledgeGap[] = uelKnowledgeGaps
): boolean {
  return checklist.every((item) => !item.scoreAffecting || (item.known && item.evidence && item.implemented)) && getUelExactBlockingRules(gaps).length === 0;
}

export const uelExactCalculatorAvailable = canUnlockUelExactCalculator();
