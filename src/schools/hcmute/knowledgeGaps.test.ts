import { describe, expect, it } from 'vitest';
import { hcmuteKnowledgeGaps } from './knowledgeGaps';
import { hcmuteSources } from './sources';

/**
 * Regression cho lớp bug "stale knowledge gap": source mới supersede statement "sẽ công bố sau"
 * của source cũ, nhưng gap cũ vẫn còn trong registry như thể chưa resolve. HCMUTE batch 1
 * (2026-08-18) từng ghi gap `hcmute-correlation-coefficients-ab` dựa trên văn bản 01/6/2026 tự nói
 * "sẽ công bố sau khi có kết quả thi THPT Quốc gia năm 2026". Batch 2 (cùng ngày, re-audit) tìm
 * được Thông báo 2092/TB-ĐHCNKT (07/7/2026) công bố chính thức a=0,8/b=0,8, supersede statement đó
 * — gap phải biến mất khỏi `hcmuteKnowledgeGaps`, KHÔNG được giữ lại dưới dạng "resolved: true".
 */
describe('HCMUTE knowledge gap — correlation coefficients a/b resolved', () => {
  it('does not list hcmute-correlation-coefficients-ab as an unresolved gap anymore', () => {
    expect(hcmuteKnowledgeGaps.some((gap) => gap.id === 'hcmute-correlation-coefficients-ab')).toBe(false);
  });

  it('registers the resolving source (Thông báo 2092/TB-ĐHCNKT, 07/7/2026) with current lifecycle', () => {
    const source = hcmuteSources.find((s) => s.id === 'hcmute-correlation-coefficients-2026');
    expect(source).toBeDefined();
    expect(source?.publishedAt).toBe('2026-07-07');
    expect(source?.verification).toBe('verified');
    expect(source?.lifecycle?.status).toBe('current');
  });

  it('keeps hly2-blocking dxtt gap distinct from the resolved coefficient gap (only ĐXTT remains)', () => {
    const dxttGap = hcmuteKnowledgeGaps.find((gap) => gap.id === 'hcmute-school-group-bonus-dxtt');
    expect(dxttGap).toBeDefined();
    expect(dxttGap?.impact).toBe('hly2-transcript-route-blocking');
  });
});
