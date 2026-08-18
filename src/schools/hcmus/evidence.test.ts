import { describe, expect, it } from 'vitest';
import { hcmusPriorityEvidence } from './evidence';

/**
 * Regression guard (batch 2026-08-18 HCMUS priority re-research): sau khi bounded re-audit 4 trang
 * tuyensinh.hcmus.edu.vn không tìm được nguồn trực tiếp công bố bảng KV/UT, verification PHẢI giữ
 * nguyên `cross-checked` — chặn ai đó âm thầm nâng lên `verified` mà không kèm source thật mới.
 */
describe('hcmusPriorityEvidence stays cross-checked until a direct HCMUS source is found', () => {
  it('is not silently upgraded to verified without a new direct source', () => {
    expect(hcmusPriorityEvidence.evidence[0].verification).toBe('cross-checked');
    expect(hcmusPriorityEvidence.evidence[0].sourceId).toBe('hcmus-academic-score-formula-2026');
  });
});
