import { round2 } from '../../core/round2';

/**
 * "Nguyên tắc tính điểm xét tuyển" USSH 2026 (ảnh official, mã trường QSX) — nguồn
 * `ussh-scoring-principles-2026` (xem `sources.ts`). Transcribe NGUYÊN VĂN 3 công thức hiển thị
 * trong ảnh (không suy diễn thêm ký hiệu không xuất hiện):
 *
 *   ĐT1 = 0.45×[(THPT + α2)×100/30] + 0.45×[(ĐGNL)×100/1200] + 0.10×[(HB)×100/30]  (+ĐC +ƯT)
 *   ĐT2 = 0.90×[(THPT + α2)×100/30] + 0.10×[(HB)×100/30]                           (+ĐC +ƯT)
 *   ĐT3 = 0.90×[(ĐGNL)×100/1200] + 0.10×[(HB)×100/30]                              (+ĐC +ƯT)
 *
 * Ghi chú dưới bảng: "α1 là hệ số giữa 2 thành phần điểm ĐGNL và THPT (ĐT1, α1=1; ĐT2 α1=1.075)."
 * "α2 là độ lệch giữa các tổ hợp với tổ hợp gốc, tính theo ngành/chương trình."
 *
 * QUAN TRỌNG — 2 vấn đề chưa giải quyết được từ chính ảnh gốc (không phải lỗi đọc ảnh):
 * 1. α1 ĐƯỢC ĐỊNH NGHĨA (có giá trị cụ thể cho ĐT1/ĐT2) nhưng KHÔNG xuất hiện ở bất kỳ đâu trong
 *    3 công thức hiển thị trực tiếp trong ảnh — không rõ nó nhân vào thành phần nào (ĐGNL? THPT?
 *    cả 2?). Theo chỉ thị "nếu ký hiệu mơ hồ, giữ unresolved, không đoán" — module này KHÔNG tự
 *    chèn α1 vào công thức ĐT1/ĐT2 ở bất kỳ vị trí nào.
 * 2. α2 xuất hiện trong công thức (cộng vào THPT: `THPT + α2`) nhưng là giá trị RIÊNG TỪNG
 *    ngành/chương trình — ảnh không kèm bảng giá trị α2 theo ngành, nên không có số cụ thể để dùng.
 *
 * Hệ quả: CHỈ ĐT3 tính được chính xác (không chứa α1/α2 — thuần ĐGNL + học bạ, mọi hằng số đều rõ
 * ràng). ĐT1/ĐT2 KHÔNG có hàm tính số — xem `UsshDt1Dt2Blocker` để UI hiển thị đúng lý do, không
 * suy đoán α2=0 hay bỏ qua α1 một cách âm thầm.
 */
export interface UsshDt3Input {
  /** Điểm ĐGNL ĐHQG-HCM thô, thang 1200. */
  dgnlRaw1200: number;
  /** Tổng điểm học bạ tổ hợp, thang 30 (trung bình 3 năm mỗi môn). */
  transcriptTotal30: number;
}

export interface UsshDt3Result {
  /** Điểm xét tuyển ĐT3, thang 100 — CHƯA gồm Điểm cộng (+ĐC) và Điểm ưu tiên (+ƯT), vì bảng điểm
   * cộng USSH 2026 không có evidence trong lượt research này (xem `knowledgeGaps.ts`). */
  scoreBeforeBonusAndPriority: number;
  dgnlComponent: number;
  transcriptComponent: number;
}

const DT3_DGNL_WEIGHT = 0.9;
const DT3_TRANSCRIPT_WEIGHT = 0.1;

export function calculateUsshDt3Score(input: UsshDt3Input): UsshDt3Result {
  const dgnlComponent = round2(DT3_DGNL_WEIGHT * ((input.dgnlRaw1200 * 100) / 1200));
  const transcriptComponent = round2(DT3_TRANSCRIPT_WEIGHT * ((input.transcriptTotal30 * 100) / 30));
  return {
    dgnlComponent,
    transcriptComponent,
    scoreBeforeBonusAndPriority: round2(dgnlComponent + transcriptComponent),
  };
}

export type UsshDt1Dt2ApplicantType = 'DT1' | 'DT2';

export interface UsshDt1Dt2Blocker {
  applicantType: UsshDt1Dt2ApplicantType;
  reason: string;
  knownWeights: string;
  unresolvedSymbols: string[];
}

/** Mô tả lý do ĐT1/ĐT2 chưa tính được số cụ thể — dùng cho UI/evaluate.ts, không phải hàm tính điểm. */
export function describeUsshDt1Dt2Blocker(applicantType: UsshDt1Dt2ApplicantType): UsshDt1Dt2Blocker {
  return {
    applicantType,
    reason:
      applicantType === 'DT1'
        ? 'Công thức ĐT1 chứa α2 (độ lệch tổ hợp theo ngành, chưa có bảng giá trị) trong thành phần THPT — không thể tính số cụ thể.'
        : 'Công thức ĐT2 chứa α2 (độ lệch tổ hợp theo ngành, chưa có bảng giá trị) trong thành phần THPT — không thể tính số cụ thể.',
    knownWeights: applicantType === 'DT1' ? '0.45×THPT + 0.45×ĐGNL + 0.10×Học bạ' : '0.90×THPT + 0.10×Học bạ',
    unresolvedSymbols: ['α2 (độ lệch tổ hợp theo ngành/chương trình — chưa có bảng giá trị)', 'α1 (được định nghĩa nhưng không xuất hiện trong công thức hiển thị — vai trò chưa rõ)'],
  };
}
