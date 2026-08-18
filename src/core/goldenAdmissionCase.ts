/**
 * Golden/domain conformance test infra — chống rủi ro "implementation và test cùng đồng ý với
 * nhau nhưng vẫn hiểu sai công thức chính thức" (test lấy expected từ chính calculator đang test).
 * Khác `officialFixture.ts` (`OfficialExampleFixture<I,O>`, Tier A — ví dụ minh họa LẤY NGUYÊN
 * VĂN từ nguồn, input+output đều công bố sẵn): `GoldenAdmissionCase` phủ đủ 3 tier còn lại mà một
 * "exact" method thường gặp khi nguồn KHÔNG có worked example sẵn.
 *
 * - Tier A (official worked example) → dùng `OfficialExampleFixture` (đã có).
 * - Tier B (official table anchor) → `tier: 'B'`, `expected` lấy TRỰC TIẾP 1 dòng bảng nguồn (không
 *   tính toán gì thêm ngoài nội suy đã verified nếu ở giữa 2 mốc).
 * - Tier C (formula-derived anchor) → `tier: 'C'`, nguồn chỉ có formula+constants (không worked
 *   example) — `expected` tính TAY theo formula/constants đã verified, `derivation` BẮT BUỘC ghi
 *   rõ phép tính (không gọi calculator để tạo expected).
 * - Tier D (independent secondary cross-check) → `tier: 'D'`, chỉ bổ sung, KHÔNG dùng thay primary
 *   source cho rule ảnh hưởng điểm nếu primary source đọc được.
 */
export type GoldenEvidenceTier = 'A' | 'B' | 'C' | 'D';

export interface GoldenAdmissionCase<TInput, TExpected> {
  id: string;
  schoolId: string;
  methodId: string;
  year: number;
  tier: GoldenEvidenceTier;
  /** Trỏ vào `sourceRegistry`/`<school>/sources.ts` — KHÔNG duplicate URL/metadata đầy đủ ở đây. */
  sourceId: string;
  /** 1-2 câu: nguồn nói gì, vì sao case này anchor được vào nguồn đó. */
  sourceNote: string;
  /** BẮT BUỘC khi `tier === 'C'` — trace phép tính thủ công ra `expected`, đủ chi tiết để người
   * khác tự kiểm lại bằng máy tính cầm tay mà không cần đọc code. KHÔNG được sinh ra bằng cách gọi
   * hàm production đang test. */
  derivation?: string;
  /** Boundary case này chứng minh điều gì (ví dụ: "priority reduction threshold", "bonus cap",
   * "applicant type branch DT3") — optional, chỉ set khi case này là 1 boundary anchor có chủ đích. */
  boundaryNote?: string;
  input: TInput;
  expected: TExpected;
}

/** Runtime assertion nhẹ — gọi ở đầu mỗi file fixture Tier C để CI fail sớm, rõ ràng nếu ai đó
 * thêm case Tier C mà quên `derivation` (thay vì để mismatch khó hiểu ở test assertion). */
export function assertGoldenCaseProvenance(cases: readonly GoldenAdmissionCase<unknown, unknown>[]): void {
  for (const goldenCase of cases) {
    if (goldenCase.tier === 'C' && !goldenCase.derivation) {
      throw new Error(`Golden case "${goldenCase.id}" (tier C) thiếu "derivation" — Tier C bắt buộc ghi rõ phép tính thủ công.`);
    }
  }
}
