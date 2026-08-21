import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const ftuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'ftu-program-catalog-not-imported',
    label:
      'FTU full program catalog and mapping from program to scale-30/scale-40 formula group have not been imported.',
    status: 'incomplete',
    impact: 'The evaluator accepts the formula group from context and defaults to the scale-30 route instead of inferring it from a selected program.',
    sourceId: '',
  },
  {
    id: 'ftu-international-certificate-combination-not-modeled',
    label:
      'FTU branches combining domestic exams or SAT/ACT/A-Level with international language certificates are not modeled yet.',
    status: 'incomplete',
    impact: 'Only the standalone domestic HSA/V-ACT/TSA route is calculated.',
    sourceId: '',
  },
  {
    id: 'ftu-cutoffs-2026-not-imported',
    label: 'FTU 2026 admitted cutoffs by admission code have not been imported.',
    status: 'incomplete',
    impact: 'FTU does not have cutoff comparison in /compare yet.',
    sourceId: '',
  },
];


