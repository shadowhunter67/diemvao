import type { AdmissionEvaluation } from '../../core/admissionEvaluation';
import type { CalculationStep } from '../../core/calculationStep';
import { calculateAdmissionScore, calculateAdmissionScoreNoDgnl, convertThptScore, convertTranscriptScore } from './calculator/calculator';
import { calculateAdmissionScoreFromWeightedDgnlRaw } from './calculator/targetCalculator';
import { activeAdmissionConfig } from './config/admission-2026';
import { hcmutAdmissionMethods } from './methods';
import { hcmutRuleEvidence } from './evidence';
import { getAbilityScoreLabel } from './abilityScoreLabel';
import type { AdmissionConfig, AdmissionInput, AdmissionResult } from './types/admission';

/**
 * `AdmissionEvaluation` chuẩn (core) không có chỗ cho breakdown chi tiết theo field (dgnl/thpt/
 * transcript/academic/bonus/priority) — UI hiện tại (`ScoreBreakdownDetails`, `CurrentScoreCard`,
 * `DgnlSection`...) cần đọc trực tiếp các field đó để hiển thị realtime per-section. Thay vì ép
 * generic `AdmissionEvaluation` phải "biết" shape của HCMUT (phá nguyên tắc không universal hóa),
 * dùng type mở rộng riêng HCMUT — đúng theo hướng ưu tiên type safety trong batch 3.
 */
export interface HcmutAdmissionEvaluation extends AdmissionEvaluation {
  result: AdmissionResult;
}

function baseEvidence(result: AdmissionResult) {
  return [
    ...hcmutRuleEvidence.weights.evidence,
    ...hcmutRuleEvidence.priorityReductionThreshold.evidence,
    ...hcmutRuleEvidence.bonusMaxTotal.evidence,
    ...(result.abilitySource === 'thpt-derived' ? hcmutRuleEvidence.noDgnlAbilityMultiplier.evidence : []),
  ];
}

function wrapResult(result: AdmissionResult, config: AdmissionConfig): HcmutAdmissionEvaluation {
  return {
    schoolId: 'hcmut',
    year: config.year,
    methodId: hcmutAdmissionMethods[0].id,
    confidence: 'exact-verified',
    score: { value: result.finalScore, scale: config.scoreScale },
    missingInputs: [],
    missingRules: [],
    explanation: buildHcmutExplanation(result, config),
    evidence: baseEvidence(result),
    result,
  };
}

/**
 * Đối tượng 2.1 (có ĐGNL, nhập chi tiết) — CHỈ đọc lại kết quả từ `calculateAdmissionScore`
 * (không tính lại công thức lần 2, không đổi hành vi calculator hiện tại).
 */
export function evaluateHcmutAdmission(input: AdmissionInput, config = activeAdmissionConfig): HcmutAdmissionEvaluation {
  return wrapResult(calculateAdmissionScore(input, config), config);
}

/**
 * Đối tượng 2.2 (không có ĐGNL) — wrap `calculateAdmissionScoreNoDgnl`, cùng nguyên tắc không
 * tính lại.
 */
export function evaluateHcmutNoDgnlAdmission(
  otherInputs: Omit<AdmissionInput, 'dgnl'>,
  config = activeAdmissionConfig
): HcmutAdmissionEvaluation {
  return wrapResult(calculateAdmissionScoreNoDgnl(otherInputs, config), config);
}

/**
 * Chế độ "Nhập tổng điểm ĐGNL" (weightedRaw đã có hệ số, không có 4 điểm thành phần thật) — dựng
 * lại đúng `AdmissionResult` từ `calculateAdmissionScoreFromWeightedDgnlRaw` (giữ nguyên logic đã
 * inline trước đây trong `HcmutCalculatorPage.tsx`, chuyển vào đây để UI không tự lắp lại shape
 * result nữa — không đổi số học, chỉ chuyển vị trí code).
 */
export function evaluateHcmutAdmissionFromWeightedDgnlRaw(
  weightedRaw: number,
  otherInputs: Omit<AdmissionInput, 'dgnl'>,
  config = activeAdmissionConfig
): HcmutAdmissionEvaluation {
  const simulated = calculateAdmissionScoreFromWeightedDgnlRaw(weightedRaw, otherInputs, config);
  const result: AdmissionResult = {
    dgnl: {
      rawScore: 0,
      weightedMath: 0,
      weightedScore: simulated.dgnlWeightedRawScore,
      normalizedScore: simulated.dgnlNormalizedScore,
    },
    thpt: convertThptScore(otherInputs.thpt, config),
    transcript: convertTranscriptScore(otherInputs.transcript, config),
    academic: simulated.academic,
    bonus: simulated.bonus,
    priority: simulated.priority,
    baseScore: simulated.baseScore,
    finalScore: simulated.finalScore,
    abilitySource: 'dgnl-vnuhcm',
  };
  return wrapResult(result, config);
}

function toPercent(weight: number): string {
  return `${Math.round(weight * 100)}%`;
}

function buildHcmutExplanation(result: AdmissionResult, config: AdmissionConfig): CalculationStep[] {
  const isThptDerived = result.abilitySource === 'thpt-derived';

  return [
    {
      id: 'ability',
      label: getAbilityScoreLabel(result),
      output: result.dgnl.normalizedScore,
      scale: config.scoreScale,
      formula: isThptDerived
        ? `THPT chuẩn hóa × ${config.noDgnl.abilityMultiplier}`
        : `(Tổng sau hệ số / ${config.dgnl.maxWeightedTotal}) × ${config.scoreScale}`,
      evidence: isThptDerived ? hcmutRuleEvidence.noDgnlAbilityMultiplier.evidence : undefined,
    },
    {
      id: 'thpt',
      label: 'Chuẩn hóa THPT',
      output: result.thpt.normalizedScore,
      scale: config.scoreScale,
      formula: `(Điểm trung bình có trọng số / ${config.thpt.maxPerSubject}) × ${config.scoreScale}`,
    },
    {
      id: 'transcript',
      label: 'Chuẩn hóa Học bạ (3 năm)',
      output: result.transcript.normalizedScore,
      scale: config.scoreScale,
      formula: `(Điểm trung bình có trọng số / ${config.transcript.maxPerSubject}) × ${config.scoreScale}`,
    },
    {
      id: 'academic',
      label: 'Điểm học lực',
      inputs: {
        dgnlContribution: result.academic.dgnlContribution,
        thptContribution: result.academic.thptContribution,
        transcriptContribution: result.academic.transcriptContribution,
      },
      output: result.academic.score,
      scale: config.scoreScale,
      formula: `${toPercent(config.weights.dgnl)}×${isThptDerived ? 'Điểm năng lực' : 'ĐGNL'} + ${toPercent(config.weights.thpt)}×THPT + ${toPercent(config.weights.transcript)}×Học bạ`,
      evidence: hcmutRuleEvidence.weights.evidence,
    },
    {
      id: 'bonus',
      label: 'Điểm cộng',
      output: result.bonus.received,
      scale: config.bonus.maxTotal,
      formula: `min(Thưởng + Xét thưởng + Khuyến khích, ${config.bonus.maxTotal})`,
      evidence: hcmutRuleEvidence.bonusMaxTotal.evidence,
    },
    {
      id: 'priority',
      label: 'Điểm ưu tiên KV/ĐT',
      output: result.priority.received,
      formula: `Giảm dần khi (điểm học lực + điểm cộng) ≥ ${config.priority.reductionThreshold}`,
      evidence: hcmutRuleEvidence.priorityReductionThreshold.evidence,
    },
    {
      id: 'final',
      label: 'Điểm xét tuyển',
      output: result.finalScore,
      scale: config.scoreScale,
      formula: `min(${config.scoreScale}, Điểm học lực + Điểm cộng + Ưu tiên)`,
    },
  ];
}
