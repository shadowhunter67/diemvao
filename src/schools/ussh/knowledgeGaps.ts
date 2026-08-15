import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Re-audit 2026-08-15 (evidence mới: PDF chính thức "Thông tin tuyển sinh năm 2026", 36 trang, có
 * text layer + thông báo độc lập "Một số lưu ý..." xác nhận lại nguyên văn). Kết quả: công thức
 * ĐHL1/ĐHL2/ĐHL3 KHÔNG chứa α — batch trước (dựa trên ảnh infographic hiển thị "THPT + α2") đã bị
 * PDF chính thức này supersede. α chỉ dùng để trường tự quy đổi độ lệch tổ hợp khi XÁC ĐỊNH ĐIỂM
 * CHUẨN nội bộ cho đối tượng 2/3, không phải input của phép tính điểm cá nhân — xem `calculator.ts`
 * JSDoc và PDF mục 3b/trang 5 ("Điểm lệch giữa các tổ hợp được phân tích, xử lý trong quá trình xử
 * lý nguyện vọng của thí sinh").
 *
 * Còn lại 1 blocker CẤU TRÚC (không phải "trường chưa công bố" — trường CHỦ ĐỘNG để ngỏ, xem
 * `bonus.ts`): mức cộng cụ thể trong mỗi Nhóm thành tích do Hội đồng tuyển sinh xem xét case-by-
 * case, "công bố cùng kết quả xét tuyển" — chỉ biết TRẦN theo nhóm (Nhóm1≤3, Nhóm2≤4, Nhóm3≤3,
 * tổng≤10/100), không biết mức cụ thể cho mỗi tiêu chí. UniscoreVN hỗ trợ chính xác cho thí sinh
 * KHÔNG có thành tích thuộc bất kỳ nhóm nào (ĐC=0, supported-scope) — thí sinh CÓ thành tích vẫn
 * blocked cho phần điểm cộng.
 */
export const usshKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'ussh-bonus-exact-amount-per-criterion',
    label:
      'Mức cộng cụ thể cho từng tiêu chí trong mỗi Nhóm thành tích (Nhóm 1≤3đ/Nhóm 2≤4đ/Nhóm 3≤3đ, tổng≤10đ) chưa công bố — trường tự nói "công bố cùng kết quả xét tuyển". UniscoreVN chỉ tính chính xác cho thí sinh KHÔNG có thành tích được cộng điểm (ĐC=0).',
    status: 'official-but-unparsed',
    sourceId: 'ussh-info-pdf-2026',
    scoreAffecting: false,
    impact: 'exact-final-score-blocking',
    note: 'KHÔNG chặn exactCalculator của phạm vi "không có thành tích cộng điểm" (ĐC=0) — như IU (`schools/iu/methods.ts`), gap này KHÔNG gắn vào `method.knowledgeGaps` vì chỉ áp dụng phạm vi thí sinh có thành tích (chưa hỗ trợ), không phải phạm vi đã exact.',
  },
];
