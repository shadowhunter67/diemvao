import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const vnuaKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'vnua-program-group-threshold-image-unparsed',
    label:
      'VNUA group-specific 2026 threshold table is image-rendered and has not been reviewed into structured program/group data.',
    status: 'incomplete',
    impact:
      'The module can reject profiles below the common 15/30 THPT baseline, but it cannot conclude eligible above that baseline.',
    sourceId: 'vnua-threshold-notice-2026',
  },
  {
    id: 'vnua-program-catalog-image-unparsed',
    label: 'VNUA 2026 program/group catalog in the admission notice is image-rendered and has not been imported.',
    status: 'incomplete',
    impact: 'Program-method scope and exact per-group thresholds are unavailable in runtime.',
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

