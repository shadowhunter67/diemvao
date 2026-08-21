/**
 * Ngưỡng điểm sàn NTTU 2026 (phương thức học bạ) theo NHÓM NGÀNH (enum ổn định, không so khớp
 * substring tên ngành — cùng pattern `VluThresholdGroup`/`HubProgramGroup`). Danh mục ngành đầy đủ
 * → nhóm chưa import (`nttu-program-catalog-not-imported`); caller (UI/comparison context) tự chọn
 * group cho tới khi có mapping thật.
 */
export type NttuThresholdGroup = 'standard' | 'law' | 'medicine' | 'dentistry' | 'traditional-medicine-pharmacy' | 'nursing-prevention';

const GROUP_LABELS: Record<NttuThresholdGroup, string> = {
  standard: 'các ngành còn lại',
  law: 'Luật, Luật Kinh tế, Luật Kinh tế (Chuẩn quốc tế)',
  medicine: 'Y khoa',
  dentistry: 'Răng - Hàm - Mặt',
  'traditional-medicine-pharmacy': 'Y học cổ truyền, Dược học',
  'nursing-prevention': 'Điều dưỡng, Y học dự phòng, Kỹ thuật xét nghiệm y học, Kỹ thuật phục hồi chức năng',
};

/** Phương thức học bạ — thang 30 (nguồn: `nttu-quality-threshold-2026`). */
const TRANSCRIPT_THRESHOLD_30: Record<NttuThresholdGroup, number> = {
  standard: 18,
  law: 18,
  medicine: 23,
  dentistry: 23,
  'traditional-medicine-pharmacy': 21,
  'nursing-prevention': 19,
};

export type NttuAcademicRank = 'kha' | 'tot';
const RANK_ORDER: Record<NttuAcademicRank, number> = { kha: 1, tot: 2 };
const RANK_LABELS: Record<NttuAcademicRank, string> = { kha: 'khá', tot: 'tốt' };

interface NttuTranscriptExtraRequirement {
  minRank: NttuAcademicRank;
  /** Tổng 3 môn thi TN THPT theo tổ hợp xét tuyển, thang 30. */
  altThptTotal30: number;
  /** Điểm xét tốt nghiệp THPT, thang 10. */
  altGraduationScore10: number;
}

/** Điều kiện BỔ SUNG, chỉ áp dụng nhóm Sức khỏe + Luật (nhóm `standard` không có điều kiện riêng). */
const TRANSCRIPT_EXTRA_REQUIREMENT: Partial<Record<NttuThresholdGroup, NttuTranscriptExtraRequirement>> = {
  law: { minRank: 'tot', altThptTotal30: 18, altGraduationScore10: 8.5 },
  medicine: { minRank: 'tot', altThptTotal30: 20, altGraduationScore10: 8.5 },
  dentistry: { minRank: 'tot', altThptTotal30: 20, altGraduationScore10: 8.5 },
  'traditional-medicine-pharmacy': { minRank: 'tot', altThptTotal30: 20, altGraduationScore10: 8.5 },
  'nursing-prevention': { minRank: 'kha', altThptTotal30: 16.5, altGraduationScore10: 6.5 },
};

export interface NttuEligibilityResult {
  pass: boolean;
  requiredText: string;
}

/** Phương thức học bạ: đạt tổng điểm sàn VÀ (nếu thuộc nhóm có điều kiện bổ sung) đạt học lực lớp
 * 12 tối thiểu + (tổng 3 môn TN THPT thay thế HOẶC điểm xét tốt nghiệp thay thế). */
export function checkNttuTranscriptEligibility(input: {
  group: NttuThresholdGroup;
  transcriptTotal30?: number;
  academicRank12?: NttuAcademicRank;
  thptExamTotal30?: number;
  graduationScore10?: number;
}): NttuEligibilityResult {
  const min = TRANSCRIPT_THRESHOLD_30[input.group];
  const requirement = TRANSCRIPT_EXTRA_REQUIREMENT[input.group];

  const baseText = `Tổng điểm học bạ theo tổ hợp xét tuyển ≥ ${min} (thang 30) — nhóm ngành ${GROUP_LABELS[input.group]}.`;
  if (!requirement) {
    const pass = input.transcriptTotal30 !== undefined && input.transcriptTotal30 >= min;
    return { pass, requiredText: baseText };
  }

  const extraText = `Học lực lớp 12 xếp loại ${RANK_LABELS[requirement.minRank]} trở lên VÀ (tổng 3 môn thi TN THPT ≥ ${requirement.altThptTotal30}/30 HOẶC điểm xét tốt nghiệp THPT ≥ ${requirement.altGraduationScore10}/10).`;
  const requiredText = `${baseText} Đồng thời: ${extraText}`;

  const basePass = input.transcriptTotal30 !== undefined && input.transcriptTotal30 >= min;
  const rankKnown = input.academicRank12 !== undefined;
  const rankPass = rankKnown && RANK_ORDER[input.academicRank12 as NttuAcademicRank] >= RANK_ORDER[requirement.minRank];
  const altScorePass =
    (input.thptExamTotal30 !== undefined && input.thptExamTotal30 >= requirement.altThptTotal30) ||
    (input.graduationScore10 !== undefined && input.graduationScore10 >= requirement.altGraduationScore10);

  if (input.transcriptTotal30 === undefined || !rankKnown || (input.thptExamTotal30 === undefined && input.graduationScore10 === undefined)) {
    return { pass: false, requiredText };
  }

  return { pass: basePass && rankPass && altScorePass, requiredText };
}

export { GROUP_LABELS as NTTU_THRESHOLD_GROUP_LABELS };
