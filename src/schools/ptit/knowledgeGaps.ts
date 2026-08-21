import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const ptitKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'ptit-equivalent-conversion-not-modeled',
    label:
      'PTIT states scores are before equivalent conversion under Ministry rules; UniscoreVN has not found a PTIT-published deterministic conversion table for final cross-method score.',
    status: 'incomplete',
    impact: 'The module checks eligibility and raw formula shape, but does not return an exact final admission score.',
    sourceId: '',
  },
  {
    id: 'ptit-program-catalog-not-imported',
    label: 'PTIT full 2026 program catalog and program group mapping have not been imported.',
    status: 'incomplete',
    impact: 'The compare adapter only checks the generic V-ACT threshold, not program-specific subject/group details.',
    sourceId: '',
  },
  {
    id: 'ptit-cutoffs-2026-not-imported',
    label: 'PTIT 2026 admitted cutoffs have not been imported.',
    status: 'incomplete',
    impact: 'PTIT does not have cutoff comparison in /compare yet.',
    sourceId: '',
  },
];


