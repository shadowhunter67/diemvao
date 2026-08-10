import type { AdmissionConfig } from '../types/admission';

/**
 * Phương thức Xét tuyển Tổng hợp HCMUT 2026, thí sinh có kết quả ĐGNL ĐHQG-HCM 2026.
 * Nguồn: thông tin tuyển sinh chính thức HCMUT 2026 (đối chiếu thủ công, không tự suy diễn).
 */
export const admissionConfig2026: AdmissionConfig = {
  year: 2026,

  weights: {
    dgnl: 0.7,
    thpt: 0.2,
    transcript: 0.1,
  },

  dgnl: {
    maxPerComponent: 300,
    mathMultiplier: 2,
    maxWeightedTotal: 1500,
  },

  thpt: {
    maxPerSubject: 10,
    mathMultiplier: 2,
  },

  transcript: {
    maxPerSubject: 10,
    mathMultiplier: 2,
  },

  bonus: {
    maxTotal: 10,
  },

  priority: {
    maxRaw30Scale: 2.75,
    scaleDivisor: 3,
    scaleMultiplier: 10,
    reductionThreshold: 75,
    reductionDivisor: 25,
  },

  scoreScale: 100,
};

export const activeAdmissionConfig = admissionConfig2026;
