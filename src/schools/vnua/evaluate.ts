import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateThptThresholdOnly, type ThresholdOnlyEvaluationContext } from '../thptThresholdOnly';
import { vnuaAdmissionMethods } from './methods';

export type VnuaThptExamEvaluationContext = ThresholdOnlyEvaluationContext;

const vnuaCommonThptThreshold = {
  min30: 15,
  max30: 30,
  requiredText:
    'Common condition only: total score of three THPT subjects in the selected combination must be at least 15.00/30. A second group-specific threshold condition also applies and is not yet imported.',
} as const;

export function evaluateVnuaThptExamAdmission(profile: ApplicantProfile, context: VnuaThptExamEvaluationContext = {}) {
  return evaluateThptThresholdOnly({
    schoolId: 'vnua',
    method: vnuaAdmissionMethods[0],
    profile,
    context,
    threshold: vnuaCommonThptThreshold,
    schoolShortName: 'VNUA',
    evidenceSourceId: 'vnua-threshold-notice-2026',
  });
}

