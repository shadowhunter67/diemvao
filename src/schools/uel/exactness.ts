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
    implemented: false,
  },
  {
    rule: '2026 method weights and applicant-track formulas',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: false,
  },
  {
    rule: 'Foreign-language certificate bonus table',
    known: false,
    evidence: false,
    sourceId: 'uel-admission-pdf-2026-unparsed',
    scoreAffecting: true,
    implemented: false,
  },
  {
    rule: 'Priority-school bonus',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: false,
  },
  {
    rule: 'Bonus cap',
    known: true,
    evidence: true,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: false,
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
    known: false,
    evidence: false,
    sourceId: 'uel-formula-2026',
    scoreAffecting: true,
    implemented: false,
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
