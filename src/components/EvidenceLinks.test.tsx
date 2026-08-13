import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EvidenceLinks } from './EvidenceLinks';
import type { RuleEvidence } from '../core/evidence';

function renderEvidence(evidence: RuleEvidence[]): string {
  return renderToStaticMarkup(<EvidenceLinks evidence={evidence} />);
}

describe('EvidenceLinks provenance metadata', () => {
  it('renders source type, publishedAt, lastReviewedAt, and safe external link when metadata exists', () => {
    const html = renderEvidence([
      {
        sourceId: 'official-notice',
        sourceTitle: 'Official notice',
        sourceUrl: 'https://example.edu/notice',
        sourceType: 'official-school',
        verification: 'verified',
        effectiveYear: 2026,
        publishedAt: '2026-08-13',
        lastReviewedAt: '2026-08-14',
        lifecycle: { effectiveYear: 2026, status: 'current' },
      },
    ]);

    expect(html).toContain('Nguồn chính thức của trường');
    expect(html).toContain('Công bố: 13/08/2026');
    expect(html).toContain('UniScoreVN kiểm tra lần cuối: 14/08/2026');
    expect(html).toContain('Đang áp dụng');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('omits missing metadata rows instead of rendering empty placeholders', () => {
    const html = renderEvidence([{ sourceId: 'minimal', verification: 'verified', effectiveYear: 2026 }]);
    expect(html).not.toContain('Công bố:');
    expect(html).not.toContain('UniScoreVN kiểm tra lần cuối:');
  });

  it('explains superseded evidence without exposing enum strings', () => {
    const html = renderEvidence([
      {
        sourceId: 'old-rule',
        verification: 'verified',
        effectiveYear: 2026,
        lifecycle: { effectiveYear: 2026, status: 'superseded', supersededBy: 'new-rule' },
      },
    ]);

    expect(html).toContain('Đã được thay thế');
    expect(html).toContain('Nguồn này đã được thay thế và không còn được dùng cho kết quả hiện tại.');
    expect(html).not.toContain('superseded');
  });

  it('uses historical wording without calling historical evidence stale', () => {
    const html = renderEvidence([
      {
        sourceId: 'historical-rule',
        verification: 'verified',
        effectiveYear: 2025,
        lifecycle: { effectiveYear: 2025, status: 'historical' },
      },
    ]);

    expect(html).toContain('Dữ liệu lịch sử');
    expect(html).not.toContain('lỗi thời');
  });
});
