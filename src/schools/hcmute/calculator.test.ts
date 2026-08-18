import { describe, expect, it } from 'vitest';
import {
  calculateHcmuteAcademicScoreThptOnly,
  calculateHcmuteHly1English,
  calculateHcmuteHly1Design,
  calculateHcmuteHly2Standard,
  calculateHcmuteHly2English,
  calculateHcmuteHly2Design,
  calculateHcmuteHly3Standard,
  calculateHcmuteHly3English,
  calculateHcmuteHly3Design,
  calculateHcmuteHlyMax,
} from './calculator';

/**
 * Conformance test — Tier A worked example, Phụ lục 4 văn bản 1691/ĐHCNKT-ĐT (`sources.ts:hcmute-worked-example-2026`):
 * thí sinh Nguyễn Văn A, tổ hợp A01 (Toán 8.5 [môn chính], Vật lý 8.0, Tiếng Anh quy đổi IELTS 6.5 = 9.7)
 * → HLy.1 = 26,025, khớp chính xác bảng kết quả in trong văn bản.
 */
describe('calculateHcmuteAcademicScoreThptOnly — Tier A worked example (Phụ lục 4, tổ hợp A01)', () => {
  it('matches the official worked example exactly', () => {
    expect(calculateHcmuteAcademicScoreThptOnly({ mainSubjectScore: 8.5, subject2Score: 8.0, subject3Score: 9.7 })).toBe(26.025);
  });

  it('matches the official worked example for tổ hợp D01 (Toán main, Ngữ văn, Tiếng Anh)', () => {
    expect(calculateHcmuteAcademicScoreThptOnly({ mainSubjectScore: 8.5, subject2Score: 7.0, subject3Score: 9.7 })).toBe(25.275);
  });
});

/**
 * Golden tests — hệ số tương quan a=0,8/b=0,8, Thông báo 2092/TB-ĐHCNKT (07/7/2026, sourceId
 * `hcmute-correlation-coefficients-2026`). Expected values derive ĐỘC LẬP bằng tay từ công thức
 * công bố (không generate bằng chính hàm production đang test) — tổ hợp A01 dùng lại số đã verified
 * ở trên (HLy.1=26,025) làm base cho HLy.2/HLy.3.
 */
describe('calculateHcmuteHly2Standard — a=0.8 (Thông báo 2092/TB-ĐHCNKT)', () => {
  it('HLy.2 = 0.8×HLy.1raw + 0.2×[học bạ raw] + ĐXTT (tổ hợp A01)', () => {
    // thptComponent = 0.8×26.025 = 20.82; transcriptComponent = 0.2×[((9.0×2+8.5+9.0)/4)×3] = 0.2×26.625 = 5.325
    const result = calculateHcmuteHly2Standard({
      thpt: { mainSubjectScore: 8.5, subject2Score: 8.0, subject3Score: 9.7 },
      transcript: { mainSubjectScore: 9.0, subject2Score: 8.5, subject3Score: 9.0 },
      dxtt30: 0,
    });
    expect(result).toBe(26.145);
  });
});

describe('calculateHcmuteHly3Standard — b=0.8 (Thông báo 2092/TB-ĐHCNKT)', () => {
  it('HLy.3 = 0.8×HLy.1raw + 0.2×(ĐG/40) (tổ hợp A01, ĐG=1000)', () => {
    // thptComponent = 0.8×26.025 = 20.82; dgnlComponent = 0.2×(1000/40) = 5
    const result = calculateHcmuteHly3Standard({ thpt: { mainSubjectScore: 8.5, subject2Score: 8.0, subject3Score: 9.7 }, dgnlRawScore: 1000 });
    expect(result).toBe(25.82);
  });
});

describe('calculateHcmuteHlyMax — chọn đúng nhánh cao nhất', () => {
  const thpt = { mainSubjectScore: 8, subject2Score: 7, subject3Score: 7 }; // HLy.1 raw = 22.5

  it('HLy.1 thắng khi học bạ và ĐGNL đều thấp', () => {
    const hly1 = calculateHcmuteAcademicScoreThptOnly(thpt);
    const hly2 = calculateHcmuteHly2Standard({ thpt, transcript: { mainSubjectScore: 5, subject2Score: 5, subject3Score: 5 }, dxtt30: 0 });
    const hly3 = calculateHcmuteHly3Standard({ thpt, dgnlRawScore: 0 });
    expect([hly1, hly2, hly3]).toEqual([22.5, 21, 18]);
    expect(calculateHcmuteHlyMax({ hly1, hly2, hly3 })).toEqual({ value: 22.5, winner: 'HLy.1' });
  });

  it('HLy.2 thắng khi học bạ cao và có ĐXTT', () => {
    const hly1 = calculateHcmuteAcademicScoreThptOnly(thpt);
    const hly2 = calculateHcmuteHly2Standard({ thpt, transcript: { mainSubjectScore: 10, subject2Score: 10, subject3Score: 10 }, dxtt30: 1 });
    const hly3 = calculateHcmuteHly3Standard({ thpt, dgnlRawScore: 20 });
    expect([hly1, hly2, hly3]).toEqual([22.5, 25, 18.1]);
    expect(calculateHcmuteHlyMax({ hly1, hly2, hly3 })).toEqual({ value: 25, winner: 'HLy.2' });
  });

  it('HLy.3 thắng khi ĐGNL cao', () => {
    const hly1 = calculateHcmuteAcademicScoreThptOnly(thpt);
    const hly2 = calculateHcmuteHly2Standard({ thpt, transcript: { mainSubjectScore: 5, subject2Score: 5, subject3Score: 5 }, dxtt30: 0 });
    const hly3 = calculateHcmuteHly3Standard({ thpt, dgnlRawScore: 1000 });
    expect([hly1, hly2, hly3]).toEqual([22.5, 21, 23]);
    expect(calculateHcmuteHlyMax({ hly1, hly2, hly3 })).toEqual({ value: 23, winner: 'HLy.3' });
  });

  it('bỏ qua nhánh không truyền (undefined) thay vì coi như 0', () => {
    const hly1 = calculateHcmuteAcademicScoreThptOnly(thpt);
    expect(calculateHcmuteHlyMax({ hly1 })).toEqual({ value: 22.5, winner: 'HLy.1' });
  });
});

describe('English formula group (Ngôn ngữ Anh/SP tiếng Anh) — cộng trực tiếp, không nhân hệ số môn chính', () => {
  it('HLy.1 = tổng 3 môn (không chia 4 nhân 3)', () => {
    expect(calculateHcmuteHly1English({ subject1Score: 8, subject2Score: 8, subject3Score: 8 })).toBe(24);
  });

  it('HLy.2 = 0.8×tổng THPT + 0.2×tổng học bạ + ĐXTT', () => {
    // thptComponent = 0.8×24 = 19.2; transcriptComponent = 0.2×27 = 5.4
    const result = calculateHcmuteHly2English({
      thpt: { subject1Score: 8, subject2Score: 8, subject3Score: 8 },
      transcript: { subject1Score: 9, subject2Score: 9, subject3Score: 9 },
      dxtt30: 0.5,
    });
    expect(result).toBe(25.1);
  });

  it('HLy.3 = 0.8×tổng THPT + 0.2×(ĐG/40)', () => {
    const result = calculateHcmuteHly3English({ thpt: { subject1Score: 8, subject2Score: 8, subject3Score: 8 }, dgnlRawScore: 1000 });
    expect(result).toBe(24.2);
  });
});

describe('Design/architecture formula group (Kiến trúc/Kiến trúc Nội thất/Thiết kế đồ họa/Thiết kế thời trang) — 2 môn + M_NK, ĐGNL chia 60', () => {
  it('HLy.1 = tổng 2 môn + điểm năng khiếu', () => {
    expect(calculateHcmuteHly1Design({ subject1Score: 8, subject2Score: 8, aptitudeScore: 7 })).toBe(23);
  });

  it('HLy.2 = 0.8×tổng THPT(2 môn) + 0.2×tổng học bạ(2 môn) + ĐXTT + M_NK', () => {
    // thptComponent = 0.8×16 = 12.8; transcriptComponent = 0.2×18 = 3.6
    const result = calculateHcmuteHly2Design({
      thpt: { subject1Score: 8, subject2Score: 8 },
      transcript: { subject1Score: 9, subject2Score: 9 },
      dxtt30: 0.5,
      aptitudeScore: 7,
    });
    expect(result).toBe(23.9);
  });

  it('HLy.3 = 0.8×tổng THPT(2 môn) + 0.2×(ĐG/60) + M_NK', () => {
    const result = calculateHcmuteHly3Design({ thpt: { subject1Score: 8, subject2Score: 8 }, dgnlRawScore: 1200, aptitudeScore: 7 });
    expect(result).toBe(23.8);
  });
});
