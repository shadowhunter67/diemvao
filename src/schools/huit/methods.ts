import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { huitKnowledgeGaps } from './knowledgeGaps';

const gapById = (id: string) => huitKnowledgeGaps.filter((gap) => gap.id === id);

const sharedGaps = [
  ...gapById('huit-priority-bonus-table-not-found'),
  ...gapById('huit-program-catalog-not-imported'),
  ...gapById('huit-dgnl-methods-not-modeled'),
  ...gapById('huit-earlier-notice-provisional-superseded'),
];

const thptExamGaps = [...sharedGaps];
const transcriptGaps = [...gapById('huit-transcript-methodology-unpublished'), ...sharedGaps];

/**
 * HUIT 2026 — 2/4 phương thức có ngưỡng đọc được từ nguồn (Phương thức thi TN THPT + Phương thức
 * học tập THPT); ĐGNL ĐHQG TP.HCM và ĐGNL chuyên biệt HCMUE có ngưỡng công bố nhưng ngoài scope
 * batch này (`huit-dgnl-methods-not-modeled`). Cả 2 method `eligibility: true` nhưng
 * `scoreConversion`/`bonus`/`priority`/`exactCalculator` đều `false` — chặn bởi gap thật (bảng ưu
 * tiên/điểm cộng chưa tìm thấy, danh mục ngành chưa import, và với transcript thêm gap phương pháp
 * tính điểm chưa nêu rõ).
 */
export const huitAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'huit-thpt-exam-2026',
    schoolId: 'huit',
    name: 'Xét kết quả thi tốt nghiệp THPT năm 2026',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: thptExamGaps,
  },
  {
    id: 'huit-transcript-2026',
    schoolId: 'huit',
    name: 'Xét kết quả học tập THPT (học bạ)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: transcriptGaps,
  },
];
