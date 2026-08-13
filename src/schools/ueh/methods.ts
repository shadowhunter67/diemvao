import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/** UEH 2026 — Phương thức Xét tuyển tích hợp: có eligibility (ngưỡng đầu vào) + scoreConversion
 * (bảng ĐGNL→THPT verified) nhưng CHƯA có bonus/priority/exactCalculator (thiếu bảng điểm cộng
 * + bước quy đổi cuối sang thang 100) — khớp `uehModule.capabilities`. */
export const uehAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ueh-integrated-2026',
    name: 'Xét tuyển tích hợp',
    year: 2026,
    capabilities: {
      eligibility: true,
      scoreConversion: true,
      bonus: false,
      priority: false,
      exactCalculator: false,
    },
  },
];
