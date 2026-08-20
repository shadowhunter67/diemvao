import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { vluKnowledgeGaps } from './knowledgeGaps';

const gapById = (id: string) => vluKnowledgeGaps.filter((gap) => gap.id === id);

const thptExamGaps = [...gapById('vlu-primary-subject-list-unpublished'), ...gapById('vlu-priority-bonus-table-not-found'), ...gapById('vlu-program-catalog-not-imported')];

const transcriptGaps = [
  ...gapById('vlu-primary-subject-list-unpublished'),
  ...gapById('vlu-priority-bonus-table-not-found'),
  ...gapById('vlu-transcript-semester-granularity-gap'),
  ...gapById('vlu-program-catalog-not-imported'),
];

const combinedGaps = [...transcriptGaps, ...gapById('vlu-combined-method-conversion-table-unpublished')];

/**
 * VLU 2026 — 3/6 phương thức có công thức/ngưỡng đọc được (Phương thức 1/2/3 theo thứ tự công bố
 * chính thức); Phương thức 4/5 (kết hợp năng khiếu) và Phương thức 6 (xét thẳng, không có công
 * thức điểm) ngoài scope batch này, xem `vlu-talent-methods-not-modeled` — cùng quy ước các trường
 * khác trong repo không đưa xét thẳng vào danh sách method có công thức (HUFLIT/HUTECH/UFM).
 *
 * Cả 3 method đều `eligibility: true` (ngưỡng nhóm ngành đã verified từ 2 nguồn official-school
 * cross-check khớp nhau) nhưng `scoreConversion`/`bonus`/`priority`/`exactCalculator` đều `false`
 * — chặn bởi gap thật (danh mục môn thi chính chưa công bố, bảng ưu tiên/điểm cộng chưa tìm được,
 * và với PT2/PT3 thêm data-model gap về độ chi tiết học kỳ / bảng quy đổi kỳ thi kết hợp).
 */
export const vluAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'vlu-thpt-exam-2026',
    schoolId: 'vlu',
    name: 'Xét kết quả thi tốt nghiệp THPT năm 2026 (Phương thức 1)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: thptExamGaps,
  },
  {
    id: 'vlu-transcript-2026',
    schoolId: 'vlu',
    name: 'Xét kết quả học tập cấp THPT — học bạ (Phương thức 2)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: transcriptGaps,
  },
  {
    id: 'vlu-combined-2026',
    schoolId: 'vlu',
    name: 'Xét tuyển kết hợp học bạ THPT với ĐGNL/ĐGTD/chứng chỉ quốc tế (Phương thức 3)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả V-ACT/HSA/TSA/V-SAT 2026 hoặc chứng chỉ SAT còn hạn'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: combinedGaps,
  },
];
