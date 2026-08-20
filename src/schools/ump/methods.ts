import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';

/**
 * UMP 2026 — CHỈ 1 phương thức có công thức điểm: "Xét kết quả thi tốt nghiệp THPT 2026" (Thông
 * báo 2415/TB-ĐHYD mục 1 — trường còn xét tuyển thẳng/dự bị đại học theo quy chế Bộ GDĐT, không có
 * công thức điểm riêng, không đưa vào đây, cùng quy ước UFM/HUFLIT/HUTECH).
 *
 * `exactCalculator: true` KHÔNG điều kiện (khác USSH/IU/TDTU/HUFLIT/HUTECH/UFM — các trường đó
 * chỉ exact khi KHÔNG có thành tích cộng điểm) vì UMP tự công bố đầy đủ công thức điểm khuyến
 * khích (chứng chỉ ngoại ngữ/SAT, xem `evidence.ts:umpBonusEvidence`), không có gap score-affecting
 * nào còn treo. 2 gap còn lại (`ump-gender-restriction-not-modeled`,
 * `ump-cutoffs-2026-not-imported`) đều `scoreAffecting: false` — không chặn exact.
 */
export const umpAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ump-thpt-2026',
    schoolId: 'ump',
    name: 'Xét kết quả thi tốt nghiệp THPT 2026',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: true, priority: true, exactCalculator: true },
  },
];
