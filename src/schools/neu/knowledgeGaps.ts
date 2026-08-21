import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const neuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'neu-detailed-equivalence-tool-not-modeled',
    label:
      'NEU Notice 1613 publishes equivalent score bands and points candidates to the AI tool for detailed conversion; UniscoreVN has not modeled a deterministic within-band conversion function.',
    status: 'incomplete',
    impact: 'The module reports the official equivalence band only, not a single exact converted final score.',
    sourceId: '',
  },
  {
    id: 'neu-program-catalog-not-imported',
    label: 'NEU full 2026 program catalog/admission-code dataset has not been imported.',
    status: 'incomplete',
    impact: 'The module checks general threshold/equivalence but does not provide program-level context or cutoffs.',
    sourceId: '',
  },
  {
    id: 'neu-cutoffs-2026-not-imported',
    label: 'NEU 2026 final admitted cutoffs have not been imported.',
    status: 'incomplete',
    impact: 'NEU does not have cutoff comparison in /compare yet.',
    sourceId: '',
  },
];


