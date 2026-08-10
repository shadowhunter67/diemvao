import { describe, expect, it } from 'vitest';
import {
  checkCertificateQuality,
  checkCertificateRegistration,
  checkDgnlThreshold,
  checkThptThreshold,
} from './eligibility';

describe('checkThptThreshold', () => {
  it('ngành thường: 22 pass, 21.99 fail', () => {
    expect(checkThptThreshold(22, null, 'cong-nghe-thong-tin').pass).toBe(true);
    expect(checkThptThreshold(21.99, null, 'cong-nghe-thong-tin').pass).toBe(false);
  });

  it('Thiết kế vi mạch: cần cả tổng 23 và Toán 7.5', () => {
    expect(checkThptThreshold(23, 7.5, 'thiet-ke-vi-mach').pass).toBe(true);
    expect(checkThptThreshold(23, 7.4, 'thiet-ke-vi-mach').pass).toBe(false);
    expect(checkThptThreshold(22.9, 8, 'thiet-ke-vi-mach').pass).toBe(false);
  });

  it('Thiết kế vi mạch thiếu điểm Toán (null) -> fail dù tổng đủ', () => {
    expect(checkThptThreshold(23, null, 'thiet-ke-vi-mach-ta').pass).toBe(false);
  });
});

describe('checkDgnlThreshold', () => {
  it('ngành thường: 717 pass, 716.9 fail', () => {
    expect(checkDgnlThreshold(717, null, 'khoa-hoc-may-tinh').pass).toBe(true);
    expect(checkDgnlThreshold(716.9, null, 'khoa-hoc-may-tinh').pass).toBe(false);
  });

  it('Thiết kế vi mạch: cần cả tổng 761 và Toán ĐGNL 195', () => {
    expect(checkDgnlThreshold(761, 195, 'thiet-ke-vi-mach').pass).toBe(true);
    expect(checkDgnlThreshold(761, 194, 'thiet-ke-vi-mach').pass).toBe(false);
  });
});

describe('certificate — 2 tầng ngưỡng khác nhau cho cùng 1 input', () => {
  it('SAT 1100 đủ đăng ký minh chứng nhưng KHÔNG đạt ngưỡng chất lượng đầu vào', () => {
    expect(checkCertificateRegistration('sat', 1100).pass).toBe(true);
    expect(checkCertificateQuality('sat', 1100).pass).toBe(false);
  });

  it('SAT 1170 đạt cả hai ngưỡng', () => {
    expect(checkCertificateRegistration('sat', 1170).pass).toBe(true);
    expect(checkCertificateQuality('sat', 1170).pass).toBe(true);
  });

  it('ACT boundary: 21 đăng ký được, 26 mới đạt chất lượng đầu vào', () => {
    expect(checkCertificateRegistration('act', 21).pass).toBe(true);
    expect(checkCertificateQuality('act', 21).pass).toBe(false);
    expect(checkCertificateQuality('act', 26).pass).toBe(true);
  });

  it('A-Level PUM 67% đăng ký được, cần 70% mới đạt chất lượng đầu vào', () => {
    expect(checkCertificateRegistration('a-level', 67).pass).toBe(true);
    expect(checkCertificateQuality('a-level', 67).pass).toBe(false);
    expect(checkCertificateQuality('a-level', 70).pass).toBe(true);
  });

  it('IB 29 đăng ký được, cần 30 mới đạt chất lượng đầu vào', () => {
    expect(checkCertificateRegistration('ib', 29).pass).toBe(true);
    expect(checkCertificateQuality('ib', 29).pass).toBe(false);
    expect(checkCertificateQuality('ib', 30).pass).toBe(true);
  });
});
