import { describe, expect, it } from 'vitest';
import { checkAguDgnlThreshold, checkAguLawExtraCondition, checkAguThptThreshold, findAguProgramThreshold } from './eligibility';

describe('findAguProgramThreshold', () => {
  it('tìm đúng ngành theo mã ngành', () => {
    expect(findAguProgramThreshold('7480201')?.name).toBe('Công nghệ thông tin');
  });

  it('mã ngành không tồn tại trả về undefined', () => {
    expect(findAguProgramThreshold('9999999')).toBeUndefined();
  });
});

describe('checkAguThptThreshold', () => {
  it('ngành thang THPT 15: 15 pass, 14.99 fail', () => {
    expect(checkAguThptThreshold(15, '7480201').pass).toBe(true);
    expect(checkAguThptThreshold(14.99, '7480201').pass).toBe(false);
  });

  it('ngành sư phạm thang THPT 20: 20 pass, 19.99 fail', () => {
    expect(checkAguThptThreshold(20, '7140209').pass).toBe(true);
    expect(checkAguThptThreshold(19.99, '7140209').pass).toBe(false);
  });

  it('mã ngành không tồn tại -> fail với thông báo rõ ràng', () => {
    const result = checkAguThptThreshold(25, '9999999');
    expect(result.pass).toBe(false);
    expect(result.requiredText).toMatch(/Không tìm thấy ngành/);
  });
});

describe('checkAguDgnlThreshold', () => {
  it('ngành thường: 500 pass, 499.9 fail', () => {
    expect(checkAguDgnlThreshold(500, '7480201').pass).toBe(true);
    expect(checkAguDgnlThreshold(499.9, '7480201').pass).toBe(false);
  });

  it('Luật: thông báo không quy định ngưỡng ĐGNL -> luôn fail dù điểm cao', () => {
    const result = checkAguDgnlThreshold(1200, '7380101');
    expect(result.pass).toBe(false);
    expect(result.requiredText).toMatch(/không quy định ngưỡng ĐGNL/);
  });
});

describe('checkAguLawExtraCondition', () => {
  it('đạt cả 2 điều kiện: tổng 60 và Toán/Văn 60% -> pass', () => {
    expect(checkAguLawExtraCondition(60, 60).pass).toBe(true);
  });

  it('tổng điểm thiếu 0.1 -> fail dù đạt điều kiện môn', () => {
    expect(checkAguLawExtraCondition(59.9, 70).pass).toBe(false);
  });

  it('điểm Toán/Văn thiếu -> fail dù tổng điểm cao', () => {
    expect(checkAguLawExtraCondition(90, 59.9).pass).toBe(false);
  });
});
