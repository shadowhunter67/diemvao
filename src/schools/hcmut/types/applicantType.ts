/**
 * Nhóm thí sinh trong phương thức Xét tuyển Tổng hợp HCMUT 2026 (8 "đối tượng" 2.1-2.8 theo
 * Đề án tuyển sinh HCMUT 2026, gộp thành 5 nhóm UI theo cách người dùng tự nhận biết mình).
 * Chỉ 'dgnl' và 'no-dgnl' có công thức đã xác minh đủ rõ để tính điểm — xem
 * docs/admission-research-2026.md. 3 nhóm còn lại hiển thị thông báo "chưa hỗ trợ", không suy
 * đoán công thức.
 */
export type HcmutApplicantType =
  | 'dgnl'
  | 'no-dgnl'
  | 'international-certificate'
  | 'foreign-high-school'
  | 'special-program';

export const HCMUT_APPLICANT_TYPES: readonly HcmutApplicantType[] = [
  'dgnl',
  'no-dgnl',
  'international-certificate',
  'foreign-high-school',
  'special-program',
];

export const DEFAULT_APPLICANT_TYPE: HcmutApplicantType = 'dgnl';

/** Nhóm có công thức đã verify (xem calculator.ts) — được phép tính điểm thật. */
export const SUPPORTED_APPLICANT_TYPES: readonly HcmutApplicantType[] = ['dgnl', 'no-dgnl'];

export interface ApplicantTypeInfo {
  label: string;
  description: string;
}

export const APPLICANT_TYPE_INFO: Record<HcmutApplicantType, ApplicantTypeInfo> = {
  dgnl: {
    label: 'Có kết quả ĐGNL ĐHQG-HCM 2026',
    description: 'Điểm năng lực tính từ 4 phần thi ĐGNL (Đối tượng 2.1).',
  },
  'no-dgnl': {
    label: 'Không dự thi ĐGNL',
    description: 'Điểm năng lực quy đổi từ điểm thi THPT × 0,75 (Đối tượng 2.2).',
  },
  'international-certificate': {
    label: 'Có chứng chỉ tuyển sinh quốc tế (SAT / ACT / IB / A-Level)',
    description: 'Đối tượng 2.4 — UniscoreVN đang bổ sung dữ liệu chính thức.',
  },
  'foreign-high-school': {
    label: 'Tốt nghiệp THPT nước ngoài',
    description: 'Đối tượng 2.3 — UniscoreVN đang bổ sung dữ liệu chính thức.',
  },
  'special-program': {
    label: 'Chương trình đặc thù / chuyển tiếp quốc tế',
    description: 'Đối tượng 2.5-2.8 (TNE, chuyển tiếp quốc tế...) — dùng công thức riêng, UniscoreVN đang bổ sung dữ liệu chính thức.',
  },
};
