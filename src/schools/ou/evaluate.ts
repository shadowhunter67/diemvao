import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateThptThresholdOnly, type ThresholdOnlyEvaluationContext } from '../thptThresholdOnly';
import { ouAdmissionMethods } from './methods';
import { OU_THPT_THRESHOLD } from './eligibility';

export function evaluateOuThptExamAdmission(profile: ApplicantProfile, context: ThresholdOnlyEvaluationContext = {}) {
  return evaluateThptThresholdOnly({
    schoolId: 'ou',
    schoolShortName: 'OU',
    method: ouAdmissionMethods[0],
    profile,
    context,
    threshold: OU_THPT_THRESHOLD,
    evidenceSourceId: 'ou-quality-threshold-2026',
  });
}
