import { describe, expect, it } from 'vitest';
import { usshCutoffs } from './cutoffs';
import { usshPrograms } from './programs';

describe('USSH cutoff data 2026', () => {
  it('54 chương trình (21 Chuẩn trang 1 + 21 Chuẩn trang 2 + 4 Liên kết 2+2 + 8 Chuẩn quốc tế) × 3 applicantType = 162 record', () => {
    expect(usshPrograms.length).toBe(54);
    expect(usshCutoffs.length).toBe(162);
  });

  it('mọi programId trong cutoffs đều tồn tại trong programs registry', () => {
    const programIds = new Set(usshPrograms.map((p) => p.id));
    for (const cutoff of usshCutoffs) {
      expect(programIds.has(cutoff.programId)).toBe(true);
    }
  });

  it('mỗi program có đúng 3 record (DT1/DT2/DT3), không trùng/thiếu', () => {
    for (const program of usshPrograms) {
      const records = usshCutoffs.filter((c) => c.programId === program.id);
      expect(records.map((r) => r.applicantTypeId).sort()).toEqual(['DT1', 'DT2', 'DT3']);
    }
  });

  it('mẫu dòng có 3 giá trị ĐT khác nhau — Tâm lý học (7310401): 86.3/87/86.3', () => {
    const records = usshCutoffs.filter((c) => c.programId === 'ussh-7310401');
    expect(records.find((r) => r.applicantTypeId === 'DT1')?.score).toBe(86.3);
    expect(records.find((r) => r.applicantTypeId === 'DT2')?.score).toBe(87);
    expect(records.find((r) => r.applicantTypeId === 'DT3')?.score).toBe(86.3);
  });

  it('mẫu Liên kết 2+2 — Ngôn ngữ Anh (7220201LK): 71.4/71.4/71.4', () => {
    const records = usshCutoffs.filter((c) => c.programId === 'ussh-7220201LK');
    expect(records.every((r) => r.score === 71.4)).toBe(true);
  });

  it('mẫu Chuẩn quốc tế — Nhật Bản học (7310613QT): 72/73/72', () => {
    const records = usshCutoffs.filter((c) => c.programId === 'ussh-7310613QT');
    expect(records.find((r) => r.applicantTypeId === 'DT1')?.score).toBe(72);
    expect(records.find((r) => r.applicantTypeId === 'DT2')?.score).toBe(73);
    expect(records.find((r) => r.applicantTypeId === 'DT3')?.score).toBe(72);
  });

  it('mọi record đều year=2026, scoreScale=100, status=final', () => {
    for (const cutoff of usshCutoffs) {
      expect(cutoff.year).toBe(2026);
      expect(cutoff.scoreScale).toBe(100);
      expect(cutoff.status).toBe('final');
    }
  });
});
