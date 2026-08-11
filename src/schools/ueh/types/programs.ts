import type { CutoffStatus, SourceType } from '../../../core/admissionHistory';

export interface UehProgram {
  id: string;
  code: string;
  name: string;
  campus: 'hcmc' | 'mekong';
}

export interface UehCutoff {
  year: number;
  programId: string;
  score: number;
  scoreScale: number;
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
  publishedAt: string;
  accessedAt: string;
  status?: CutoffStatus;
  comparableToPrevious?: boolean;
  sourceType?: SourceType;
  lastReviewedAt?: string;
}
