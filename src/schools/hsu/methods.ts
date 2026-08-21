import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hsuKnowledgeGaps } from './knowledgeGaps';

const gapById = (id: string) => hsuKnowledgeGaps.filter((gap) => gap.id === id);

const sharedGaps = [...gapById('hsu-priority-bonus-table-not-found'), ...gapById('hsu-program-catalog-not-imported'), ...gapById('hsu-dgnl-interview-methods-not-modeled')];

const thptExamGaps = [...sharedGaps];
const transcriptGaps = [...gapById('hsu-transcript-methodology-unpublished'), ...gapById('hsu-law-non-thpt-threshold-unpublished'), ...sharedGaps];

/**
 * HSU 2026 — 2/4 phương thức có ngưỡng đọc được (thi TN THPT: 15 chuẩn/20 Luật; học bạ: 18 chuẩn,
 * Luật chưa công bố). ĐGNL và phỏng vấn/tuyển thẳng có ngưỡng công bố nhưng ngoài scope batch này
 * (`hsu-dgnl-interview-methods-not-modeled`). Cả 2 method `eligibility: true` nhưng
 * `scoreConversion`/`bonus`/`priority`/`exactCalculator` đều `false`.
 */
export const hsuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hsu-thpt-exam-2026',
    schoolId: 'hsu',
    name: 'Xét kết quả thi tốt nghiệp THPT năm 2026',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: thptExamGaps,
  },
  {
    id: 'hsu-transcript-2026',
    schoolId: 'hsu',
    name: 'Xét học bạ THPT (tổ hợp 3 môn, 6 học kỳ)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: transcriptGaps,
  },
];
