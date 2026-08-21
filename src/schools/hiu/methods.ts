import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hiuKnowledgeGaps } from './knowledgeGaps';

const gapById = (id: string) => hiuKnowledgeGaps.filter((gap) => gap.id === id);

const sharedGaps = [...gapById('hiu-priority-bonus-table-not-found'), ...gapById('hiu-program-catalog-not-imported')];

const thptExamGaps = [...sharedGaps, ...gapById('hiu-health-license-law-threshold-not-found')];
const combinedGaps = [...sharedGaps, ...gapById('hiu-combined-method-formula-not-found')];
const vactGaps = [...sharedGaps];

/**
 * HIU 2026 — 3 phương thức có ngưỡng công bố (`sources.ts:hiu-quality-threshold-2026`):
 * - Thi TN THPT: chỉ nhóm `standard` có ngưỡng cụ thể (15/30, điểm thô); nhóm pháp luật/sức khỏe
 *   cấp phép hành nghề dùng ngưỡng Bộ GD&ĐT quy định, KHÔNG có số trong nguồn này — eligibility
 *   checker trả `unknown` cho nhóm đó.
 * - Kết hợp thi TN THPT + học bạ: có ngưỡng (16/30) nhưng KHÔNG có công thức trọng số — không xây
 *   được evaluator, `eligibility: false` (chỉ còn ở mức thông tin/gap).
 * - ĐGNL ĐHQG-HCM: điểm thô thang 1200, khớp trực tiếp `ApplicantProfile.exams.vact.total` — cả 3
 *   nhóm đều có số cụ thể (650/700/675), method exact-checkable nhất trong 3.
 */
export const hiuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hiu-thpt-exam-2026',
    schoolId: 'hiu',
    name: 'Xét kết quả thi tốt nghiệp THPT năm 2026',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: thptExamGaps,
  },
  {
    id: 'hiu-combined-thpt-transcript-2026',
    schoolId: 'hiu',
    name: 'Kết hợp thi tốt nghiệp THPT + học bạ lớp 12',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: combinedGaps,
  },
  {
    id: 'hiu-vact-2026',
    schoolId: 'hiu',
    name: 'Xét kết quả thi ĐGNL ĐHQG-HCM năm 2026',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026', 'Thí sinh tốt nghiệp THPT năm 2025 trở về trước'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: vactGaps,
  },
];
