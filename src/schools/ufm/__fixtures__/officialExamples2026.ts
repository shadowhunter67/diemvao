import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { UfmThreeSubjectInput } from '../calculator';
import type { UfmThresholdGroup } from '../eligibility';

/**
 * UFM 2026 không có official worked example (input→output) cho xét THPT/xét ĐGNL — chỉ có công
 * thức + ngưỡng nguyên văn từ Thông báo 10/7/2026 (`ufm-quality-threshold-2026`) + bảng ưu tiên
 * cross-checked quốc gia (`ufm-admission-plan-2026`). Tier C. Case dưới đây phủ: case thường,
 * boundary ngưỡng, nhóm Luật kinh tế (cả pass và fail điều kiện phụ Toán≥6), boundary giảm ưu tiên.
 */
export const ufmThptGoldenCases: GoldenAdmissionCase<
  UfmThreeSubjectInput & { priorityRegion?: string; priorityCategory?: string; group: UfmThresholdGroup },
  { raw30: number; finalScore: number; eligible: boolean }
>[] = [
  {
    id: 'ufm-2026-thpt-standard-normal',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Điểm xét = tổng thô 3 môn (không hệ số); ngưỡng nhóm "chuẩn" = 16/30; ưu tiên KV2 = 0,25 (bảng chuẩn quốc gia).',
    derivation: `
      raw30 = 8+7+6 = 21.00 (>=16 → eligible, nhóm standard)
      standardPriority30 = KV2 = 0.25 (không category)
      cappedTotal=21.00 < 22.5 → KHÔNG giảm → effectivePriority30 = 0.25
      finalScore = round(min(30, 21.00+0.25)) = 21.25
    `,
    input: { subject1Score: 8, subject2Score: 7, subject3Score: 6, priorityRegion: 'KV2', group: 'standard' },
    expected: { raw30: 21.0, finalScore: 21.25, eligible: true },
  },
  {
    id: 'ufm-2026-thpt-standard-boundary',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "chuẩn" = 16/30 — case này ĐÚNG bằng ngưỡng (boundary = đạt).',
    derivation: `
      raw30 = 6+5+5 = 16.00 (== 16 → eligible, nhóm standard)
      không khai KV/ĐT → effectivePriority30 = 0
      finalScore = round(min(30, 16.00+0)) = 16.00
    `,
    boundaryNote: 'Ngưỡng đầu vào đúng bằng điểm — chứng minh phép so sánh dùng >= chứ không phải >.',
    input: { subject1Score: 6, subject2Score: 5, subject3Score: 5, group: 'standard' },
    expected: { raw30: 16.0, finalScore: 16.0, eligible: true },
  },
  {
    id: 'ufm-2026-thpt-law-economics-pass',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Luật kinh tế: tổng ≥20/30 VÀ Toán ≥6 VÀ không môn nào <1 — case này thỏa cả 3 điều kiện.',
    derivation: `
      raw30 = 7(Toán)+7+6 = 20.00 (>=20, Toán=7>=6, min(7,7,6)=6>=1 → eligible, nhóm law-economics)
      không khai KV/ĐT → effectivePriority30 = 0
      finalScore = round(min(30, 20.00+0)) = 20.00
    `,
    input: { subject1Score: 7, subject2Score: 7, subject3Score: 6, group: 'law-economics' },
    expected: { raw30: 20.0, finalScore: 20.0, eligible: true },
  },
  {
    id: 'ufm-2026-thpt-law-economics-fails-math-floor',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Luật kinh tế: tổng ≥20 nhưng Toán <6 → VẪN ineligible dù tổng đạt — chứng minh điều kiện phụ độc lập với tổng.',
    derivation: `
      raw30 = 5(Toán)+8+8 = 21.00 (>=20 nhưng Toán=5<6 → ineligible, nhóm law-economics)
      finalScore vẫn tính được (exact không phụ thuộc eligibility) = round(min(30, 21.00+0)) = 21.00
    `,
    boundaryNote: 'Điều kiện phụ Toán≥6 độc lập với tổng điểm — tổng đạt ngưỡng KHÔNG đủ nếu Toán dưới sàn riêng.',
    input: { subject1Score: 5, subject2Score: 8, subject3Score: 8, group: 'law-economics' },
    expected: { raw30: 21.0, finalScore: 21.0, eligible: false },
  },
  {
    id: 'ufm-2026-thpt-priority-reduction-boundary',
    schoolId: 'ufm',
    methodId: 'ufm-thpt-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-admission-plan-2026',
    sourceNote: 'Giảm điểm ưu tiên khi tổng >= 22,5/30 (bảng chuẩn quốc gia, cross-checked).',
    derivation: `
      raw30 = 9+9+9 = 27.00 (>=16 → eligible, nhóm standard)
      standardPriority30 = KV1 = 0.75
      cappedTotal=27.00 >= 22.5 → GIẢM: effectivePriority30 = round(((30-27)/7.5)×0.75) = round(0.4×0.75) = round(0.3) = 0.30
      finalScore = round(min(30, 27.00+0.30)) = 27.30
    `,
    boundaryNote: 'Priority reduction threshold (22,5/30) vừa bị vượt.',
    input: { subject1Score: 9, subject2Score: 9, subject3Score: 9, priorityRegion: 'KV1', group: 'standard' },
    expected: { raw30: 27.0, finalScore: 27.3, eligible: true },
  },
];

/**
 * Batch 2026-08-20: "Điểm xét tuyển" ĐGNL/học bạ/V-SAT viết lại HOÀN TOÀN theo văn bản gốc đúng —
 * quy đổi qua bảng bách phân vị (mục 3, `conversionTable.ts`) sang thang 30 TRƯỚC khi cộng ưu
 * tiên/điểm cộng, KHÔNG cộng thẳng thang gốc như fixture batch trước (đã SAI, xem lịch sử ở
 * `docs/CHANGELOG.md`). Case dưới đây cố tình chọn điểm thô TRÙNG BIÊN khoảng (min/max) để expected
 * là giá trị `thpt30Min`/`thpt30Max` đọc thẳng từ bảng — tránh rủi ro sai số nội suy tay khi viết
 * fixture. Case nội suy giữa-khoảng dùng ĐÚNG ví dụ minh họa chính thức của văn bản (V-SAT, xem
 * `ufmVsatGoldenCases`) — không tự bịa case nội suy khác.
 */
export const ufmDgnlGoldenCases: GoldenAdmissionCase<
  { dgnlScore1200: number; priorityRegion?: string; priorityCategory?: string; group: UfmThresholdGroup },
  { convertedY30?: number; finalScore?: number; eligible: boolean }
>[] = [
  {
    id: 'ufm-2026-dgnl-standard-boundary-floor',
    schoolId: 'ufm',
    methodId: 'ufm-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Sàn Khoảng 6 (mục 3.2) = 657 = đúng ngưỡng đầu vào nhóm chuẩn — y đọc thẳng từ bảng = 16,00.',
    derivation: `
      dgnlScore1200 = 657 (== 657 → eligible, nhóm standard)
      y = quy đổi qua bảng (mục 3.2, Khoảng 6, x=min) = 16.00 (đọc thẳng, không nội suy)
      không khai KV/ĐT → effectivePriority30 = 0
      finalScore = round(min(30, 16.00+0)) = 16.00
    `,
    boundaryNote: 'Ngưỡng đầu vào đúng bằng sàn khoảng thấp nhất của bảng quy đổi.',
    input: { dgnlScore1200: 657, group: 'standard' },
    expected: { convertedY30: 16.0, finalScore: 16.0, eligible: true },
  },
  {
    id: 'ufm-2026-dgnl-below-threshold-no-score',
    schoolId: 'ufm',
    methodId: 'ufm-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Ngưỡng nhóm "Luật kinh tế" (ĐGNL) = 720/1200 — case này DƯỚI ngưỡng 1 điểm, KHÔNG có Điểm xét tuyển.',
    derivation: `
      dgnlScore1200 = 719 (< 720 → ineligible, nhóm law-economics)
      Dưới ngưỡng đầu vào → KHÔNG tính "Điểm xét tuyển" (evaluate.ts không trả score khi ineligible)
    `,
    input: { dgnlScore1200: 719, group: 'law-economics' },
    expected: { eligible: false },
  },
  {
    id: 'ufm-2026-dgnl-priority-reduction-at-ceiling',
    schoolId: 'ufm',
    methodId: 'ufm-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-admission-plan-2026',
    sourceNote: 'Trần Khoảng 1 (mục 3.2) = 1139 → y=30,00 = trần tuyệt đối thang điểm; giảm ưu tiên tại y>=22,5 áp dụng ngay (bảng chuẩn quốc gia, cross-checked).',
    derivation: `
      dgnlScore1200 = 1139 (trần bảng công bố, >=657 → eligible, nhóm standard)
      y = quy đổi qua bảng (mục 3.2, Khoảng 1, x=max) = 30.00 (đọc thẳng)
      standardPriority30 = KV1 = 0.75
      cappedTotal=30.00 >= 22.5 → GIẢM: effectivePriority30 = round(((30-30)/7.5)×0.75) = 0.00
      finalScore = round(min(30, 30.00+0.00)) = 30.00
    `,
    boundaryNote: 'y chạm trần 30 → điểm ưu tiên giảm về đúng 0 (không thể vượt trần thang điểm).',
    input: { dgnlScore1200: 1139, priorityRegion: 'KV1', group: 'standard' },
    expected: { convertedY30: 30.0, finalScore: 30.0, eligible: true },
  },
  {
    id: 'ufm-2026-dgnl-clamped-above-table-ceiling',
    schoolId: 'ufm',
    methodId: 'ufm-dgnl-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'ĐGNL cho phép điểm tới 1200 (trần lý thuyết) nhưng bảng quy đổi công bố chỉ tới 1139 (điểm cao nhất thực tế kỳ thi) — điểm vượt 1139 được kẹp về y=30 (xem conversionTable.ts).',
    derivation: `
      dgnlScore1200 = 1200 (trần lý thuyết, vượt trần bảng công bố 1139)
      y = kẹp về 30.00 (không suy diễn công thức nội suy ngoài phạm vi bảng)
      finalScore = round(min(30, 30.00+0)) = 30.00
    `,
    input: { dgnlScore1200: 1200, group: 'standard' },
    expected: { convertedY30: 30.0, finalScore: 30.0, eligible: true },
  },
];

/** Mục 3.1 — học bạ. Cùng cách chọn case (trùng biên khoảng) như `ufmDgnlGoldenCases`, xem comment ở đó. */
export const ufmHocbaGoldenCases: GoldenAdmissionCase<
  UfmThreeSubjectInput & { priorityRegion?: string; priorityCategory?: string; group: UfmThresholdGroup },
  { raw30: number; convertedY30?: number; finalScore?: number; eligible: boolean }
>[] = [
  {
    id: 'ufm-2026-hocba-standard-boundary-floor',
    schoolId: 'ufm',
    methodId: 'ufm-hocba-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'raw30=18,00 = đúng ngưỡng đầu vào = sàn Khoảng 6 (mục 3.1) → y đọc thẳng từ bảng = 16,00.',
    derivation: `
      raw30 = 6+6+6 = 18.00 (== 18 → eligible, nhóm standard)
      y = quy đổi qua bảng (mục 3.1, Khoảng 6, x=min) = 16.00 (đọc thẳng)
      không khai KV/ĐT → effectivePriority30 = 0
      finalScore = round(min(30, 16.00+0)) = 16.00
    `,
    boundaryNote: 'Ngưỡng đầu vào đúng bằng sàn khoảng thấp nhất của bảng quy đổi.',
    input: { subject1Score: 6, subject2Score: 6, subject3Score: 6, group: 'standard' },
    expected: { raw30: 18.0, convertedY30: 16.0, finalScore: 16.0, eligible: true },
  },
  {
    id: 'ufm-2026-hocba-below-threshold-no-score',
    schoolId: 'ufm',
    methodId: 'ufm-hocba-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'raw30=17,99 < 18 → ineligible, KHÔNG có Điểm xét tuyển.',
    derivation: `
      raw30 = 6+6+5.99 = 17.99 (< 18 → ineligible, nhóm standard)
      Dưới ngưỡng đầu vào → KHÔNG tính "Điểm xét tuyển"
    `,
    input: { subject1Score: 6, subject2Score: 6, subject3Score: 5.99, group: 'standard' },
    expected: { raw30: 17.99, eligible: false },
  },
  {
    id: 'ufm-2026-hocba-ceiling-priority-reduced-to-zero',
    schoolId: 'ufm',
    methodId: 'ufm-hocba-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-admission-plan-2026',
    sourceNote: 'raw30=30,00 (điểm tuyệt đối tối đa mỗi môn thang 10) = trần Khoảng 1 → y=30,00, ưu tiên giảm về 0.',
    derivation: `
      raw30 = 10+10+10 = 30.00 (>=18 → eligible, nhóm standard)
      y = quy đổi qua bảng (mục 3.1, Khoảng 1, x=max) = 30.00 (đọc thẳng)
      standardPriority30 = KV1 = 0.75
      cappedTotal=30.00 >= 22.5 → GIẢM: effectivePriority30 = round(((30-30)/7.5)×0.75) = 0.00
      finalScore = round(min(30, 30.00+0.00)) = 30.00
    `,
    boundaryNote: 'y chạm trần 30 → điểm ưu tiên giảm về đúng 0.',
    input: { subject1Score: 10, subject2Score: 10, subject3Score: 10, priorityRegion: 'KV1', group: 'standard' },
    expected: { raw30: 30.0, convertedY30: 30.0, finalScore: 30.0, eligible: true },
  },
];

/**
 * Mục 3.3 — V-SAT. `ufm-2026-vsat-official-worked-example` là case DUY NHẤT trong toàn bộ UFM golden
 * suite lấy trực tiếp từ ví dụ minh họa CHÍNH THỨC của văn bản gốc (trang 7, mục 3.4) — Tier cao hơn
 * các case còn lại (tự thiết kế theo biên bảng).
 */
export const ufmVsatGoldenCases: GoldenAdmissionCase<
  { vsatScore: number; priorityRegion?: string; priorityCategory?: string; group: UfmThresholdGroup },
  { convertedY30?: number; finalScore?: number; eligible: boolean }
>[] = [
  {
    id: 'ufm-2026-vsat-official-worked-example',
    schoolId: 'ufm',
    methodId: 'ufm-vsat-2026',
    year: 2026,
    tier: 'A',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'Ví dụ minh họa CHÍNH THỨC của văn bản (mục 3.4, trang 7): V-SAT 360,00đ, Khoảng 3 (a=356,5 b=377,5 c=23,75 d=25,10) → y=23,98.',
    derivation: `
      vsatScore = 360.00 (>=241 → eligible, nhóm standard)
      y = c + (x-a)(d-c)/(b-a) = 23.75 + (360-356.5)(25.10-23.75)/(377.5-356.5) = 23.98 (khớp ví dụ chính thức)
      không khai KV/ĐT → effectivePriority30 = 0
      finalScore = round(min(30, 23.98+0)) = 23.98
    `,
    input: { vsatScore: 360, group: 'standard' },
    expected: { convertedY30: 23.98, finalScore: 23.98, eligible: true },
  },
  {
    id: 'ufm-2026-vsat-floor-inclusive-boundary',
    schoolId: 'ufm',
    methodId: 'ufm-vsat-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'vsatScore=241 = đúng ngưỡng đầu vào = sàn Khoảng 6, biên BAO GỒM (`≥`, khác Khoảng 1-5 dùng `>`) → y=16,00.',
    derivation: `
      vsatScore = 241 (== 241 → eligible, nhóm standard)
      y = quy đổi qua bảng (mục 3.3, Khoảng 6, biên dưới bao gồm) = 16.00 (đọc thẳng)
      finalScore = round(min(30, 16.00+0)) = 16.00
    `,
    boundaryNote: 'Chứng minh Khoảng 6 dùng biên dưới BAO GỒM (≥), khác các khoảng còn lại (>).',
    input: { vsatScore: 241, group: 'standard' },
    expected: { convertedY30: 16.0, finalScore: 16.0, eligible: true },
  },
  {
    id: 'ufm-2026-vsat-below-threshold-no-score',
    schoolId: 'ufm',
    methodId: 'ufm-vsat-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'ufm-quality-threshold-2026',
    sourceNote: 'vsatScore=240 < 241 → ineligible, KHÔNG có Điểm xét tuyển.',
    derivation: `
      vsatScore = 240 (< 241 → ineligible, nhóm standard)
      Dưới ngưỡng đầu vào → KHÔNG tính "Điểm xét tuyển"
    `,
    input: { vsatScore: 240, group: 'standard' },
    expected: { eligible: false },
  },
];
