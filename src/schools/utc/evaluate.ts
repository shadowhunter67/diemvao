import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateThptThresholdOnly, type ThresholdOnlyEvaluationContext } from '../thptThresholdOnly';
import { UTC_THPT_THRESHOLD } from './eligibility';
import { utcAdmissionMethods } from './methods';

export function evaluateUtcThptExamAdmission(profile: ApplicantProfile, context: ThresholdOnlyEvaluationContext = {}) {
  return evaluateThptThresholdOnly({
    schoolId: 'utc',
    schoolShortName: 'UTC',
    method: utcAdmissionMethods[0],
    profile,
    context,
    threshold: UTC_THPT_THRESHOLD,
    evidenceSourceId: 'utc-quality-threshold-2026',
  });
}
