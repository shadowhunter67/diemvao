import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface NeuSource {
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

export const neuSources: NeuSource[] = [
  {
    id: 'neu-threshold-equivalence-2026',
    publisher: 'National Economics University (NEU)',
    title: 'Notice 1613/TB-DHKTQD dated 2026-07-03 on admission thresholds and equivalent admitted-score conversion between methods',
    url: 'https://neu.edu.vn/wp-content/uploads/2026/07/Thong-Bao-so-1613-ngay-03.7.2026-Ve-nguong-DBCL-dau-vao-va-quy-doi-tuong-duong-diem-trung-tuyen-giua-cac-phuong-thuc-xet-tuyen-DHCQ-nam-2026.pdf',
    accessedAt: '2026-08-21',
    publishedAt: '2026-07-03',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Official signed PDF linked from neu.edu.vn. Page 1 lists the 22/30 threshold for A00/A01/D01/D07. Page 2 lists equivalent admitted-score bands for THPT, HSA, SAT, V-ACT, and TSA.',
  },
  {
    id: 'neu-admission-info-2026',
    publisher: 'National Economics University (NEU)',
    title: 'Decision publishing regular undergraduate admission information 2026',
    url: 'https://neu.edu.vn/wp-content/uploads/2026/03/Thong-tin-TS-nam-2026-hinh-thuc-dao-tao-DHCQ.pdf',
    accessedAt: '2026-08-21',
    publishedAt: '2026-03-06',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note: 'Official signed admission-information PDF linked from neu.edu.vn, used for lifecycle/source inventory and program-admission context only.',
  },
];

