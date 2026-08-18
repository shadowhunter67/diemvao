import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import type { SubjectId } from '../../core/subjects';
import { SUBJECT_LABELS } from '../../core/subjects';
import { hcmuteAdmissionMethods } from './methods';
import { hcmuteKnowledgeGaps } from './knowledgeGaps';
import { checkHcmuteGeneralThreshold, checkHcmuteTeacherOrLawThreshold, checkHcmuteLawMathOrLiteratureCondition, HCMUTE_TEACHER_OR_LAW_PROGRAM_IDS } from './eligibility';
import {
  calculateHcmuteAcademicScoreThptOnly,
  calculateHcmuteHly2Standard,
  calculateHcmuteHly3Standard,
  calculateHcmuteHly1English,
  calculateHcmuteHly2English,
  calculateHcmuteHly3English,
  calculateHcmuteHly1Design,
  calculateHcmuteHly2Design,
  calculateHcmuteHly3Design,
  calculateHcmuteHlyMax,
  type HcmuteHlyBranchWinner,
} from './calculator';
import { calculateHcmuteBonus, type HcmuteBonusInput } from './bonus';
import { calculateHcmuteEffectivePriority, lookupHcmuteStandardPriority } from './priority';
import { hcmuteHly2Evidence, hcmuteHly3Evidence } from './evidence';
import { resolveHcmuteFormulaGroup } from './formulaGroups';

export interface HcmuteEvaluationContext {
  subjectContext?: {
    combinationId?: string;
    mainSubjectId: SubjectId;
    /** 3 môn cho nhóm 'standard'/'english'; 2 môn cho nhóm 'design-architecture' (không gồm điểm
     * năng khiếu — xem `aptitudeScore`). */
    subjects: readonly SubjectId[];
  };
  /** Stable programId (`formulaGroups.ts:HCMUTE_PROGRAM_FORMULA_GROUP`) — bỏ trống = nhóm
   * 'standard' (đúng theo khung "phần bù" của Thông báo 2092/TB-ĐHCNKT). Truyền 1 chuỗi không
   * khớp map đã biết => evaluator trả `unavailable`, KHÔNG tự coi là 'standard'. */
  programId?: string;
  /** Điểm thi Năng khiếu (M_NK) — BẮT BUỘC cho nhóm 'design-architecture', cộng trực tiếp cả 3
   * nhánh HLy.1/2/3. */
  aptitudeScore?: number;
  /** Học lực lớp 12 xếp loại Tốt (giỏi trở lên)? — CHỈ cần khi `programId` thuộc
   * `eligibility.ts:HCMUTE_TEACHER_OR_LAW_PROGRAM_IDS` (SP tiếng Anh/SP công nghệ/Luật), các
   * ngành này dùng ngưỡng riêng thay vì ngưỡng chung 15/30. */
  grade12Excellent?: boolean;
  bonus?: HcmuteBonusInput;
  /** Nhánh HLy.2 (kết hợp học bạ). Thí sinh KHÔNG khai học bạ để xét kết hợp => bỏ trống field
   * này, nhánh HLy.2 ngoài phạm vi (không phải gap). Khai `scores` nhưng bỏ trống `dxtt30` =>
   * genuine gap, đánh dấu `missingInputs` (ĐXTT theo nhóm trường chưa import — `knowledgeGaps.ts`). */
  transcriptRoute?: {
    scores: Partial<Record<SubjectId, number>>;
    dxtt30?: number;
  };
  /** Nhánh HLy.3 (kết hợp ĐGNL). Không phụ thuộc ĐXTT — tính được ngay khi có điểm ĐGNL. */
  dgnlRoute?: {
    dgnlRawScore: number;
  };
}

function partialResult(input: {
  missingInputs: string[];
  missingRequirements: MissingRequirement[];
  explanation: CalculationStep[];
  eligibilityReason: string;
}): AdmissionEvaluation {
  return {
    schoolId: 'hcmute',
    year: hcmuteAdmissionMethods[0].year,
    methodId: hcmuteAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility: { status: 'unknown', reasons: [input.eligibilityReason] },
    missingInputs: input.missingInputs,
    missingRules: hcmuteKnowledgeGaps.map((gap) => gap.label),
    missingRequirements: input.missingRequirements,
    explanation: input.explanation,
    evidence: [],
  };
}

/**
 * Tính HLy.1 (luôn), HLy.2 nếu `context.transcriptRoute` được khai đủ (điểm học bạ + ĐXTT), HLy.3
 * nếu `context.dgnlRoute` được khai (không phụ thuộc ĐXTT) — rồi HLy.max = max{HLy.1, HLy.2, HLy.3}
 * dùng làm Học lực cho bước tính Điểm ưu tiên (xem `calculator.ts`). Formula group ('standard' /
 * 'english' / 'design-architecture') suy từ `context.programId` qua `formulaGroups.ts` — KHÔNG
 * parse tên ngành. `confidence` CỐ Ý giữ `'partial'` (không trả `score`) dù hệ số a/b đã verified
 * (`knowledgeGaps.ts` re-audit 2026-08-18) — lý do CHƯA cho phép claim exact: (1) ĐXTCN mục 1 và
 * mục 4-7 chưa implement (`bonus.ts`); (2) ĐHL chỉ tính cho 1 tổ hợp/lần gọi — ĐHL thật là max qua
 * MỌI tổ hợp hợp lệ của ngành, ngoài phạm vi 1 lần evaluate hiện tại. Ngưỡng đầu vào riêng SP tiếng
 * Anh/SP công nghệ/Luật (`eligibility.ts:checkHcmuteTeacherOrLawThreshold`) giờ ĐÃ wire cho nhóm
 * 'english' (SP tiếng Anh) — xem nhánh bên dưới; Luật/SP công nghệ vẫn dùng ngưỡng chung vì 2 ngành
 * này thuộc nhóm 'standard' và UniscoreVN chưa phân biệt được ngành cụ thể trong nhóm đó.
 */
export function evaluateHcmuteAdmission(profile: ApplicantProfile, context: HcmuteEvaluationContext = {}): AdmissionEvaluation {
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  const formulaGroup = resolveHcmuteFormulaGroup(context.programId);
  if (formulaGroup === 'unrecognized') {
    missingRequirements.push({
      kind: 'unsupported',
      code: 'hcmute-program-not-recognized',
      label: `Ngành "${context.programId}" chưa có trong danh mục nhóm công thức HCMUTE của UniscoreVN — chưa xác định được dùng công thức nhóm nào.`,
    });
    missingRequirements.push(...hcmuteKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));
    return partialResult({
      missingInputs: [`Ngành "${context.programId}" chưa nhận diện được nhóm công thức.`],
      missingRequirements,
      explanation,
      eligibilityReason: 'Chưa xác định được nhóm công thức của ngành này.',
    });
  }

  if (!context.subjectContext) {
    missingRequirements.push({ kind: 'school-context', code: 'hcmute-subject-combination', label: 'Chọn tổ hợp THPT HCMUTE (và môn chính) để đọc đúng điểm từ hồ sơ.' });
    missingRequirements.push(...hcmuteKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));
    return partialResult({
      missingInputs: ['Chọn tổ hợp THPT.'],
      missingRequirements,
      explanation,
      eligibilityReason: 'Cần chọn tổ hợp THPT để kiểm tra ngưỡng đầu vào.',
    });
  }

  const expectedSubjectCount = formulaGroup === 'design-architecture' ? 2 : 3;
  const { mainSubjectId, subjects } = context.subjectContext;
  if (subjects.length !== expectedSubjectCount) {
    missingRequirements.push({
      kind: 'school-context',
      code: 'hcmute-subject-count-mismatch',
      label: `Nhóm công thức '${formulaGroup}' cần đúng ${expectedSubjectCount} môn THPT, tổ hợp đã chọn có ${subjects.length} môn.`,
    });
    missingRequirements.push(...hcmuteKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));
    return partialResult({
      missingInputs: [`Tổ hợp cần đúng ${expectedSubjectCount} môn cho nhóm '${formulaGroup}'.`],
      missingRequirements,
      explanation,
      eligibilityReason: 'Tổ hợp môn không khớp nhóm công thức đã chọn.',
    });
  }

  if (formulaGroup === 'design-architecture' && context.aptitudeScore === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: 'hcmute-aptitude-score', label: 'Điểm thi Năng khiếu (M_NK) — bắt buộc cho nhóm Kiến trúc/Kiến trúc Nội thất/Thiết kế đồ họa/Thiết kế thời trang.' });
    missingRequirements.push(...hcmuteKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));
    return partialResult({
      missingInputs: ['Điểm thi Năng khiếu (M_NK) chưa có.'],
      missingRequirements,
      explanation,
      eligibilityReason: 'Cần điểm thi Năng khiếu để tính Điểm học lực nhóm Kiến trúc/Thiết kế.',
    });
  }

  const scores: Partial<Record<SubjectId, number>> = {};
  const missingSubjects: SubjectId[] = [];
  for (const subjectId of subjects) {
    const score = profile.thpt?.scores?.[subjectId];
    if (score === undefined) missingSubjects.push(subjectId);
    else scores[subjectId] = score;
  }

  if (missingSubjects.length > 0) {
    missingInputs.push(`Chưa đủ điểm ${expectedSubjectCount} môn THPT trong tổ hợp HCMUTE đã chọn.`);
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `hcmute-thpt-${subjectId}`,
        label: `Điểm thi TN THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HCMUTE.`,
      }))
    );
    missingRequirements.push(...hcmuteKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));
    return partialResult({
      missingInputs,
      missingRequirements,
      explanation,
      eligibilityReason: 'Cần đủ điểm TN THPT theo tổ hợp để kiểm tra ngưỡng đầu vào.',
    });
  }

  const orderedScores = subjects.map((id) => scores[id] ?? 0);

  // --- Ngưỡng đầu vào ---------------------------------------------------
  let eligibilityStatus: 'eligible' | 'ineligible' | 'unknown' = 'unknown';
  let eligibilityReason: string;
  if (formulaGroup === 'design-architecture') {
    // Ngưỡng riêng nhóm Kiến trúc/Thiết kế (có thể gồm cả điều kiện Năng khiếu) CHƯA verified
    // trong batch này — không áp ngưỡng chung 15/30 (sai vì tổng chỉ có 2 môn, không phải 3).
    eligibilityReason = 'Ngưỡng đầu vào riêng nhóm Kiến trúc/Kiến trúc Nội thất/Thiết kế đồ họa/Thiết kế thời trang chưa verified — chưa kiểm tra được.';
  } else {
    const totalScore30 = round2Sum(orderedScores);
    if (context.programId !== undefined && HCMUTE_TEACHER_OR_LAW_PROGRAM_IDS.has(context.programId)) {
      if (context.grade12Excellent === undefined) {
        missingInputs.push('Cần xác nhận học lực lớp 12 (xếp loại Tốt/giỏi trở lên hay không) để kiểm tra ngưỡng riêng SP tiếng Anh/SP công nghệ/Luật.');
        missingRequirements.push({ kind: 'profile-input', code: 'hcmute-grade12-excellent', label: 'Học lực lớp 12 xếp loại Tốt (giỏi trở lên)?' });
        eligibilityReason = 'Cần xác nhận học lực lớp 12 để kiểm tra ngưỡng riêng SP tiếng Anh/SP công nghệ/Luật.';
      } else {
        const special = checkHcmuteTeacherOrLawThreshold({ grade12Excellent: context.grade12Excellent, totalScore30 });
        let pass = special.pass;
        const reasonParts = [special.requiredText];
        if (context.programId === 'luat') {
          const mathScore = scores.math;
          const literatureScore = scores.literature;
          const mathOrLiterature = mathScore !== undefined || literatureScore !== undefined ? Math.max(mathScore ?? -Infinity, literatureScore ?? -Infinity) : undefined;
          if (mathOrLiterature === undefined) {
            missingInputs.push('Cần điểm Toán hoặc Ngữ văn trong tổ hợp để kiểm tra điều kiện riêng ngành Luật.');
            missingRequirements.push({ kind: 'profile-input', code: 'hcmute-law-math-or-literature', label: 'Điểm Toán hoặc Ngữ văn trong tổ hợp (điều kiện riêng ngành Luật).' });
          } else {
            const lawCondition = checkHcmuteLawMathOrLiteratureCondition(mathOrLiterature);
            pass = pass && lawCondition.pass;
            reasonParts.push(lawCondition.requiredText);
          }
        }
        eligibilityStatus = pass ? 'eligible' : 'ineligible';
        eligibilityReason = reasonParts.join(' và ');
      }
      explanation.push({ id: 'hcmute-eligibility-threshold', label: 'Ngưỡng đầu vào riêng (SP tiếng Anh/SP công nghệ/Luật)', output: totalScore30, scale: 30, formula: eligibilityReason });
    } else {
      const threshold = checkHcmuteGeneralThreshold(totalScore30);
      eligibilityStatus = threshold.pass ? 'eligible' : 'ineligible';
      eligibilityReason = threshold.requiredText;
      explanation.push({ id: 'hcmute-eligibility-threshold', label: 'Ngưỡng đầu vào HCMUTE 2026', output: totalScore30, scale: 30, formula: threshold.requiredText });
    }
  }

  // --- HLy.1/2/3/max theo nhóm công thức ---------------------------------
  let hly1: number;
  let hly2: number | undefined;
  let hly3: number | undefined;
  let hlyFormulaText1: string;
  let hlyFormulaText2: string;
  let hlyFormulaText3: string;

  if (formulaGroup === 'english') {
    const [s1, s2, s3] = orderedScores;
    hly1 = calculateHcmuteHly1English({ subject1Score: s1, subject2Score: s2, subject3Score: s3 });
    hlyFormulaText1 = 'MT1 + MT2 + MT3 (không nhân hệ số môn chính)';
    hlyFormulaText2 = '0,8×(MT1+MT2+MT3) + 0,2×(MH1+MH2+MH3) + ĐXTT';
    hlyFormulaText3 = '0,8×(MT1+MT2+MT3) + 0,2×(ĐG/40)';

    if (context.transcriptRoute) {
      const transcriptMissing = subjects.filter((id) => context.transcriptRoute?.scores[id] === undefined);
      if (transcriptMissing.length > 0) {
        missingInputs.push('Chưa đủ điểm học bạ trong tổ hợp để tính HLy.2 (kết hợp học bạ).');
        missingRequirements.push(
          ...transcriptMissing.map((subjectId) => ({ kind: 'profile-input' as const, code: `hcmute-transcript-${subjectId}`, label: `Điểm học bạ môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HCMUTE.` }))
        );
      } else if (context.transcriptRoute.dxtt30 === undefined) {
        missingInputs.push('Cần khai Điểm xét thưởng nhóm trường (ĐXTT, hoặc xác nhận 0 nếu không thuộc diện) để tính HLy.2.');
        missingRequirements.push({ kind: 'profile-input', code: 'hcmute-dxtt', label: 'Điểm xét thưởng nhóm trường (ĐXTT) — nhập 0 nếu không thuộc diện Bảng 3.' });
      } else {
        const [t1, t2, t3] = subjects.map((id) => context.transcriptRoute?.scores[id] ?? 0);
        hly2 = calculateHcmuteHly2English({ thpt: { subject1Score: s1, subject2Score: s2, subject3Score: s3 }, transcript: { subject1Score: t1, subject2Score: t2, subject3Score: t3 }, dxtt30: context.transcriptRoute.dxtt30 });
      }
    }
    if (context.dgnlRoute) {
      hly3 = calculateHcmuteHly3English({ thpt: { subject1Score: s1, subject2Score: s2, subject3Score: s3 }, dgnlRawScore: context.dgnlRoute.dgnlRawScore });
    }
  } else if (formulaGroup === 'design-architecture') {
    const [s1, s2] = orderedScores;
    const aptitudeScore = context.aptitudeScore as number;
    hly1 = calculateHcmuteHly1Design({ subject1Score: s1, subject2Score: s2, aptitudeScore });
    hlyFormulaText1 = 'MT1 + MT2 + M_NK';
    hlyFormulaText2 = '0,8×(MT1+MT2) + 0,2×(MH1+MH2) + ĐXTT + M_NK';
    hlyFormulaText3 = '0,8×(MT1+MT2) + 0,2×(ĐG/60) + M_NK';

    if (context.transcriptRoute) {
      const transcriptMissing = subjects.filter((id) => context.transcriptRoute?.scores[id] === undefined);
      if (transcriptMissing.length > 0) {
        missingInputs.push('Chưa đủ điểm học bạ trong tổ hợp để tính HLy.2 (kết hợp học bạ).');
        missingRequirements.push(
          ...transcriptMissing.map((subjectId) => ({ kind: 'profile-input' as const, code: `hcmute-transcript-${subjectId}`, label: `Điểm học bạ môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HCMUTE.` }))
        );
      } else if (context.transcriptRoute.dxtt30 === undefined) {
        missingInputs.push('Cần khai Điểm xét thưởng nhóm trường (ĐXTT, hoặc xác nhận 0 nếu không thuộc diện) để tính HLy.2.');
        missingRequirements.push({ kind: 'profile-input', code: 'hcmute-dxtt', label: 'Điểm xét thưởng nhóm trường (ĐXTT) — nhập 0 nếu không thuộc diện Bảng 3.' });
      } else {
        const [t1, t2] = subjects.map((id) => context.transcriptRoute?.scores[id] ?? 0);
        hly2 = calculateHcmuteHly2Design({ thpt: { subject1Score: s1, subject2Score: s2 }, transcript: { subject1Score: t1, subject2Score: t2 }, dxtt30: context.transcriptRoute.dxtt30, aptitudeScore });
      }
    }
    if (context.dgnlRoute) {
      hly3 = calculateHcmuteHly3Design({ thpt: { subject1Score: s1, subject2Score: s2 }, dgnlRawScore: context.dgnlRoute.dgnlRawScore, aptitudeScore });
    }
  } else {
    const secondary = subjects.filter((id) => id !== mainSubjectId);
    const thptInput = { mainSubjectScore: scores[mainSubjectId] ?? 0, subject2Score: scores[secondary[0]] ?? 0, subject3Score: scores[secondary[1]] ?? 0 };
    hly1 = calculateHcmuteAcademicScoreThptOnly(thptInput);
    hlyFormulaText1 = '[(Môn chính×2 + Môn 2 + Môn 3) / 4] × 3';
    hlyFormulaText2 = '0,8×[(MT1×2+MT2+MT3)/4]×3 + 0,2×[(MH1×2+MH2+MH3)/4]×3 + ĐXTT';
    hlyFormulaText3 = '0,8×[(MT1×2+MT2+MT3)/4]×3 + 0,2×(ĐG/40)';

    if (context.transcriptRoute) {
      const transcriptMissing = subjects.filter((id) => context.transcriptRoute?.scores[id] === undefined);
      if (transcriptMissing.length > 0) {
        missingInputs.push('Chưa đủ điểm học bạ trong tổ hợp để tính HLy.2 (kết hợp học bạ).');
        missingRequirements.push(
          ...transcriptMissing.map((subjectId) => ({ kind: 'profile-input' as const, code: `hcmute-transcript-${subjectId}`, label: `Điểm học bạ môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp HCMUTE.` }))
        );
      } else if (context.transcriptRoute.dxtt30 === undefined) {
        missingInputs.push('Cần khai Điểm xét thưởng nhóm trường (ĐXTT, hoặc xác nhận 0 nếu không thuộc diện) để tính HLy.2.');
        missingRequirements.push({ kind: 'profile-input', code: 'hcmute-dxtt', label: 'Điểm xét thưởng nhóm trường (ĐXTT) — nhập 0 nếu không thuộc diện Bảng 3.' });
      } else {
        hly2 = calculateHcmuteHly2Standard({
          thpt: thptInput,
          transcript: {
            mainSubjectScore: context.transcriptRoute.scores[mainSubjectId] ?? 0,
            subject2Score: context.transcriptRoute.scores[secondary[0]] ?? 0,
            subject3Score: context.transcriptRoute.scores[secondary[1]] ?? 0,
          },
          dxtt30: context.transcriptRoute.dxtt30,
        });
      }
    }
    if (context.dgnlRoute) {
      hly3 = calculateHcmuteHly3Standard({ thpt: thptInput, dgnlRawScore: context.dgnlRoute.dgnlRawScore });
    }
  }

  explanation.push({
    id: 'hcmute-academic-score-hly1',
    label: 'Điểm học lực HLy.1 (TN THPT độc lập)',
    output: hly1,
    scale: 30,
    formula: hlyFormulaText1,
    description: 'HLy.1 (route TN THPT độc lập) — nếu thí sinh cũng khai học bạ/ĐGNL, xem thêm HLy.2/HLy.3/HLy.max bên dưới.',
  });
  if (hly2 !== undefined) {
    explanation.push({ id: 'hcmute-academic-score-hly2', label: 'Điểm học lực HLy.2 (kết hợp học bạ)', output: hly2, scale: 30, formula: hlyFormulaText2, evidence: hcmuteHly2Evidence.evidence });
  }
  if (hly3 !== undefined) {
    explanation.push({ id: 'hcmute-academic-score-hly3', label: 'Điểm học lực HLy.3 (kết hợp ĐGNL)', output: hly3, scale: 30, formula: hlyFormulaText3, evidence: hcmuteHly3Evidence.evidence });
  }

  const hlyMax = calculateHcmuteHlyMax({ hly1, hly2, hly3 });
  let hlyMaxWinner: HcmuteHlyBranchWinner = hlyMax.winner;
  if (hly2 !== undefined || hly3 !== undefined) {
    explanation.push({
      id: 'hcmute-academic-score-hly-max',
      label: 'Điểm học lực theo tổ hợp (HLy.max)',
      output: hlyMax.value,
      scale: 30,
      formula: 'max{HLy.1, HLy.2, HLy.3}',
      description: `Nhánh cao nhất: ${hlyMaxWinner}.`,
    });
  }

  const bonus = calculateHcmuteBonus(context.bonus ?? {});
  explanation.push({ id: 'hcmute-bonus', label: 'Điểm cộng ĐXTCN', output: bonus, scale: 30, formula: 'Giải HSG cấp tỉnh hoặc khuyến khích HSG quốc gia, chỉ 1 thành tích cao nhất, trần 3,00' });

  const standardPriority = lookupHcmuteStandardPriority(profile.priority?.region, profile.priority?.category);
  const priority = calculateHcmuteEffectivePriority({ academicPlusBonus30: hlyMax.value + bonus, standardPriority30: standardPriority });
  explanation.push({
    id: 'hcmute-priority',
    label: priority.reduced ? 'Điểm ưu tiên đã giảm' : 'Điểm ưu tiên',
    output: priority.effectivePriority30,
    scale: 30,
    formula: priority.reduced ? '[(30,00 – Học lực – Cộng)/7,50] × Mức ưu tiên' : 'Mức điểm ưu tiên quy đổi',
  });

  missingRequirements.push(...hcmuteKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));

  return {
    schoolId: 'hcmute',
    year: hcmuteAdmissionMethods[0].year,
    methodId: hcmuteAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility: { status: eligibilityStatus, reasons: [eligibilityReason] },
    missingInputs,
    missingRules: hcmuteKnowledgeGaps.map((gap) => gap.label),
    missingRequirements,
    explanation,
    evidence: [
      { sourceId: 'hcmute-admission-info-2026', location: 'Bảng 4/5/6, công thức HLy.1', verification: 'verified', effectiveYear: 2026, verifiedAt: '2026-08-18' },
      { sourceId: 'hcmute-priority-appendix-2026', location: 'Phụ lục 1/2', verification: 'verified', effectiveYear: 2026, verifiedAt: '2026-08-18' },
      ...(hly2 !== undefined ? hcmuteHly2Evidence.evidence : []),
      ...(hly3 !== undefined ? hcmuteHly3Evidence.evidence : []),
    ],
  };
}

function round2Sum(values: number[]): number {
  return Math.round(values.reduce((sum, value) => sum + value, 0) * 100) / 100;
}
