/**
 * Ngưỡng đảm bảo chất lượng đầu vào HUB 2026 theo NHÓM NGÀNH (enum ổn định, không so khớp
 * substring tên ngành — cùng pattern `VluThresholdGroup`/`UfmThresholdGroup`/`HutechThresholdGroup`).
 * Danh mục ngành đầy đủ → nhóm chưa import (`hub-program-catalog-not-imported`); caller (UI/
 * comparison context) tự chọn group cho tới khi có mapping thật.
 *
 * Nguồn: `sources.ts:hub-quality-threshold-2026`. Chỉ 3 nhóm có nguồn rõ:
 * - `standard`: mọi ngành trừ Luật và trừ Elite Class — ngưỡng 15/30.
 * - `law`: Luật, Luật kinh tế, Luật kinh tế (tiếng Anh bán phần) — ngưỡng 20/30 (khu vực 3) +
 *   điều kiện môn Toán/Ngữ văn theo tổ hợp.
 * - `finance-banking-elite`: Tài chính - Ngân hàng, Chương trình Tinh hoa (Elite Class) — CÙNG
 *   ngưỡng 15/30 với `standard`, cộng thêm điều kiện IELTS ≥5.5 riêng (`checkHubEliteIeltsRequirement`).
 */
export type HubProgramGroup = 'standard' | 'law' | 'finance-banking-elite';

const GROUP_LABELS: Record<HubProgramGroup, string> = {
  standard: 'các ngành khác (trừ Luật/Luật kinh tế/Luật kinh tế (TA bán phần) và Tài chính - Ngân hàng Elite Class)',
  law: 'Luật, Luật kinh tế, Luật kinh tế (tiếng Anh bán phần)',
  'finance-banking-elite': 'Tài chính - Ngân hàng, Chương trình Tinh hoa (Elite Class)',
};

export type HubAcademicRank = 'kha' | 'gioi';
const RANK_ORDER: Record<HubAcademicRank, number> = { kha: 1, gioi: 2 };

export const HUB_STANDARD_THRESHOLD_30 = 15;
export const HUB_LAW_THPT_THRESHOLD_30 = 20;
export const HUB_LAW_COMPREHENSIVE_RANK_PATH_THRESHOLD_30 = 18;
export const HUB_LAW_GRADUATION_SCORE_THRESHOLD_10 = 8.5;
export const HUB_ELITE_IELTS_MIN = 5.5;

/** Tổ hợp có Toán, KHÔNG có Ngữ văn — chỉ cần Toán ≥ 6 (nguồn liệt kê tường minh A00/A01/D07). */
const MATH_NO_LITERATURE_COMBOS: readonly string[] = ['A00', 'A01', 'D07'];
/** Tổ hợp có cả Toán và Ngữ văn — cần Toán ≥ 6 VÀ Ngữ văn ≥ 6. */
const MATH_AND_LITERATURE_COMBOS: readonly string[] = ['C01', 'C02', 'D01'];

type HubLawCombinationCategory = 'math-no-literature' | 'math-and-literature' | 'unknown';

function classifyHubLawCombination(combinationId: string | undefined): HubLawCombinationCategory {
  if (!combinationId) return 'unknown';
  if (MATH_AND_LITERATURE_COMBOS.includes(combinationId)) return 'math-and-literature';
  if (MATH_NO_LITERATURE_COMBOS.includes(combinationId)) return 'math-no-literature';
  return 'unknown';
}

/** `undefined` = chưa đủ thông tin (tổ hợp không nhận diện được hoặc thiếu điểm môn cần kiểm tra) —
 * caller (evaluate.ts) tự quyết định coi đây là 'unknown' thay vì 'ineligible'. */
function checkHubLawSubjectMinimums(category: HubLawCombinationCategory, scores: { math?: number; literature?: number }): boolean | undefined {
  if (category === 'unknown') return undefined;
  if (scores.math === undefined) return undefined;
  if (scores.math < 6) return false;
  if (category === 'math-and-literature') {
    if (scores.literature === undefined) return undefined;
    return scores.literature >= 6;
  }
  return true;
}

export interface HubEligibilityResult {
  pass: boolean;
  /** Mô tả ngưỡng đã áp dụng, để UI trích dẫn thay vì tự diễn giải. */
  requiredText: string;
}

/** Phương thức 1 (thi TN THPT)/Phương thức Tổng hợp/V-SAT (nhóm `standard`/`finance-banking-elite`,
 * thí sinh tốt nghiệp THPT 2026): ngưỡng chung 15/30, KHÔNG cộng điểm ưu tiên/điểm cộng. */
export function checkHubStandardThreshold(totalScore30: number): HubEligibilityResult {
  return {
    pass: totalScore30 >= HUB_STANDARD_THRESHOLD_30,
    requiredText: `Tổng điểm 3 môn tổ hợp thi TN THPT (hoặc Toán+Ngữ văn+1 môn khác) ≥ ${HUB_STANDARD_THRESHOLD_30} (thang 30, chưa cộng điểm ưu tiên/điểm cộng) — áp dụng ${GROUP_LABELS.standard} và ${GROUP_LABELS['finance-banking-elite']}.`,
  };
}

/** Điều kiện riêng cho ngành Tài chính - Ngân hàng, Chương trình Tinh hoa (Elite Class) — CỘNG THÊM
 * vào ngưỡng chung 15 điểm (`checkHubStandardThreshold`), áp dụng cho cả 3 phương thức. Chứng chỉ
 * tiếng Anh quốc tế khác ngoài IELTS chưa có bảng quy đổi (`hub-elite-ielts-equivalent-table-not-found`)
 * — hàm này chỉ kiểm tra được qua điểm IELTS trực tiếp. */
export function checkHubEliteIeltsRequirement(ielts: number | undefined): HubEligibilityResult {
  return {
    pass: ielts !== undefined && ielts >= HUB_ELITE_IELTS_MIN,
    requiredText: `Chứng chỉ IELTS ≥ ${HUB_ELITE_IELTS_MIN} (hoặc chứng chỉ tiếng Anh quốc tế khác quy đổi tương đương — chưa có bảng quy đổi cụ thể) — riêng ${GROUP_LABELS['finance-banking-elite']}.`,
  };
}

export interface HubLawThptExamInput {
  totalScore30: number;
  combinationId?: string;
  mathScore?: number;
  literatureScore?: number;
  /** Mã khu vực ưu tiên (vd 'KV3') — nguồn chỉ công bố ngưỡng 20 điểm cho khu vực 3
   * (`hub-law-other-priority-zones-threshold-unknown`). */
  priorityZone?: string;
}

/** Phương thức 1 (thi TN THPT năm 2026), nhóm `law`: ngưỡng 20/30, khu vực 3, không nhân hệ số,
 * không tính điểm cộng, kèm điều kiện môn Toán/Ngữ văn theo tổ hợp. */
export function checkHubLawThptExamThreshold(input: HubLawThptExamInput): HubEligibilityResult {
  const category = classifyHubLawCombination(input.combinationId);
  const subjectOk = checkHubLawSubjectMinimums(category, { math: input.mathScore, literature: input.literatureScore });
  const pass = input.priorityZone === 'KV3' && input.totalScore30 >= HUB_LAW_THPT_THRESHOLD_30 && subjectOk === true;
  return {
    pass,
    requiredText: `Thí sinh khu vực 3: tổng điểm 3 môn tổ hợp thi TN THPT ≥ ${HUB_LAW_THPT_THRESHOLD_30} (thang 30, không nhân hệ số, không cộng điểm ưu tiên/điểm cộng) VÀ Toán ≥ 6 (tổ hợp A00/A01/D07) hoặc Toán ≥ 6 và Ngữ văn ≥ 6 (tổ hợp C01/C02/D01) — áp dụng ${GROUP_LABELS.law}. Khu vực khác chưa có nguồn ngưỡng tương đương.`,
  };
}

export interface HubStandardComprehensiveVsatInput {
  academicRank10?: HubAcademicRank;
  academicRank11?: HubAcademicRank;
  academicRank12?: HubAcademicRank;
  totalScore30?: number;
}

/** Phương thức Tổng hợp/V-SAT, nhóm `standard`/`finance-banking-elite`, THÍ SINH TỐT NGHIỆP THPT
 * NĂM 2026: cả 2 điều kiện — học lực cả năm lớp 10/11/12 đạt khá trở lên VÀ tổng điểm 3 môn thi TN
 * THPT theo tổ hợp (hoặc Toán+Văn+1 môn khác) ≥ 15. Thí sinh tốt nghiệp trước 2026 dùng khái niệm
 * "tổng điểm xét tuyển" chưa định nghĩa rõ trong nguồn — KHÔNG model ở hàm này
 * (`hub-comprehensive-vsat-pre2026-graduate-not-modeled`), caller tự trả `unknown` cho nhánh đó. */
export function checkHubStandardComprehensiveVsat2026Eligibility(input: HubStandardComprehensiveVsatInput): HubEligibilityResult {
  const ranks = [input.academicRank10, input.academicRank11, input.academicRank12];
  const allRanksKnown = ranks.every((rank) => rank !== undefined);
  const ranksPass = allRanksKnown && ranks.every((rank) => RANK_ORDER[rank as HubAcademicRank] >= RANK_ORDER.kha);
  const scorePass = input.totalScore30 !== undefined && input.totalScore30 >= HUB_STANDARD_THRESHOLD_30;
  return {
    pass: ranksPass && scorePass,
    requiredText: `Học lực cả năm lớp 10, 11 và 12 đạt mức khá trở lên VÀ tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển (hoặc Toán+Ngữ văn+1 môn khác) ≥ ${HUB_STANDARD_THRESHOLD_30}/30 — áp dụng ${GROUP_LABELS.standard} và ${GROUP_LABELS['finance-banking-elite']}, thí sinh tốt nghiệp THPT năm 2026.`,
  };
}

export interface HubLawComprehensiveVsatInput {
  totalScore30?: number;
  combinationId?: string;
  mathScore?: number;
  literatureScore?: number;
  priorityZone?: string;
  academicRank12?: HubAcademicRank;
  graduationScore10?: number;
}

/** Phương thức Tổng hợp/V-SAT, nhóm `law`, THÍ SINH TỐT NGHIỆP THPT NĂM 2026: đạt 1 trong 3 điều
 * kiện — (a) đáp ứng ngưỡng như Phương thức 1 (KV3, tổng ≥20, môn Toán/Văn theo tổ hợp); (b) học
 * lực lớp 12 đạt giỏi VÀ tổng 3 môn TN THPT (hoặc Toán+Văn+1 môn khác) ≥18 kèm điều kiện môn tương
 * tự; (c) điểm xét tốt nghiệp THPT ≥ 8,5. Thí sinh tốt nghiệp trước 2026 KHÔNG model ở hàm này
 * (`hub-comprehensive-vsat-pre2026-graduate-not-modeled`). */
export function checkHubLawComprehensiveVsat2026Eligibility(input: HubLawComprehensiveVsatInput): HubEligibilityResult {
  const category = classifyHubLawCombination(input.combinationId);
  const subjectOk = checkHubLawSubjectMinimums(category, { math: input.mathScore, literature: input.literatureScore });

  const pathA = input.priorityZone === 'KV3' && input.totalScore30 !== undefined && input.totalScore30 >= HUB_LAW_THPT_THRESHOLD_30 && subjectOk === true;
  const pathB =
    input.academicRank12 === 'gioi' &&
    input.totalScore30 !== undefined &&
    input.totalScore30 >= HUB_LAW_COMPREHENSIVE_RANK_PATH_THRESHOLD_30 &&
    subjectOk === true;
  const pathC = input.graduationScore10 !== undefined && input.graduationScore10 >= HUB_LAW_GRADUATION_SCORE_THRESHOLD_10;

  return {
    pass: pathA || pathB || pathC,
    requiredText: `Thí sinh tốt nghiệp THPT 2026, ${GROUP_LABELS.law} — đạt 1 trong 3 điều kiện: (a) khu vực 3, tổng 3 môn thi TN THPT ≥ ${HUB_LAW_THPT_THRESHOLD_30}/30 kèm Toán≥6 (và Ngữ văn≥6 nếu tổ hợp có Văn); (b) học lực lớp 12 xếp loại giỏi VÀ tổng 3 môn ≥ ${HUB_LAW_COMPREHENSIVE_RANK_PATH_THRESHOLD_30}/30 kèm điều kiện môn tương tự; (c) điểm xét tốt nghiệp THPT ≥ ${HUB_LAW_GRADUATION_SCORE_THRESHOLD_10}/10.`,
  };
}

export { GROUP_LABELS as HUB_PROGRAM_GROUP_LABELS };
