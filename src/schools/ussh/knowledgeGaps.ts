import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Re-audit 2026-08-13 (evidence mới: ảnh "Nguyên tắc tính điểm xét tuyển" + 3 ảnh cutoff 2026).
 * Kết quả re-audit: ĐT3 (90%ĐGNL+10%HB) tính được ĐẦY ĐỦ — không chứa α1/α2, mọi hằng số đều rõ
 * (xem `calculator.ts`). ĐT1/ĐT2 VẪN blocked — không phải vì "chưa công bố" chung chung như batch
 * trước, mà vì 2 lý do CỤ THỂ đọc được từ chính ảnh (xem `calculator.ts` JSDoc):
 * 1. α1 được ĐỊNH NGHĨA có giá trị (ĐT1=1, ĐT2=1.075) nhưng KHÔNG xuất hiện ở công thức hiển thị
 *    — vai trò/vị trí nhân vào đâu không xác định được, không suy đoán.
 * 2. α2 xuất hiện trong công thức (`THPT + α2`) nhưng là giá trị RIÊNG TỪNG ngành — ảnh không kèm
 *    bảng giá trị theo ngành.
 * Bảng "Điểm cộng" (+ĐC) cũng chưa có evidence trong bất kỳ ảnh nào đã nhận — ĐT3 hiện chỉ tính
 * "điểm trước cộng+ưu tiên", không phải điểm xét tuyển hoàn chỉnh.
 */
export const usshKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'ussh-alpha1-role-unresolved',
    label:
      'Hệ số α1 (ĐT1=1, ĐT2=1.075, theo ảnh chính thức) không xuất hiện ở công thức ĐT1/ĐT2 hiển thị trong cùng ảnh — vai trò/vị trí áp dụng chưa xác định được, chặn tính ĐT1/ĐT2',
    status: 'official-but-unparsed',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'ussh-alpha2-per-program-table',
    label:
      'Hệ số α2 (độ lệch tổ hợp so tổ hợp gốc, xuất hiện trong công thức ĐT1/ĐT2 dạng "THPT + α2") là giá trị riêng theo ngành/chương trình — chưa có bảng giá trị cụ thể, chặn tính ĐT1/ĐT2',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'ussh-bonus-table',
    label: 'Bảng "Điểm cộng" (+ĐC, thành phần cộng thêm ngoài công thức trọng số ĐT1/ĐT2/ĐT3) — chưa có evidence, chặn cả 3 đối tượng ra điểm xét tuyển cuối',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
  {
    id: 'ussh-priority-standard-table',
    label: 'Bảng "Mức điểm ưu tiên khu vực, đối tượng" (thang 100, dùng làm input cho công thức giảm điểm ưu tiên) — công thức GIẢM đã verified (`priorityReduction.ts`) nhưng bảng giá trị GỐC theo khu vực/đối tượng chưa có evidence',
    status: 'incomplete',
    scoreAffecting: true,
    impact: 'exact-final-score-blocking',
  },
];
