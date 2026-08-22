import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const vnuaKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'vnua-ministry-governed-group-thresholds',
    label:
      'VNUA HVN13 and HVN19 use Ministry of Education and Training threshold rules that are not modeled yet.',
    status: 'incomplete',
    impact:
      'The runtime can evaluate numeric VNUA groups, but it cannot conclude eligibility for the ministry-governed Law and Technology Pedagogy groups.',
    sourceId: 'vnua-threshold-notice-2026',
  },
  {
    id: 'vnua-program-catalog-image-unparsed',
    label: 'VNUA 2026 program/group catalog images have only been partially normalized into runtime group thresholds.',
    status: 'incomplete',
    impact: 'Program-level scope and UI selection metadata still need structured import before exact per-program UX can be offered.',
    sourceId: 'vnua-admission-notice-2026',
  },
  {
    id: 'vnua-bonus-priority-not-modeled',
    label: 'VNUA bonus/priority rules are documented but not yet implemented in the runtime evaluator.',
    status: 'incomplete',
    impact: 'The evaluator does not calculate final admission score or bonus-adjusted thresholds.',
    sourceId: 'vnua-admission-notice-2026',
  },
];

