import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hubKnowledgeGaps } from './knowledgeGaps';

const gapById = (id: string) => hubKnowledgeGaps.filter((gap) => gap.id === id);

/** Gap dùng chung mọi phương thức: bảng ưu tiên/điểm cộng, danh mục ngành, khu vực Luật khác KV3,
 * bảng quy đổi IELTS-tương-đương Elite Class. */
const sharedGaps = [
  ...gapById('hub-priority-bonus-table-not-found'),
  ...gapById('hub-program-catalog-not-imported'),
  ...gapById('hub-law-other-priority-zones-threshold-unknown'),
  ...gapById('hub-elite-ielts-equivalent-table-not-found'),
];

const thptExamGaps = [...sharedGaps];
const comprehensiveGaps = [
  ...sharedGaps,
  ...gapById('hub-appendix2-comprehensive-conversion-table-unparsed'),
  ...gapById('hub-comprehensive-vsat-pre2026-graduate-not-modeled'),
];
const vsatGaps = [
  ...sharedGaps,
  ...gapById('hub-appendix1-vsat-percentile-table-unparsed'),
  ...gapById('hub-comprehensive-vsat-pre2026-graduate-not-modeled'),
];

/**
 * HUB 2026 — 3 phương thức xét tuyển đại học chính quy đều có ngưỡng đảm bảo chất lượng đầu vào
 * đọc được từ nguồn chính thức (`sources.ts:hub-quality-threshold-2026`): Phương thức 1 (thi TN
 * THPT), Phương thức Tổng hợp, Phương thức V-SAT. Cả 3 method đều `eligibility: true` nhưng
 * `scoreConversion`/`bonus`/`priority`/`exactCalculator` đều `false` — đây là threshold/eligibility
 * checker, KHÔNG phải calculator chính xác:
 * - Phương thức Tổng hợp/V-SAT quy đổi điểm trúng tuyển tương đương cần Phụ lục I/II (bảng phân
 *   vị/khung quy đổi) — official-but-unparsed, chặn `scoreConversion`/`exactCalculator`.
 * - Phương thức 1 (thi TN THPT) có thể hiển thị điểm thi trực tiếp làm điểm xét tuyển KHÔNG cần
 *   quy đổi, NHƯNG bảng điểm ưu tiên khu vực/đối tượng cụ thể áp dụng cho HUB và bảng điểm cộng
 *   thành tích chưa tìm được nguồn riêng (`hub-priority-bonus-table-not-found`) — giữ
 *   `exactCalculator: false` cho an toàn (không claim "điểm xét tuyển cuối" khi thiếu điểm ưu
 *   tiên/điểm cộng).
 */
export const hubAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hub-thpt-exam-2026',
    schoolId: 'hub',
    name: 'Xét kết quả thi tốt nghiệp THPT năm 2026 (Phương thức 1)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: thptExamGaps,
  },
  {
    id: 'hub-comprehensive-2026',
    schoolId: 'hub',
    name: 'Xét tuyển Phương thức Tổng hợp',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026', 'Thí sinh tốt nghiệp THPT năm 2025 trở về trước'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: comprehensiveGaps,
  },
  {
    id: 'hub-vsat-2026',
    schoolId: 'hub',
    name: 'Xét tuyển bằng điểm thi V-SAT',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026', 'Thí sinh tốt nghiệp THPT năm 2025 trở về trước'],
    capabilities: { eligibility: true, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: vsatGaps,
  },
];
