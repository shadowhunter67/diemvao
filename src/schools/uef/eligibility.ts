/**
 * Mức điểm nhận hồ sơ UEF 2026 theo NHÓM NGÀNH (enum ổn định, không so khớp substring tên ngành —
 * cùng pattern `VluThresholdGroup`/`HuitThresholdGroup`). Danh mục ngành đầy đủ chưa import
 * (`uef-program-catalog-not-imported`); caller tự chọn group.
 */
export type UefThresholdGroup = 'standard' | 'law';

const GROUP_LABELS: Record<UefThresholdGroup, string> = {
  standard: 'các ngành ngoài khối Luật',
  law: 'Luật, Luật Kinh tế, Luật quốc tế, Luật Thương mại quốc tế',
};

/** Phương thức thi TN THPT 2026 — thang 30. */
const THPT_EXAM_THRESHOLD_30: Record<UefThresholdGroup, number> = { standard: 15, law: 20 };

/** Phương thức học bạ (6 học kỳ) — thang 30, nhóm `standard`. */
export const UEF_TRANSCRIPT_STANDARD_THRESHOLD_30 = 18;

export type UefAcademicRank = 'kha' | 'tot-gioi';
const RANK_ORDER: Record<UefAcademicRank, number> = { kha: 1, 'tot-gioi': 2 };

export const UEF_LAW_NON_THPT_ALT_THPT_TOTAL_30 = 18;
export const UEF_LAW_NON_THPT_ALT_GRADUATION_10 = 8.5;

export interface UefEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Phương thức thi TN THPT 2026. `totalScore30` = tổng 3 môn tổ hợp, chưa cộng điểm ưu tiên/cộng. */
export function checkUefThptExamThreshold(totalScore30: number, group: UefThresholdGroup): UefEligibilityResult {
  const min = THPT_EXAM_THRESHOLD_30[group];
  return {
    pass: totalScore30 >= min,
    requiredText: `Tổng điểm 3 môn tổ hợp thi TN THPT ≥ ${min} (thang 30, chưa cộng điểm ưu tiên/điểm cộng) — nhóm ngành ${GROUP_LABELS[group]}.`,
  };
}

/** Phương thức học bạ (6 học kỳ). Nhóm `standard`: đạt tổng điểm ≥18/30. Nhóm `law`: KHÔNG dùng
 * tổng điểm học bạ trực tiếp — cần ĐỒNG THỜI học lực lớp 12 Tốt/Giỏi trở lên VÀ (tổng 3 môn thi TN
 * THPT ≥18/30 HOẶC điểm xét tốt nghiệp THPT ≥8,5), cùng điều kiện áp dụng chung cho mọi phương thức
 * không dùng kết quả thi TN THPT (nguồn: `uef-quality-threshold-2026`). */
export function checkUefTranscriptEligibility(input: {
  group: UefThresholdGroup;
  transcriptTotal30?: number;
  academicRank12?: UefAcademicRank;
  thptExamTotal30?: number;
  graduationScore10?: number;
}): UefEligibilityResult {
  if (input.group === 'standard') {
    const pass = input.transcriptTotal30 !== undefined && input.transcriptTotal30 >= UEF_TRANSCRIPT_STANDARD_THRESHOLD_30;
    return {
      pass,
      requiredText: `Điểm trung bình tổ hợp 3 môn của 6 học kỳ ≥ ${UEF_TRANSCRIPT_STANDARD_THRESHOLD_30} (thang 30) — nhóm ngành ${GROUP_LABELS.standard}.`,
    };
  }

  const requiredText = `Học lực cả năm lớp 12 xếp loại Tốt/Giỏi trở lên VÀ (tổng 3 môn thi TN THPT theo tổ hợp ≥ ${UEF_LAW_NON_THPT_ALT_THPT_TOTAL_30}/30 HOẶC điểm xét tốt nghiệp THPT ≥ ${UEF_LAW_NON_THPT_ALT_GRADUATION_10}/10) — nhóm ngành ${GROUP_LABELS.law}, áp dụng cho phương thức không dùng kết quả thi TN THPT.`;

  const rankKnown = input.academicRank12 !== undefined;
  const rankPass = rankKnown && RANK_ORDER[input.academicRank12 as UefAcademicRank] >= RANK_ORDER['tot-gioi'];
  const altScorePass =
    (input.thptExamTotal30 !== undefined && input.thptExamTotal30 >= UEF_LAW_NON_THPT_ALT_THPT_TOTAL_30) ||
    (input.graduationScore10 !== undefined && input.graduationScore10 >= UEF_LAW_NON_THPT_ALT_GRADUATION_10);

  if (!rankKnown || (input.thptExamTotal30 === undefined && input.graduationScore10 === undefined)) {
    return { pass: false, requiredText };
  }

  return { pass: rankPass && altScorePass, requiredText };
}

export { GROUP_LABELS as UEF_THRESHOLD_GROUP_LABELS };
