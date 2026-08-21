import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface FtuSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
  note?: string;
}

export const ftuSources: FtuSource[] = [
  {
    id: 'ftu-admissions-methods-2026',
    publisher: 'Foreign Trade University (FTU)',
    title: 'Admissions methods 2026: domestic aptitude/thinking exam formulas, priority and bonus rules',
    url: 'https://thongtintuyensinh.ftu.edu.vn/admissions-methods',
    accessedAt: '2026-08-21',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Official HTML page re-read 2026-08-21. Sections 4.2.1/4.2.2 publish HSA/V-ACT/TSA formulas; section III publishes bonus cap and priority reduction rules for scales 30 and 40.',
  },
];

