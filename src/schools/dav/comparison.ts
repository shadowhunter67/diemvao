import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ApplicantProfile } from '../../core/applicantProfile';
import { evaluateDavAdmission, type DavEvaluationContext } from './evaluate';
import { davAdmissionMethods } from './methods';

function isDavMethodId(value: string | undefined): value is DavEvaluationContext['methodId'] {
  return davAdmissionMethods.some((method) => method.id === value);
}

export const davComparisonAdapter: SchoolComparisonAdapter<DavEvaluationContext> = {
  schoolId: 'dav',
  methodId: 'dav-thpt-exam-2026',
  methodName: 'THPT exam threshold eligibility',
  buildContext(selection) {
    return {
      methodId: isDavMethodId(selection.methodId) ? selection.methodId : 'dav-thpt-exam-2026',
      programCode: selection.programId,
      subjectContext: getSubjectContext(selection.context?.combinationId),
    };
  },
  evaluate(profile: ApplicantProfile, context: DavEvaluationContext): SchoolComparisonResult {
    return { evaluation: evaluateDavAdmission(profile, context) };
  },
};
