import type { AdmissionMethodDescriptor } from '../../core/admissionMethod';
import { hcmulawKnowledgeGaps } from './knowledgeGaps';

const hocbaGranularityGap = hcmulawKnowledgeGaps.filter((gap) => gap.id === 'hcmulaw-hocba-semester-granularity-gap');

/**
 * HCMULAW 2026 — 4/5 phương thức có công thức điểm (mã 410/200/417/100; Phương thức 1 mã 301 xét
 * thẳng không có công thức điểm, không đưa vào đây, cùng quy ước UFM/HUFLIT/HUTECH).
 *
 * Batch 2026-08-20 — bảng "quy đổi tương đương" (từng chờ kết quả thi TN THPT 2026) nay đã công bố
 * (`hcmulaw-equivalence-notice-2026`):
 * - `thpt5`: `exactCalculator: true` — Phương thức 5 (thi TN THPT) dùng thẳng tổng thô 3 môn (thang
 *   30, không nhân hệ số), không có điểm cộng, điểm ưu tiên theo bảng chuẩn quốc gia.
 * - `vsat4`: `exactCalculator: true` — quy đổi RIÊNG TỪNG MÔN qua bảng bách phân vị (7 môn Toán/
 *   Văn/Anh/Lý/Hóa/Sử/Địa, `conversionTable.ts`), verified khớp ví dụ minh họa chính thức.
 * - `combined2`/`priorityHighSchool3`: giữ `exactCalculator: false` — công thức y=x-k đã có nhưng
 *   x cần TB học bạ theo 6 HỌC KỲ, hồ sơ dùng chung chỉ lưu TB năm (3 giá trị), xem
 *   `knowledgeGaps.ts:hcmulaw-hocba-semester-granularity-gap`. Module này KHÔNG implement bảng điểm
 *   khuyến khích chứng chỉ ngoại ngữ/SAT của Phương thức 2 trong batch này dù nội dung đã đọc được
 *   đầy đủ từ nguồn — vì phần "điểm tổ hợp môn" của PT2 vẫn bị chặn nên chưa có evaluator nào tiêu
 *   thụ bảng đó, để `capabilities.bonus: false` trung thực (chưa có consumer runtime).
 */
export const hcmulawAdmissionMethods: AdmissionMethodDescriptor[] = [
  {
    id: 'hcmulaw-combined2-2026',
    schoolId: 'hcmulaw',
    name: 'Xét tuyển kết hợp kết quả học tập THPT với chứng chỉ ngoại ngữ quốc tế/SAT (mã PT 410)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT, có chứng chỉ ngoại ngữ quốc tế hoặc kết quả SAT'],
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: hocbaGranularityGap,
  },
  {
    id: 'hcmulaw-priority-highschool3-2026',
    schoolId: 'hcmulaw',
    name: 'Xét tuyển học tập THPT — trường thuộc diện ưu tiên xét tuyển của ĐHQG-HCM (mã PT 200)',
    year: 2026,
    applicantTypes: ['Thí sinh học 3 năm tại trường THPT thuộc danh sách ưu tiên ĐHQG-HCM'],
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
    knowledgeGaps: hocbaGranularityGap,
  },
  {
    id: 'hcmulaw-vsat4-2026',
    schoolId: 'hcmulaw',
    name: 'Xét tuyển kết quả V-SAT 2026 (mã PT 417)',
    year: 2026,
    applicantTypes: ['Thí sinh có kết quả V-SAT 2026, tổ hợp chỉ dùng 7 môn có bảng quy đổi (Toán/Văn/Anh/Lý/Hóa/Sử/Địa)'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
  {
    id: 'hcmulaw-thpt5-2026',
    schoolId: 'hcmulaw',
    name: 'Xét tuyển dựa vào kết quả thi tốt nghiệp THPT 2026 (mã PT 100)',
    year: 2026,
    applicantTypes: ['Thí sinh tốt nghiệp THPT 2026'],
    capabilities: { eligibility: true, scoreConversion: true, bonus: false, priority: true, exactCalculator: true },
  },
];
