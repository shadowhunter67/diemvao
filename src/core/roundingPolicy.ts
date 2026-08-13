import type { RuleEvidence } from './evidence';

/**
 * Ai/cái gì "cho phép" một quy tắc làm tròn:
 * - 'official': nguồn tuyển sinh chính thức nói rõ làm tròn ở bước này.
 * - 'presentation': chỉ làm tròn để hiển thị, không ảnh hưởng tính toán tiếp theo.
 * - 'assumption': developer tự chọn (thường round2 ở bước trung gian) vì nguồn KHÔNG nói rõ
 *   cách làm tròn — hợp lý về mặt hiển thị nhưng có thể lệch kết quả cuối so với "chỉ làm tròn
 *   1 lần ở bước cuối cùng" (xem `docs/rounding-audit.md` — đo được lệch tối đa ~0.03/100 điểm
 *   qua fuzz test ở HCMUT). KHÔNG tự đổi thuật toán chỉ vì phát hiện assumption — chỉ đổi khi có
 *   evidence rằng cách hiện tại SAI so với quy định thật.
 */
export type RoundingAuthority = 'official' | 'presentation' | 'assumption';

export interface RoundingRule {
  /** Số chữ số thập phân, null = không làm tròn ở bước này. */
  decimals: number | null;
  /** Tên bước tính toán (vd "dgnl.normalizedScore", "academic.score", "finalScore"). */
  stage: string;
  authority: RoundingAuthority;
  evidence?: RuleEvidence[];
  note?: string;
}
