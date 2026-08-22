import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateThptThresholdOnly, type ThresholdOnlyEvaluationContext } from '../thptThresholdOnly';
import { HNUE_THPT_THRESHOLD } from './eligibility';
import { hnueAdmissionMethods } from './methods';

export function evaluateHnueThptExamAdmission(profile: ApplicantProfile, context: ThresholdOnlyEvaluationContext = {}) {
  return evaluateThptThresholdOnly({
    schoolId: 'hnue',
    schoolShortName: 'HNUE',
    method: hnueAdmissionMethods[0],
    profile,
    context,
    threshold: HNUE_THPT_THRESHOLD,
    evidenceSourceId: 'hnue-quality-threshold-2026',
  });
}
