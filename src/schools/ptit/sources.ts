import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface PtitSource {
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

export const ptitSources: PtitSource[] = [
  {
    id: 'ptit-admission-methods-2026',
    publisher: 'Posts and Telecommunications Institute of Technology (PTIT)',
    title: 'Official 2026 undergraduate admission methods notice',
    url: 'https://tuyensinh.ptit.edu.vn/thong-baophuong-thuc-tuyen-sinh-dai-hoc-he-chinh-quy-nam-2026/',
    accessedAt: '2026-08-21',
    publishedAt: '2026-04-03',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Official PTIT admissions page. It publishes method list, domestic exam thresholds, raw-score formula for DGNL/DGTD, THPT formula, and bonus tables.',
  },
];

