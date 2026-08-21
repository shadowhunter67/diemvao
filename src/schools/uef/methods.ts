import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { uefKnowledgeGaps } from './knowledgeGaps';

const gapById = (id: string) => uefKnowledgeGaps.filter((gap) => gap.id === id);

const sharedGaps = [...gapById('uef-priority-bonus-table-not-found'), ...gapById('uef-program-catalog-not-imported'), ...gapById('uef-dgnl-vsat-methods-not-modeled')];

const thptExamGaps = [...sharedGaps];
const transcriptGaps = [...gapById('uef-transcript-methodology-unpublished'), ...sharedGaps];

/**
 * UEF 2026 — 2/4 phương thức có ngưỡng đọc được (thi TN THPT: 15 chuẩn/20 Luật; học bạ: 18 chuẩn,
 * Luật dùng điều kiện rank+điểm thay thế). ĐGNL ĐHQG TP.HCM/V-SAT có ngưỡng công bố nhưng ngoài
 * scope batch này (`uef-dgnl-vsat-methods-not-modeled`). Cả 2 method `eligibility: true` nhưng
 * `scoreConversion`/`bonus`/`priority`/`exactCalculator` đều `false`.
 */
export const uefAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'uef-thpt-exam-2026',
    schoolId: 'uef',
    name: 'Xét kết quả thi tốt nghiệp THPT năm 2026',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: thptExamGaps,
  },
  {
    id: 'uef-transcript-2026',
    schoolId: 'uef',
    name: 'Xét học bạ THPT (điểm trung bình tổ hợp 3 môn, 6 học kỳ)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: transcriptGaps,
  },
];
