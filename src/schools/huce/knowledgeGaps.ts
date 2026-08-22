import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const huceKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'huce-subject-combinations-not-runtime-mapped',
    label: 'HUCE 2026 subject-combination scope is not yet mapped per program in runtime.',
    status: 'incomplete',
    impact: 'The evaluator can check published thresholds for a supplied program and combination, but cannot validate that the selected combination is allowed for that program.',
    sourceId: 'huce-admission-info-2026',
  },
  {
    id: 'huce-bonus-priority-not-modeled',
    label: 'HUCE bonus and priority adjustments are documented but not fully modeled in runtime.',
    status: 'incomplete',
    impact: 'Eligibility checks compare raw available scores to published intake thresholds without computing school-specific bonus or priority adjustments.',
    sourceId: 'huce-threshold-conversion-2026',
  },
];
