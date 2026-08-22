import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface VnuaSource {
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

export const vnuaSources: VnuaSource[] = [
  {
    id: 'vnua-admission-notice-2026',
    publisher: 'Vietnam National University of Agriculture',
    title: 'Official 2026 regular undergraduate admission notice',
    url: 'https://vnua.edu.vn/thong-bao/thong-bao-tuyen-sinh-dai-hoc-he-chinh-quy-nam-2026-58444',
    accessedAt: '2026-08-22',
    publishedAt: '2026-03-30',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Official VNUA notice. HTML text exposes THPT and transcript formula shape, IELTS/HSK note, excellence route thresholds, and bonus cap. Program/group table is image-rendered.',
  },
  {
    id: 'vnua-threshold-notice-2026',
    publisher: 'Vietnam National University of Agriculture',
    title: 'Official 2026 application threshold notice',
    url: 'https://vnua.edu.vn/diemxettuyen',
    accessedAt: '2026-08-22',
    publishedAt: '2026-07-03',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
    note:
      'Official VNUA threshold notice. It states the common THPT baseline of total three subjects >= 15/30 and a second group-specific threshold condition shown as an image table.',
  },
];

