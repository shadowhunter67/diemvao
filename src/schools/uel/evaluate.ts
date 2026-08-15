import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { SUBJECT_LABELS } from '../../core/subjects';
import type { UelSubjectContext } from './applicantProfileAdapter';
import { buildUelEvaluationInput } from './applicantProfileAdapter';
import { convertDgnlToScale100 } from './dgnlConversion';
import { checkThptThreshold } from './eligibility';
import { uelAdmissionMethods } from './methods';
import { uelKnowledgeGaps } from './knowledgeGaps';
import { calculateUelFinalScore, lookupUelStandardPriority, type UelApplicantType } from './calculator';
import { lookupUelCertificateBonus } from './bonus';

export interface UelEvaluationContext {
  subjectContext?: UelSubjectContext;
  applicantType?: UelApplicantType;
  prioritySchool?: boolean;
}

export function evaluateUelAdmission(profile: ApplicantProfile, context: UelEvaluationContext = {}): AdmissionEvaluation {
  const input = buildUelEvaluationInput(profile, context.subjectContext);
  const explanation: CalculationStep[] = [];
  const missingInputs: string[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (input.dgnlScore !== undefined) {
    const converted = convertDgnlToScale100(input.dgnlScore);
    explanation.push({
      id: 'uel-dgnl-scale-100',
      label: 'Quy đổi ĐGNL-HCM sang thang 100',
      inputs: { dgnlRaw: input.dgnlScore },
      output: converted ?? undefined,
      scale: 100,
      formula: 'Điểm bài thi ĐGNL × 100/1200',
    });
  } else {
    const label = 'Điểm ĐGNL ĐHQG-HCM nếu xét theo đối tượng có ĐGNL.';
    missingInputs.push(label);
    missingRequirements.push({ kind: 'profile-input', code: 'uel-dgnl', label });
  }

  if (context.subjectContext && input.thptRawTotal30 !== undefined) {
    const normalized = (input.thptRawTotal30 * 100) / 30;
    const threshold = checkThptThreshold(input.thptRawTotal30);
    explanation.push({
      id: 'uel-thpt-scale-100',
      label: `THPT ${context.subjectContext.combinationId ?? 'theo tổ hợp'} quy đổi thang 100`,
      inputs: { thptTotal30: input.thptRawTotal30 },
      output: normalized,
      scale: 100,
      formula: 'Tổng điểm 3 môn tổ hợp × 100/30',
      description: `${threshold.requiredText}${threshold.pass ? ' - đạt' : ' - chưa đạt'}.`,
    });
  } else if (context.subjectContext) {
    const label = 'Chưa đủ 3 môn THPT trong tổ hợp đã chọn.';
    const missingSubjects = context.subjectContext.subjects.filter((subjectId) => input.thptSubjectScores?.[subjectId] === undefined);
    missingInputs.push(label);
    missingRequirements.push(
      ...missingSubjects.map((subjectId) => ({
        kind: 'profile-input' as const,
        code: `uel-thpt-${subjectId}`,
        label: `Điểm THPT môn ${SUBJECT_LABELS[subjectId]} cho tổ hợp ${context.subjectContext?.combinationId ?? 'đã chọn'}.`,
      }))
    );
  } else {
    const label = 'Chưa chọn tổ hợp THPT để UEL đọc đúng các môn từ hồ sơ.';
    missingInputs.push(label);
    missingRequirements.push({ kind: 'school-context', code: 'uel-subject-combination', label });
  }

  if (context.subjectContext && input.transcriptTotal30 !== undefined) {
    explanation.push({
      id: 'uel-transcript-scale-100',
      label: `Hoc ba ${context.subjectContext.combinationId ?? 'theo to hop'} quy doi thang 100`,
      inputs: { transcriptTotal30: input.transcriptTotal30 },
      output: (input.transcriptTotal30 * 100) / 30,
      scale: 100,
      formula: 'Tong diem trung binh 6 hoc ky cua 3 mon to hop x 100/30',
    });
  } else if (context.subjectContext) {
    const label = 'Chua du hoc ba 3 nam cho 3 mon trong to hop da chon.';
    missingInputs.push(label);
    missingRequirements.push({ kind: 'profile-input', code: 'uel-transcript', label });
  }

  const applicantType = context.applicantType ?? (input.dgnlScore !== undefined ? 'dt1' : 'dt2');
  const dgnlScale100 = input.dgnlScore !== undefined ? convertDgnlToScale100(input.dgnlScore) : null;
  const thptScale100 = input.thptRawTotal30 !== undefined ? (input.thptRawTotal30 * 100) / 30 : undefined;
  const transcriptScale100 = input.transcriptTotal30 !== undefined ? (input.transcriptTotal30 * 100) / 30 : undefined;
  const hasNeededRouteInput =
    applicantType === 'dt1'
      ? dgnlScale100 !== null && thptScale100 !== undefined
      : applicantType === 'dt2'
        ? thptScale100 !== undefined
        : dgnlScale100 !== null;

  if (!hasNeededRouteInput) {
    const label =
      applicantType === 'dt2'
        ? 'Can diem THPT cho Doi tuong 2 UEL.'
        : applicantType === 'dt3'
          ? 'Can diem DGNL cho Doi tuong 3 UEL.'
          : 'Can ca diem DGNL va THPT cho Doi tuong 1 UEL.';
    if (!missingInputs.includes(label)) missingInputs.push(label);
    missingRequirements.push({ kind: 'profile-input', code: `uel-${applicantType}-route-input`, label });
  }

  if (hasNeededRouteInput && transcriptScale100 !== undefined) {
    const certificateBonus = lookupUelCertificateBonus({
      ielts: profile.certificates?.ielts,
      toeflIbt: profile.certificates?.toeflIbt,
      toeic: profile.certificates?.toeic,
    });
    const result = calculateUelFinalScore({
      applicantType,
      dgnlScale100: dgnlScale100 ?? undefined,
      thptScale100,
      transcriptScale100,
      certificateBonus,
      prioritySchool: context.prioritySchool,
      standardPriority100: lookupUelStandardPriority(profile.priority?.region, profile.priority?.category),
    });
    explanation.push(
      {
        id: 'uel-academic-score',
        label: `Diem hoc luc UEL ${applicantType.toUpperCase()}`,
        output: result.academicScore,
        scale: 100,
        formula:
          applicantType === 'dt1'
            ? 'X x 55% + Y x 35% + Z x 10%'
            : applicantType === 'dt2'
              ? '(Y x alpha) x 55% + Y x 35% + Z x 10%'
              : 'X x 55% + X x 35% + Z x 10%',
      },
      {
        id: 'uel-bonus',
        label: 'Diem cong UEL',
        output: result.bonus,
        scale: 100,
        formula: 'Chung chi tieng Anh + 149 truong, tong diem cong toi da 10/100',
      },
      {
        id: 'uel-priority',
        label: result.priority.reduced ? 'Diem uu tien UEL da giam' : 'Diem uu tien UEL',
        output: result.priority.effectivePriority,
        scale: 100,
        formula: result.priority.reduced ? '(100 - Diem hoc luc - Diem cong) / 25 x Diem uu tien quy doi' : 'Diem uu tien quy doi',
      },
      { id: 'uel-final', label: 'Diem xet tuyen cuoi cung UEL', output: result.finalScore, scale: 100 }
    );

    return {
      schoolId: 'uel',
      year: uelAdmissionMethods[0].year,
      methodId: uelAdmissionMethods[0].id,
      confidence: 'exact-verified',
      score: { value: result.finalScore, scale: 100 },
      eligibility:
        input.thptRawTotal30 !== undefined
          ? { status: checkThptThreshold(input.thptRawTotal30).pass ? 'eligible' : 'ineligible', reasons: [checkThptThreshold(input.thptRawTotal30).requiredText] }
          : { status: 'unknown', reasons: ['Doi tuong nay khong co diem THPT de kiem tra nguong THPT.'] },
      missingInputs: [],
      missingRules: [],
      missingRequirements: [],
      explanation,
      evidence: [
        { sourceId: 'uel-formula-2026', location: 'Cong thuc tong hop UEL 2026', verification: 'verified', effectiveYear: 2026, verifiedAt: '2026-08-15' },
        { sourceId: 'uel-certificate-bonus-html-2026', location: 'Bang diem cong chung chi tieng Anh HTML', verification: 'verified', effectiveYear: 2026, verifiedAt: '2026-08-15' },
      ],
    };
  }

  missingRequirements.push(...uelKnowledgeGaps.map((gap) => ({ kind: 'official-rule' as const, code: gap.id, label: gap.label })));

  return {
    schoolId: 'uel',
    year: uelAdmissionMethods[0].year,
    methodId: uelAdmissionMethods[0].id,
    confidence: 'partial',
    eligibility:
      context.subjectContext && input.thptRawTotal30 !== undefined
        ? {
            status: checkThptThreshold(input.thptRawTotal30).pass ? 'eligible' : 'ineligible',
            reasons: [checkThptThreshold(input.thptRawTotal30).requiredText],
          }
        : { status: 'unknown', reasons: ['Cần đủ tổng 3 môn THPT theo tổ hợp để kiểm tra ngưỡng đầu vào.'] },
    missingInputs,
    missingRules: uelKnowledgeGaps.map((gap) => gap.label),
    missingRequirements,
    explanation,
    evidence: [
      {
        sourceId: 'uel-formula-2026',
        location: 'Công thức xét tuyển tổng hợp và ghi chú X/Y/Z',
        verification: 'verified',
        effectiveYear: 2026,
        verifiedAt: '2026-08-13',
      },
    ],
  };
}
