/**
 * Ngưỡng đảm bảo chất lượng đầu vào VLU 2026 theo NHÓM NGÀNH (enum ổn định, không so khớp
 * substring tên ngành — cùng pattern `UfmThresholdGroup`/`HutechThresholdGroup`). Danh mục ngành
 * đầy đủ → nhóm chưa import (`vlu-program-catalog-not-imported`); caller (UI/comparison context)
 * tự chọn group cho tới khi có mapping thật.
 */
export type VluThresholdGroup = 'standard' | 'law' | 'medicine-dentistry' | 'pharmacy' | 'nursing-medlab';

const GROUP_LABELS: Record<VluThresholdGroup, string> = {
  standard: 'các ngành tiêu chuẩn/Global Standard',
  law: 'Luật, Luật Kinh tế',
  'medicine-dentistry': 'Y khoa, Răng - Hàm - Mặt',
  pharmacy: 'Dược học',
  'nursing-medlab': 'Điều dưỡng, Kỹ thuật Xét nghiệm Y học',
};

/** Phương thức 1 (thi TN THPT) — thang 30, CHƯA cộng điểm cộng/điểm ưu tiên (nguồn:
 * `vlu-quality-threshold-2026`, cross-check `vlu-admission-info-2026`). */
const THPT_EXAM_THRESHOLD_30: Record<VluThresholdGroup, number> = {
  standard: 15,
  law: 20,
  'medicine-dentistry': 22,
  pharmacy: 20,
  'nursing-medlab': 18,
};

export type VluAcademicRank = 'kha' | 'gioi';

const RANK_ORDER: Record<VluAcademicRank, number> = { kha: 1, gioi: 2 };
const RANK_LABELS: Record<VluAcademicRank, string> = { kha: 'khá', gioi: 'giỏi' };

interface VluTranscriptExtraRequirement {
  minRank: VluAcademicRank;
  /** Tổng 3 môn thi TN THPT theo tổ hợp xét tuyển (hoặc Toán+Văn+1 môn khác), thang 30. */
  altThptTotal30: number;
  /** Điểm xét tốt nghiệp THPT, thang 10. */
  altGraduationScore10: number;
}

/** Phương thức 2/3 (học bạ / kết hợp) — điều kiện BỔ SUNG, chỉ áp dụng khối Sức khỏe + Luật
 * (nguồn ghi rõ "không áp dụng đối với phương thức xét điểm thi tốt nghiệp THPT" — tức CHỈ áp
 * dụng PT2-PT5). Nhóm `standard` không có key ở đây = không có điều kiện bổ sung riêng. */
const TRANSCRIPT_EXTRA_REQUIREMENT: Partial<Record<VluThresholdGroup, VluTranscriptExtraRequirement>> = {
  law: { minRank: 'gioi', altThptTotal30: 18, altGraduationScore10: 8.5 },
  'medicine-dentistry': { minRank: 'gioi', altThptTotal30: 20, altGraduationScore10: 8.5 },
  pharmacy: { minRank: 'gioi', altThptTotal30: 20, altGraduationScore10: 8.5 },
  'nursing-medlab': { minRank: 'kha', altThptTotal30: 16.5, altGraduationScore10: 6.5 },
};

export interface VluEligibilityResult {
  pass: boolean;
  /** Mô tả ngưỡng đã áp dụng, để UI trích dẫn thay vì tự diễn giải. */
  requiredText: string;
}

/** Phương thức 1: Xét kết quả thi TN THPT 2026. `totalScore30` = tổng 3 môn tổ hợp (hoặc
 * Toán+Văn+1 môn khác), CHƯA cộng điểm ưu tiên/điểm cộng. */
export function checkVluThptExamThreshold(totalScore30: number, group: VluThresholdGroup): VluEligibilityResult {
  const min = THPT_EXAM_THRESHOLD_30[group];
  return {
    pass: totalScore30 >= min,
    requiredText: `Tổng điểm 3 môn tổ hợp thi TN THPT ≥ ${min} (thang 30, chưa cộng điểm ưu tiên/điểm cộng) — nhóm ngành ${GROUP_LABELS[group]}.`,
  };
}

/** Phương thức 2/3: Xét học bạ / xét tuyển kết hợp. Nhóm `standard`/Global Standard không có điều
 * kiện bổ sung riêng (luôn `pass: true` ở hàm này — vẫn phải qua ngưỡng sàn 15 điểm chung, không
 * kiểm tra lại ở đây vì đó là mặt bằng chung Bộ GD&ĐT, không phải rule riêng VLU). Nhóm Sức khỏe/
 * Luật cần CẢ học lực lớp 12 đạt tối thiểu VÀ (tổng 3 môn TN THPT thay thế HOẶC điểm xét tốt
 * nghiệp thay thế). */
export function checkVluTranscriptOrCombinedEligibility(input: {
  group: VluThresholdGroup;
  academicRank12?: VluAcademicRank;
  thptExamTotal30?: number;
  graduationScore10?: number;
}): VluEligibilityResult {
  const requirement = TRANSCRIPT_EXTRA_REQUIREMENT[input.group];
  if (!requirement) {
    return {
      pass: true,
      requiredText: `Không có điều kiện học lực/điểm TN THPT bổ sung riêng cho nhóm ${GROUP_LABELS[input.group]} ở phương thức học bạ/kết hợp (ngoài mức sàn chung 15 điểm áp dụng mọi phương thức).`,
    };
  }

  const rankKnown = input.academicRank12 !== undefined;
  const rankPass = rankKnown && RANK_ORDER[input.academicRank12 as VluAcademicRank] >= RANK_ORDER[requirement.minRank];
  const altScorePass =
    (input.thptExamTotal30 !== undefined && input.thptExamTotal30 >= requirement.altThptTotal30) ||
    (input.graduationScore10 !== undefined && input.graduationScore10 >= requirement.altGraduationScore10);

  const requiredText = `Học lực lớp 12 xếp loại ${RANK_LABELS[requirement.minRank]} trở lên VÀ (tổng 3 môn thi TN THPT ≥ ${requirement.altThptTotal30}/30 HOẶC điểm xét tốt nghiệp THPT ≥ ${requirement.altGraduationScore10}/10) — nhóm ngành ${GROUP_LABELS[input.group]}.`;

  if (!rankKnown || (input.thptExamTotal30 === undefined && input.graduationScore10 === undefined)) {
    return { pass: false, requiredText };
  }

  return { pass: rankPass && altScorePass, requiredText };
}

export { GROUP_LABELS as VLU_THRESHOLD_GROUP_LABELS };
