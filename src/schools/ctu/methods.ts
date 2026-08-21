import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { ctuKnowledgeGaps } from './knowledgeGaps';

const gapById = (id: string) => ctuKnowledgeGaps.filter((gap) => gap.id === id);

const sharedGaps = [...gapById('ctu-priority-bonus-table-not-found'), ...gapById('ctu-program-catalog-not-imported'), ...gapById('ctu-gdmn-gdtc-special-formula-not-modeled')];

const thptExamGaps = [...sharedGaps, ...gapById('ctu-per-major-threshold-pdf-unparsed')];
const transcriptGaps = [...sharedGaps, ...gapById('ctu-hocba-vsat-conversion-table-unparsed'), ...gapById('ctu-law-combo-conversion-unparsed')];
const vsatGaps = [...sharedGaps, ...gapById('ctu-hocba-vsat-conversion-table-unparsed'), ...gapById('ctu-law-combo-conversion-unparsed')];

/**
 * CTU 2026 (Đại học Cần Thơ, mã trường TCT) — 3 phương thức chính xét theo điểm (Phương thức 2/3/4)
 * đều có điều kiện đọc được từ nguồn chính thức (`sources.ts:ctu-quality-threshold-2026`):
 * - Phương thức 2 (thi TN THPT): điều kiện 1 (tổng ≥15/30, không môn nào ≤1) verified, ÁP DỤNG
 *   MỌI NGÀNH — nhưng điều kiện 2 (điểm sàn CHI TIẾT theo mã xét tuyển) nằm trong phụ lục PDF ảnh
 *   chưa đọc được, nên KHÔNG kết luận `eligible` chắc chắn, chỉ loại được `ineligible` khi điều
 *   kiện 1 fail.
 * - Phương thức 3 (học bạ)/4 (V-SAT): điểm xét đã quy đổi so với điểm sàn — bảng quy đổi chưa đọc
 *   được, NHƯNG nhóm pháp luật/sư phạm có điều kiện thay thế dùng điểm thi TN THPT 2026 thô (đọc
 *   trực tiếp từ văn bản) — nhóm sư phạm (trừ GDTC) có thể kết luận `eligible` chắc chắn qua đường
 *   này; nhóm pháp luật còn thêm điều kiện tổ hợp môn cần điểm quy đổi (chưa có bảng) nên tối đa
 *   chỉ tới `unknown`/`ineligible`.
 * Phương thức 1 (Tuyển thẳng/ưu tiên xét tuyển) và Phương thức 5 (Chương trình tiên tiến/CLC)
 * không model trong batch này (ngoài phạm vi threshold-only).
 */
export const ctuAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'ctu-thpt-exam-2026',
    schoolId: 'ctu',
    name: 'Xét điểm thi tốt nghiệp THPT năm 2026 (Phương thức 2)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: thptExamGaps,
  },
  {
    id: 'ctu-transcript-2026',
    schoolId: 'ctu',
    name: 'Xét điểm học tập cấp THPT — điểm học bạ (Phương thức 3)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: transcriptGaps,
  },
  {
    id: 'ctu-vsat-2026',
    schoolId: 'ctu',
    name: 'Xét điểm thi V-SAT (Phương thức 4)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: vsatGaps,
  },
];
