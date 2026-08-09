import type { AdmissionConfig } from '../types/admission';

export const admissionConfig2026: AdmissionConfig = {
  year: 2026,

  weights: {
    dgnl: 0.7,
    thpt: 0.2,
    transcript: 0.1,
  },

  maxBonus: 10,
  maxPriority: 9.17,
};

export const activeAdmissionConfig = admissionConfig2026;
