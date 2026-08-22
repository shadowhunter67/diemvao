import type { RuleEvidence } from './evidence';
import type { AdmissionMethodDescriptor } from './admissionMethod';
import type { KnowledgeGap } from './knowledgeStatus';
import { hcmutRuleEvidence } from '../schools/hcmut/evidence';
import { hcmutAdmissionMethods } from '../schools/hcmut/methods';
import { uehAdmissionMethods } from '../schools/ueh/methods';
import { uelAdmissionMethods } from '../schools/uel/methods';
import { uelFormulaEvidence, uelPriorityTableEvidence, uelCertificateBonusEvidence, uelPriorityReductionEvidence } from '../schools/uel/evidence';
import { uitAdmissionMethods } from '../schools/uit/methods';
import { hcmusAdmissionMethods } from '../schools/hcmus/methods';
import { hcmusAcademicScoreEvidence, hcmusBonusEvidence, hcmusProgramThresholdEvidence, hcmusThresholdEvidence, hcmusPriorityEvidence } from '../schools/hcmus/evidence';
import { usshAdmissionMethods } from '../schools/ussh/methods';
import { usshDt3FormulaEvidence, usshThresholdEvidence, usshDhl1Dhl2FormulaEvidence, usshPriorityTableEvidence, usshPriorityReductionEvidence } from '../schools/ussh/evidence';
import { uhsAdmissionMethods } from '../schools/uhs/methods';
import { uhsBonusEvidence, uhsIntegratedFormulaEvidence, uhsThresholdEvidence } from '../schools/uhs/evidence';
import { iuAdmissionMethods } from '../schools/iu/methods';
import { iuAcademicWeightsEvidence, iuBonusEvidence, iuPriorityEvidence, iuPriorityReductionEvidence } from '../schools/iu/evidence';
import { aguAdmissionMethods } from '../schools/agu/methods';
import { aguBetaWeightsEvidence, aguLawExtraConditionEvidence, aguProgramThresholdEvidence } from '../schools/agu/evidence';
import { hcmuteAdmissionMethods } from '../schools/hcmute/methods';
import {
  hcmutePriorityEvidence,
  hcmuteBonusEvidence,
  hcmuteEligibilityEvidence,
  hcmuteAcademicFormulaEvidence,
  hcmuteCorrelationCoefficientsEvidence,
  hcmuteHly2Evidence,
  hcmuteHly3Evidence,
} from '../schools/hcmute/evidence';
import { tdtuAdmissionMethods } from '../schools/tdtu/methods';
import { tdtuCompetencyFormulaEvidence, tdtuBonusEvidence, tdtuPriorityEvidence, tdtuGeneralThresholdEvidence } from '../schools/tdtu/evidence';
import { huflitAdmissionMethods } from '../schools/huflit/methods';
import { huflitFormulaEvidence, huflitThresholdEvidence, huflitPriorityEvidence } from '../schools/huflit/evidence';
import { hutechAdmissionMethods } from '../schools/hutech/methods';
import { hutechFormulaEvidence, hutechThresholdEvidence, hutechPriorityEvidence } from '../schools/hutech/evidence';
import { ufmAdmissionMethods } from '../schools/ufm/methods';
import { ufmFormulaEvidence, ufmThresholdEvidence, ufmPriorityEvidence } from '../schools/ufm/evidence';
import { hcmulawAdmissionMethods } from '../schools/hcmulaw/methods';
import { hcmulawFormulaEvidence, hcmulawThresholdEvidence, hcmulawPriorityEvidence } from '../schools/hcmulaw/evidence';
import { iuhAdmissionMethods } from '../schools/iuh/methods';
import { iuhFormulaEvidence, iuhThresholdEvidence, iuhPriorityEvidence, iuhBonusEvidence } from '../schools/iuh/evidence';
import { vluAdmissionMethods } from '../schools/vlu/methods';
import { vluThptExamThresholdEvidence, vluTranscriptExtraRequirementEvidence } from '../schools/vlu/evidence';
import { umpAdmissionMethods } from '../schools/ump/methods';
import { umpFormulaEvidence, umpPriorityEvidence, umpBonusEvidence, umpThresholdEvidence } from '../schools/ump/evidence';
import { ftuAdmissionMethods } from '../schools/ftu/methods';
import { ftuDomesticExamFormulaEvidence, ftuDomesticExamThresholdEvidence, ftuPriorityAndBonusEvidence } from '../schools/ftu/evidence';
import { ptitAdmissionMethods } from '../schools/ptit/methods';
import { neuAdmissionMethods } from '../schools/neu/methods';
import { hubAdmissionMethods } from '../schools/hub/methods';
import { huitAdmissionMethods } from '../schools/huit/methods';
import { nttuAdmissionMethods } from '../schools/nttu/methods';
import { hsuAdmissionMethods } from '../schools/hsu/methods';
import { uefAdmissionMethods } from '../schools/uef/methods';
import { hubStandardThresholdEvidence, hubLawThresholdEvidence, hubEliteIeltsRequirementEvidence } from '../schools/hub/evidence';
import { ctuAdmissionMethods } from '../schools/ctu/methods';
import { ctuBaselineConditionEvidence, ctuAltPathEvidence } from '../schools/ctu/evidence';
import { tdmuAdmissionMethods } from '../schools/tdmu/methods';
import { tdmuThptExamThresholdEvidence, tdmuTranscriptThresholdEvidence, tdmuVactThresholdEvidence } from '../schools/tdmu/evidence';
import { hiuAdmissionMethods } from '../schools/hiu/methods';
import { hiuThptExamThresholdEvidence, hiuVactThresholdEvidence } from '../schools/hiu/evidence';
import { ouAdmissionMethods } from '../schools/ou/methods';
import { ouThptExamThresholdEvidence } from '../schools/ou/evidence';
import { sguAdmissionMethods } from '../schools/sgu/methods';
import { sguThptExamThresholdEvidence } from '../schools/sgu/evidence';
import { hnueAdmissionMethods } from '../schools/hnue/methods';
import { hnueThptExamThresholdEvidence } from '../schools/hnue/evidence';
import { vinhuniAdmissionMethods } from '../schools/vinhuni/methods';
import { vinhuniThptExamThresholdEvidence } from '../schools/vinhuni/evidence';
import { utcAdmissionMethods } from '../schools/utc/methods';
import { utcThptExamThresholdEvidence } from '../schools/utc/evidence';
import { southernCatalogMethods } from '../schools/southernCatalog';
import { remainingCatalogMethods } from '../schools/remainingCatalog';

/**
 * Pure data-assembly cho `npm run audit:data` (CLI script) VÀ test provenance
 * (`dataFreshnessAudit.ruleEvidence.test.ts`) — tách khỏi `scripts/audit-admission-data.ts` (có
 * side effect `console.log`/`process.exitCode`) để test import được mà không chạy CLI. Đây LÀ
 * danh sách "evidence nào coi là runtime/score-affecting". Batch provenance-hygiene (2026-08-17)
 * phát hiện danh sách này (trước đó sống trong CLI script, không test được) THIẾU UEL — batch
 * 2026-08-18 đã đóng gap đó bằng `schools/uel/evidence.ts` (song song với `evaluate.ts`, không đổi
 * evidence trả ra runtime cho user). HCMUE giữ nguyên NGOÀI danh sách audit:data (đúng scope gốc
 * của `scripts/audit-admission-data.ts` trước batch này — không mở rộng ngoài yêu cầu).
 */
export function hcmutEvidence(): RuleEvidence[] {
  return (Object.values(hcmutRuleEvidence) as Array<{ evidence: RuleEvidence[] }>).flatMap((rule) => rule.evidence);
}

export function verifiedRuntimeEvidence(): RuleEvidence[] {
  return [
    ...hcmutEvidence(),
    ...hcmusThresholdEvidence.evidence,
    ...hcmusAcademicScoreEvidence.evidence,
    ...hcmusProgramThresholdEvidence.evidence,
    ...hcmusBonusEvidence.evidence,
    ...hcmusPriorityEvidence.evidence,
    ...usshThresholdEvidence.evidence,
    ...usshDt3FormulaEvidence.evidence,
    ...usshDhl1Dhl2FormulaEvidence.evidence,
    ...usshPriorityTableEvidence.evidence,
    ...usshPriorityReductionEvidence.evidence,
    ...uhsThresholdEvidence.evidence,
    ...uhsIntegratedFormulaEvidence.evidence,
    ...uhsBonusEvidence.evidence,
    ...iuAcademicWeightsEvidence.evidence,
    ...iuBonusEvidence.evidence,
    ...iuPriorityEvidence.evidence,
    ...iuPriorityReductionEvidence.evidence,
    ...aguProgramThresholdEvidence.evidence,
    ...aguBetaWeightsEvidence.evidence,
    ...aguLawExtraConditionEvidence.evidence,
    ...uelFormulaEvidence.evidence,
    ...uelPriorityTableEvidence.evidence,
    ...uelCertificateBonusEvidence.evidence,
    ...uelPriorityReductionEvidence.evidence,
    ...hcmutePriorityEvidence.evidence,
    ...hcmuteBonusEvidence.evidence,
    ...hcmuteEligibilityEvidence.evidence,
    ...hcmuteAcademicFormulaEvidence.evidence,
    ...hcmuteCorrelationCoefficientsEvidence.evidence,
    ...hcmuteHly2Evidence.evidence,
    ...hcmuteHly3Evidence.evidence,
    ...tdtuCompetencyFormulaEvidence.evidence,
    ...tdtuBonusEvidence.evidence,
    ...tdtuPriorityEvidence.evidence,
    ...tdtuGeneralThresholdEvidence.evidence,
    ...huflitFormulaEvidence.evidence,
    ...huflitThresholdEvidence.evidence,
    ...huflitPriorityEvidence.evidence,
    ...hutechFormulaEvidence.evidence,
    ...hutechThresholdEvidence.evidence,
    ...hutechPriorityEvidence.evidence,
    ...ufmFormulaEvidence.evidence,
    ...ufmThresholdEvidence.evidence,
    ...ufmPriorityEvidence.evidence,
    ...hcmulawFormulaEvidence.evidence,
    ...hcmulawThresholdEvidence.evidence,
    ...hcmulawPriorityEvidence.evidence,
    ...iuhFormulaEvidence.evidence,
    ...iuhThresholdEvidence.evidence,
    ...iuhPriorityEvidence.evidence,
    ...iuhBonusEvidence.evidence,
    ...vluThptExamThresholdEvidence.evidence,
    ...vluTranscriptExtraRequirementEvidence.evidence,
    ...umpFormulaEvidence.evidence,
    ...umpThresholdEvidence.evidence,
    ...umpPriorityEvidence.evidence,
    ...umpBonusEvidence.evidence,
    ...ftuDomesticExamFormulaEvidence.evidence,
    ...ftuDomesticExamThresholdEvidence.evidence,
    ...ftuPriorityAndBonusEvidence.evidence,
    ...hubStandardThresholdEvidence.evidence,
    ...hubLawThresholdEvidence.evidence,
    ...hubEliteIeltsRequirementEvidence.evidence,
    ...ctuBaselineConditionEvidence.evidence,
    ...ctuAltPathEvidence.evidence,
    ...tdmuThptExamThresholdEvidence.evidence,
    ...tdmuTranscriptThresholdEvidence.evidence,
    ...tdmuVactThresholdEvidence.evidence,
    ...hiuThptExamThresholdEvidence.evidence,
    ...hiuVactThresholdEvidence.evidence,
    ...ouThptExamThresholdEvidence.evidence,
    ...sguThptExamThresholdEvidence.evidence,
    ...hnueThptExamThresholdEvidence.evidence,
    ...vinhuniThptExamThresholdEvidence.evidence,
    ...utcThptExamThresholdEvidence.evidence,
  ];
}

export function methodGaps(methods: AdmissionMethodDescriptor[]): Array<KnowledgeGap & { schoolId?: string; methodId?: string }> {
  return methods.flatMap((method) => (method.knowledgeGaps ?? []).map((gap) => ({ ...gap, schoolId: method.schoolId, methodId: method.id })));
}

export const allAdmissionMethods: AdmissionMethodDescriptor[] = [
  ...hcmutAdmissionMethods,
  ...uehAdmissionMethods,
  ...uelAdmissionMethods,
  ...uitAdmissionMethods,
  ...hcmusAdmissionMethods,
  ...usshAdmissionMethods,
  ...uhsAdmissionMethods,
  ...iuAdmissionMethods,
  ...aguAdmissionMethods,
  ...hcmuteAdmissionMethods,
  ...tdtuAdmissionMethods,
  ...huflitAdmissionMethods,
  ...hutechAdmissionMethods,
  ...ufmAdmissionMethods,
  ...hcmulawAdmissionMethods,
  ...iuhAdmissionMethods,
  ...vluAdmissionMethods,
  ...umpAdmissionMethods,
  ...ftuAdmissionMethods,
  ...ptitAdmissionMethods,
  ...neuAdmissionMethods,
  ...hubAdmissionMethods,
  ...huitAdmissionMethods,
  ...nttuAdmissionMethods,
  ...hsuAdmissionMethods,
  ...uefAdmissionMethods,
  ...ctuAdmissionMethods,
  ...tdmuAdmissionMethods,
  ...hiuAdmissionMethods,
  ...ouAdmissionMethods,
  ...sguAdmissionMethods,
  ...hnueAdmissionMethods,
  ...vinhuniAdmissionMethods,
  ...utcAdmissionMethods,
  ...southernCatalogMethods,
  ...remainingCatalogMethods,
];

export const allMethodKnowledgeGaps: Array<KnowledgeGap & { schoolId?: string; methodId?: string }> = [
  ...methodGaps(hutechAdmissionMethods),
  ...methodGaps(ufmAdmissionMethods),
  ...methodGaps(vluAdmissionMethods),
  ...methodGaps(uehAdmissionMethods),
  ...methodGaps(uelAdmissionMethods),
  ...methodGaps(uitAdmissionMethods),
  ...methodGaps(hcmusAdmissionMethods),
  ...methodGaps(usshAdmissionMethods),
  ...methodGaps(uhsAdmissionMethods),
  ...methodGaps(iuAdmissionMethods),
  ...methodGaps(aguAdmissionMethods),
  ...methodGaps(hcmuteAdmissionMethods),
  ...methodGaps(tdtuAdmissionMethods),
  ...methodGaps(huflitAdmissionMethods),
  ...methodGaps(hcmulawAdmissionMethods),
  ...methodGaps(iuhAdmissionMethods),
  ...methodGaps(ptitAdmissionMethods),
  ...methodGaps(neuAdmissionMethods),
  ...methodGaps(hubAdmissionMethods),
  ...methodGaps(huitAdmissionMethods),
  ...methodGaps(nttuAdmissionMethods),
  ...methodGaps(hsuAdmissionMethods),
  ...methodGaps(uefAdmissionMethods),
  ...methodGaps(ctuAdmissionMethods),
  ...methodGaps(tdmuAdmissionMethods),
  ...methodGaps(hiuAdmissionMethods),
  ...methodGaps(ouAdmissionMethods),
  ...methodGaps(sguAdmissionMethods),
  ...methodGaps(hnueAdmissionMethods),
  ...methodGaps(vinhuniAdmissionMethods),
  ...methodGaps(utcAdmissionMethods),
  ...methodGaps(southernCatalogMethods),
  ...methodGaps(remainingCatalogMethods),
];
