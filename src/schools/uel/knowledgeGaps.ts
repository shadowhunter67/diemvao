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
 * cộng ngoại ngữ VẪN thiếu: trang chính thức chỉ thấy 1 ví dụ rời rạc ("IELTS 5.5 → +3.50") trong
 * phần minh họa cách tính, bảng đầy đủ nằm ở "Phụ lục 2" trong file Google Drive PDF chính thức
 * nhưng web fetch chỉ thấy trang Drive "Loading…"; cross-check báo chí (VnExpress) nói "IELTS ≥5.0
 * tối đa 5 điểm" — không đủ chi tiết để dựng bảng nhiều mức an toàn. Vì official artifact tồn tại
 * nhưng chưa parse được, gap dùng `official-but-unparsed`, KHÔNG suy đoán các mức còn lại từ 1-2
 * điểm dữ liệu.
 */
export const uelKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'uel-certificate-bonus-table',
    label:
      'Bảng điểm cộng chứng chỉ ngoại ngữ quốc tế đầy đủ theo từng mức, loại chứng chỉ, biên điểm và điều kiện áp dụng.',
    status: 'official-but-unparsed',
    sourceId: 'uel-admission-pdf-2026-unparsed',
    ruleId: 'foreign-language-bonus-table',
    scoreAffecting: true,
    implemented: false,
    artifactStatus: 'official-drive-view-only-download-denied',
    knownData: [
      'Trang UEL chính thức xác nhận có điểm cộng quy đổi chứng chỉ tiếng Anh quốc tế tại Phụ lục 2.',
      'Ví dụ chính thức trên trang UEL có IELTS 5.5 -> +3.50.',
      'Trang UEL chính thức xác nhận tổng điểm cộng/điểm thưởng không vượt quá 10/100.',
    ],
    missingData: [
      'Toàn bộ band điểm theo từng chứng chỉ được chấp nhận.',
      'Biên inclusive/exclusive của từng band.',
      'Điều kiện hiệu lực/chủng loại chứng chỉ nếu bảng quy định.',
      'Tương tác chính xác giữa điểm cộng ngoại ngữ và các nhóm điểm cộng khác trước khi áp cap.',
    ],
    attemptedSources: [
      'UEL official admissions page: HTML chỉ nêu Phụ lục 2 và ví dụ IELTS 5.5, không có bảng đầy đủ.',
      'Official Google Drive artifact uel-admission-pdf-2026-unparsed: viewer public nhưng web fetch chỉ trả Loading.',
      'Google Drive direct download endpoint: trả thông báo owner không cho download file.',
      'Search official UEL/UEL admissions PDF mirror: không tìm thấy bản UEL-hosted parseable.',
    ],
    whyNotInferred:
      'Không suy bảng từ ví dụ IELTS 5.5 -> +3.50 hoặc nguồn thứ cấp vì các band chứng chỉ, biên điểm và điều kiện áp dụng đều ảnh hưởng trực tiếp đến final score.',
    impact: 'exact-final-score-blocking',
    note:
      'Bảng đầy đủ nằm ở "Phụ lục 2" file đính kèm trên trang tuyển sinh chính thức; hiện chỉ xác nhận được sự tồn tại và một ví dụ rời rạc, chưa đọc được bảng gốc đủ để dựng calculator.',
  },
];
