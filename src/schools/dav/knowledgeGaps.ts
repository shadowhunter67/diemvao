import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const davKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'dav-bonus-not-runtime-input',
    label: 'DAV school bonus table is normalized, but applicant achievement inputs are not represented in the shared profile yet.',
    status: 'incomplete',
    sourceId: 'dav-admission-info-pdf-2026',
  },
  {
    id: 'dav-national-priority-not-modeled',
    label: 'DAV references national priority and the reduced-priority formula; UniScoreVN does not calculate the national priority value for DAV yet.',
    status: 'incomplete',
    sourceId: 'dav-admission-info-pdf-2026',
  },
  {
    id: 'dav-final-cutoff-equivalence-not-applicant-score',
    label: 'DAV published cross-method equivalence bands for admitted cutoffs, not a direct applicant-score conversion step.',
    status: 'incomplete',
    sourceId: 'dav-threshold-conversion-pdf-2026',
  },
];
