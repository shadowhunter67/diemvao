import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { nttuKnowledgeGaps } from './knowledgeGaps';

const gapById = (id: string) => nttuKnowledgeGaps.filter((gap) => gap.id === id);

const transcriptGaps = [
  ...gapById('nttu-transcript-methodology-unpublished'),
  ...gapById('nttu-priority-bonus-table-not-found'),
  ...gapById('nttu-program-catalog-not-imported'),
  ...gapById('nttu-dgnl-methods-not-modeled'),
  ...gapById('nttu-thpt-exam-method-not-modeled'),
  ...gapById('nttu-source-publish-date-unavailable'),
];

/**
 * NTTU 2026 — 1/nhiều phương thức có ngưỡng đọc được từ nguồn (Phương thức học bạ, 6 nhóm ngành);
 * ĐGNL ĐHQG TP.HCM/Hà Nội có ngưỡng công bố nhưng ngoài scope batch này
 * (`nttu-dgnl-methods-not-modeled`). `eligibility: true` (ngưỡng đã verified từ 1 nguồn official-
 * school) nhưng `scoreConversion`/`bonus`/`priority`/`exactCalculator` đều `false` — chặn bởi gap
 * thật (phương pháp tính điểm học bạ chưa nêu rõ, bảng ưu tiên/điểm cộng chưa tìm thấy, danh mục
 * ngành chưa import).
 */
export const nttuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'nttu-transcript-2026',
    schoolId: 'nttu',
    name: 'Xét kết quả học tập THPT (học bạ)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: transcriptGaps,
  },
];
