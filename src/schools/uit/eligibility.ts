import {
  TKVM_PROGRAM_IDS,
  UIT_CERTIFICATE_QUALITY_THRESHOLD,
  UIT_CERTIFICATE_REGISTRATION_THRESHOLD,
  UIT_DGNL_THRESHOLD,
  UIT_THPT_THRESHOLD,
} from './data/thresholds';

export interface EligibilityResult {
  pass: boolean;
  /** Mô tả ngưỡng đã áp dụng, để UI trích dẫn thay vì tự diễn giải. */
  requiredText: string;
}

export type CertificateType = 'sat' | 'act' | 'a-level' | 'ib';

function isTkvm(programId: string | null): boolean {
  return programId !== null && TKVM_PROGRAM_IDS.includes(programId);
}

/** THPT: mathScore chỉ bắt buộc khi ngành = Thiết kế vi mạch (điều kiện Toán riêng). */
export function checkThptThreshold(totalScore: number, mathScore: number | null, programId: string | null): EligibilityResult {
  if (isTkvm(programId)) {
    const { total, math } = UIT_THPT_THRESHOLD.thietKeViMach;
    return {
      pass: totalScore >= total && (mathScore ?? -Infinity) >= math,
      requiredText: `THPT ≥ ${total} và Toán ≥ ${math} (ngành Thiết kế vi mạch)`,
    };
  }
  return {
    pass: totalScore >= UIT_THPT_THRESHOLD.default,
    requiredText: `THPT ≥ ${UIT_THPT_THRESHOLD.default}`,
  };
}

export function checkDgnlThreshold(totalScore: number, mathScore: number | null, programId: string | null): EligibilityResult {
  if (isTkvm(programId)) {
    const { total, math } = UIT_DGNL_THRESHOLD.thietKeViMach;
    return {
      pass: totalScore >= total && (mathScore ?? -Infinity) >= math,
      requiredText: `ĐGNL ≥ ${total} và Toán ĐGNL ≥ ${math} (ngành Thiết kế vi mạch)`,
    };
  }
  return {
    pass: totalScore >= UIT_DGNL_THRESHOLD.default,
    requiredText: `ĐGNL ≥ ${UIT_DGNL_THRESHOLD.default}`,
  };
}

function checkCertificate(
  type: CertificateType,
  value: number,
  thresholds: typeof UIT_CERTIFICATE_REGISTRATION_THRESHOLD
): EligibilityResult {
  switch (type) {
    case 'sat':
      return { pass: value >= thresholds.sat, requiredText: `SAT ≥ ${thresholds.sat}` };
    case 'act':
      return { pass: value >= thresholds.act, requiredText: `ACT ≥ ${thresholds.act}` };
    case 'a-level':
      return {
        pass: value >= thresholds.aLevelPum,
        requiredText: `A-Level PUM (3 môn cao nhất) ≥ ${thresholds.aLevelPum}%`,
      };
    case 'ib':
      return { pass: value >= thresholds.ib, requiredText: `IB ≥ ${thresholds.ib}` };
  }
}

/** Ngưỡng ĐĂNG KÝ minh chứng — thấp hơn, KHÔNG phải điều kiện được xét tuyển. */
export function checkCertificateRegistration(type: CertificateType, value: number): EligibilityResult {
  return checkCertificate(type, value, UIT_CERTIFICATE_REGISTRATION_THRESHOLD);
}

/** Ngưỡng đảm bảo CHẤT LƯỢNG ĐẦU VÀO — điều kiện thật để được tham gia xét tuyển. */
export function checkCertificateQuality(type: CertificateType, value: number): EligibilityResult {
  return checkCertificate(type, value, UIT_CERTIFICATE_QUALITY_THRESHOLD);
}
