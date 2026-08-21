import type { AdmissionEvaluation, MissingRequirement } from '../../core/admissionEvaluation';
import type { ApplicantProfile } from '../../core/applicantProfile';
import type { CalculationStep } from '../../core/calculationStep';
import { round2 } from '../../core/round2';
import { checkFtuDomesticExamThreshold, convertFtuDomesticExamToBaseScore, scaleFtuBonus30, type FtuDomesticExam, type FtuProgramGroup } from './calculator';
import { ftuAdmissionMethods } from './methods';
import { lookupFtuStandardPriority30, calculateFtuEffectivePriority } from './priority';
import { ftuDomesticExamFormulaEvidence, ftuDomesticExamThresholdEvidence, ftuPriorityAndBonusEvidence } from './evidence';

export interface FtuDomesticExamEvaluationContext {
  exam?: FtuDomesticExam;
  rawScore?: number;
  programGroup?: FtuProgramGroup;
  bonus30?: number;
}

export function evaluateFtuDomesticExamAdmission(profile: ApplicantProfile, context: FtuDomesticExamEvaluationContext = {}): AdmissionEvaluation {
  const method = ftuAdmissionMethods[0];
  const exam = context.exam ?? 'vact';
  const rawScore = context.rawScore ?? (exam === 'vact' ? profile.exams?.vact?.total : undefined);
  const programGroup = context.programGroup ?? 'standard30';
  const scale = programGroup === 'integrated40' ? 40 : 30;
  const explanation: CalculationStep[] = [];
  const missingRequirements: MissingRequirement[] = [];

  if (rawScore === undefined) {
    missingRequirements.push({ kind: 'profile-input', code: `ftu-${exam}`, label: `FTU ${exam.toUpperCase()} 2026 score.` });
    return {
      schoolId: 'ftu',
      year: method.year,
      methodId: method.id,
      confidence: 'unavailable',
      eligibility: { status: 'unknown', reasons: ['Domestic aptitude/thinking exam score is required for FTU.'] },
      missingInputs: ['Missing domestic aptitude/thinking exam score.'],
      missingRules: [],
      missingRequirements,
      explanation,
      evidence: [],
    };
  }

  const threshold = checkFtuDomesticExamThreshold(exam, rawScore);
  const baseScore = convertFtuDomesticExamToBaseScore({ exam, rawScore, programGroup });
  const bonus = scaleFtuBonus30({ bonus30: context.bonus30 ?? 0, programGroup });
  const standardPriority30 = lookupFtuStandardPriority30(profile.priority?.region, profile.priority?.category);
  const priority = calculateFtuEffectivePriority({ baseScoreWithBonus: baseScore + bonus, standardPriority30, programGroup });
  const finalScore = round2(Math.min(scale, baseScore + bonus + priority.effectivePriority));

  explanation.push(
    {
      id: 'ftu-domestic-exam-threshold',
      label: 'FTU domestic exam eligibility threshold',
      output: rawScore,
      formula: threshold.requiredText,
      evidence: ftuDomesticExamThresholdEvidence.evidence,
    },
    {
      id: 'ftu-domestic-exam-conversion',
      label: 'FTU domestic exam converted score',
      output: baseScore,
      scale,
      formula: exam === 'vact' ? '27 + (V-ACT - 850) * 3 / 350' : exam === 'hsa' ? '27 + (HSA - 100) * 3 / 50' : '27 + (TSA - 70) * 3 / 30',
      evidence: ftuDomesticExamFormulaEvidence.evidence,
    },
    {
      id: 'ftu-bonus',
      label: 'FTU bonus score',
      output: bonus,
      scale,
      formula: programGroup === 'integrated40' ? 'min(bonus30, 3) * 4/3' : 'min(bonus30, 3)',
      evidence: ftuPriorityAndBonusEvidence.evidence,
    },
    {
      id: 'ftu-priority',
      label: priority.reduced ? 'FTU reduced priority score' : 'FTU priority score',
      output: priority.effectivePriority,
      scale,
      formula: programGroup === 'integrated40' ? '{[40 - (score + bonus)] / 10} * priority * 4/3' : '{[30 - (score + bonus)] / 7.5} * priority',
      evidence: ftuPriorityAndBonusEvidence.evidence,
    }
  );

  return {
    schoolId: 'ftu',
    year: method.year,
    methodId: method.id,
    confidence: 'exact-verified',
    eligibility: { status: threshold.pass ? 'eligible' : 'ineligible', reasons: [threshold.requiredText] },
    score: { value: finalScore, scale },
    missingInputs: [],
    missingRules: [],
    missingRequirements: [],
    explanation,
    evidence: [...ftuDomesticExamFormulaEvidence.evidence, ...ftuDomesticExamThresholdEvidence.evidence, ...ftuPriorityAndBonusEvidence.evidence],
  };
}

