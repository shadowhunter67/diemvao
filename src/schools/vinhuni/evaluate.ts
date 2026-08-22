import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateThptThresholdOnly, type ThresholdOnlyEvaluationContext } from '../thptThresholdOnly';
import { VINHUNI_THPT_THRESHOLD } from './eligibility';
import { vinhuniAdmissionMethods } from './methods';

export function evaluateVinhuniThptExamAdmission(profile: ApplicantProfile, context: ThresholdOnlyEvaluationContext = {}) {
  return evaluateThptThresholdOnly({
    schoolId: 'vinhuni',
    schoolShortName: 'VinhUni',
    method: vinhuniAdmissionMethods[0],
    profile,
    context,
    threshold: VINHUNI_THPT_THRESHOLD,
    evidenceSourceId: 'vinhuni-quality-threshold-conversion-2026',
  });
}
