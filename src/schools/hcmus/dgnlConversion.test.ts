import { describe, expect, it } from 'vitest';
import { convertHcmusVactToThpt } from './dgnlConversion';
import { HCMUS_VACT_CONVERSION_TABLE } from './vactConversionTable';

describe('convertHcmusVactToThpt', () => {
  it('khớp đúng các mốc bảng đã verify (Phần M)', () => {
    expect(convertHcmusVactToThpt(1108)?.thptScore).toBe(29.75);
    expect(convertHcmusVactToThpt(995)?.thptScore).toBe(27.25);
    expect(convertHcmusVactToThpt(655)?.thptScore).toBe(20.3);
    expect(convertHcmusVactToThpt(370)?.thptScore).toBe(10.85);
  });

  it('mốc trùng bảng là exactBreakpoint=true', () => {
    const result = convertHcmusVactToThpt(655);
    expect(result?.exactBreakpoint).toBe(true);
    expect(result?.clampedAtCeiling).toBe(false);
  });

  it('nội suy giữa 2 mốc liền kề (50%: 655→20.3, 51%: 651→20.2)', () => {
    // raw=653 nằm giữa X1=655 (A1=20.3) và X2=651 (A2=20.2)
    const result = convertHcmusVactToThpt(653);
    expect(result?.exactBreakpoint).toBe(false);
    // A2 + (A1-A2) × (raw-X2)/(X1-X2) = 20.2 + 0.1 × 2/4 = 20.25
    expect(result?.thptScore).toBeCloseTo(20.25, 5);
  });

  it('biên trên: raw = 1139 (mốc "<1%") → 30, đúng bảng, không clamp', () => {
    const result = convertHcmusVactToThpt(1139);
    expect(result?.thptScore).toBe(30);
    expect(result?.exactBreakpoint).toBe(true);
    expect(result?.clampedAtCeiling).toBe(false);
  });

  it('biên trên: raw > 1139 (vd 1200, max thang ĐGNL) → clamp về 30, có căn cứ trần thang đích', () => {
    const result = convertHcmusVactToThpt(1200);
    expect(result?.thptScore).toBe(30);
    expect(result?.clampedAtCeiling).toBe(true);
  });

  it('biên dưới: raw = 370 (mốc "100%") → 10.85, đúng bảng', () => {
    const result = convertHcmusVactToThpt(370);
    expect(result?.thptScore).toBe(10.85);
    expect(result?.exactBreakpoint).toBe(true);
  });

  it('biên dưới: raw < 370 → unavailable (null), không suy đoán ngoài evidence', () => {
    expect(convertHcmusVactToThpt(369)).toBeNull();
    expect(convertHcmusVactToThpt(0)).toBeNull();
  });

  it('đơn điệu tăng: ĐGNL cao hơn → THPT quy đổi không giảm', () => {
    for (let i = 0; i < HCMUS_VACT_CONVERSION_TABLE.length - 1; i++) {
      const higher = HCMUS_VACT_CONVERSION_TABLE[i];
      const lower = HCMUS_VACT_CONVERSION_TABLE[i + 1];
      expect(higher.thptScore).toBeGreaterThanOrEqual(lower.thptScore);
    }
  });

  it('kết quả luôn trong khoảng [10.85, 30] khi trong phạm vi hỗ trợ', () => {
    for (const raw of [370, 500, 655, 800, 1000, 1139, 1200]) {
      const result = convertHcmusVactToThpt(raw);
      expect(result).not.toBeNull();
      expect(result!.thptScore).toBeGreaterThanOrEqual(10.85);
      expect(result!.thptScore).toBeLessThanOrEqual(30);
    }
  });

  it('bảng có đúng 101 dòng (<1% + 1%..100%)', () => {
    expect(HCMUS_VACT_CONVERSION_TABLE.length).toBe(101);
  });
});
