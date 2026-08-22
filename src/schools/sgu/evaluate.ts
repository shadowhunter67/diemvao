import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateThptThresholdOnly, type ThresholdOnlyEvaluationContext } from '../thptThresholdOnly';
import { SGU_THPT_THRESHOLD } from './eligibility';
import { sguAdmissionMethods } from './methods';

export function evaluateSguThptExamAdmission(profile: ApplicantProfile, context: ThresholdOnlyEvaluationContext = {}) {
  return evaluateThptThresholdOnly({
    schoolId: 'sgu',
    schoolShortName: 'SGU',
    method: sguAdmissionMethods[0],
    profile,
    context,
    threshold: SGU_THPT_THRESHOLD,
    evidenceSourceId: 'sgu-quality-threshold-2026',
  });
}
