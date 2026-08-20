import { describe, expect, it } from 'vitest';
import {
  convertUfmScoreToThpt30,
  UFM_HOCBA_CONVERSION_TABLE,
  UFM_DGNL_CONVERSION_TABLE,
  UFM_VSAT_CONVERSION_TABLE,
} from './conversionTable';

describe('convertUfmScoreToThpt30 — official worked example (mục 3.4, Thông báo 2639/TB-ĐHTCM)', () => {
  it('V-SAT x=360.00 (khoảng 3) → y=23.98, khớp ví dụ minh họa chính thức của văn bản', () => {
    expect(convertUfmScoreToThpt30(360, UFM_VSAT_CONVERSION_TABLE)).toBe(23.98);
  });
});

describe('convertUfmScoreToThpt30 — hocba (mục 3.1), boundary exactness', () => {
  it('sàn khoảng thấp nhất (18.00, = ngưỡng đầu vào) → y=16.00', () => {
    expect(convertUfmScoreToThpt30(18, UFM_HOCBA_CONVERSION_TABLE)).toBe(16.0);
  });

  it('trần khoảng cao nhất (30.00) → y=30.00', () => {
    expect(convertUfmScoreToThpt30(30, UFM_HOCBA_CONVERSION_TABLE)).toBe(30.0);
  });

  it('dưới sàn (17.99) → undefined (không suy đoán ngoài bảng)', () => {
    expect(convertUfmScoreToThpt30(17.99, UFM_HOCBA_CONVERSION_TABLE)).toBeUndefined();
  });
});

describe('convertUfmScoreToThpt30 — ĐGNL (mục 3.2), boundary + kẹp trần', () => {
  it('sàn khoảng thấp nhất (657, = ngưỡng đầu vào) → y=16.00', () => {
    expect(convertUfmScoreToThpt30(657, UFM_DGNL_CONVERSION_TABLE)).toBe(16.0);
  });

  it('trần bảng công bố (1139) → y=30.00', () => {
    expect(convertUfmScoreToThpt30(1139, UFM_DGNL_CONVERSION_TABLE)).toBe(30.0);
  });

  it('vượt trần bảng công bố (1200, trần lý thuyết ĐGNL) → kẹp về y=30.00, không undefined', () => {
    expect(convertUfmScoreToThpt30(1200, UFM_DGNL_CONVERSION_TABLE)).toBe(30.0);
  });

  it('dưới sàn (656) → undefined', () => {
    expect(convertUfmScoreToThpt30(656, UFM_DGNL_CONVERSION_TABLE)).toBeUndefined();
  });
});

describe('convertUfmScoreToThpt30 — V-SAT (mục 3.3), biên loại trừ giữa các khoảng nội bộ', () => {
  it('đúng biên chia sẻ 409.5: thuộc Khoảng 2 (max, bao gồm), KHÔNG thuộc Khoảng 1 (min, loại trừ)', () => {
    // Khoảng 2 max=409.5 → y = thpt30Max của Khoảng 2 = 27.25
    expect(convertUfmScoreToThpt30(409.5, UFM_VSAT_CONVERSION_TABLE)).toBe(27.25);
  });

  it('sàn tuyệt đối Khoảng 6 (241, = ngưỡng đầu vào) BAO GỒM → y=16.00', () => {
    expect(convertUfmScoreToThpt30(241, UFM_VSAT_CONVERSION_TABLE)).toBe(16.0);
  });

  it('dưới sàn (240) → undefined', () => {
    expect(convertUfmScoreToThpt30(240, UFM_VSAT_CONVERSION_TABLE)).toBeUndefined();
  });

  it('trần bảng (450, = thang điểm tối đa) → y=30.00', () => {
    expect(convertUfmScoreToThpt30(450, UFM_VSAT_CONVERSION_TABLE)).toBe(30.0);
  });
});
