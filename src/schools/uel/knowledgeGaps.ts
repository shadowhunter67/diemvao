import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Chặn exact calculator UEL — cùng pattern với `schools/ueh/knowledgeGaps.ts`/
 * `schools/uit/knowledgeGaps.ts`. Batch 6: chuyển từ hard-code trong `UelExplorerPage.tsx` sang
 * data file để domain layer là nguồn sự thật duy nhất (UI chỉ render, method descriptor cũng đọc
 * chung nguồn này thay vì lặp lại text).
 *
 * Batch 6, workstream T: research targeted đã UNBLOCK quy tắc giảm điểm ưu tiên (đọc trực tiếp từ
 * `tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/`, 2026-08-13) — xem
 * `priorityReduction.ts` (tool riêng, đã implement + test). Gap này XÓA khỏi danh sách. Bảng điểm
 * cộng ngoại ngữ VẪN thiếu: fetch trực tiếp trang chính thức chỉ thấy 1 ví dụ rời rạc ("IELTS 5.5
 * → +3.50") trong phần minh họa cách tính, bảng đầy đủ nằm ở "Phụ lục 2" dạng file đính kèm
 * (Google Drive PDF) không đọc được qua fetch tự động; cross-check báo chí (VnExpress) lại nói
 * "IELTS ≥5.0 tối đa 5 điểm" — 2 nguồn không đủ chi tiết để dựng bảng nhiều mức an toàn, có phần
 * còn hơi khác nhau về ngưỡng tối thiểu (5.0 vs ví dụ 5.5) — giữ `incomplete`, KHÔNG suy đoán các
 * mức còn lại từ 1-2 điểm dữ liệu.
 */
export const uelKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'uel-certificate-bonus-table',
    label: 'Bảng điểm cộng chứng chỉ ngoại ngữ quốc tế đầy đủ theo từng mức (chỉ có 1-2 điểm dữ liệu rời rạc: IELTS 5.5→+3.50, tối đa 5/100 — chưa đủ dựng bảng)',
    status: 'incomplete',
    note: 'Bảng đầy đủ nằm ở "Phụ lục 2" file đính kèm (PDF/Drive) trên trang tuyển sinh chính thức, chưa đọc được qua fetch tự động — cần người có quyền tải file xác nhận lại.',
  },
];
