import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../../compare/schoolComparisonAdapter';
import { getSubjectContext } from '../../compare/schoolComparisonAdapter';
import type { ComparisonSelection } from '../../compare/comparisonSelection';
import { evaluateHuitThptExamAdmission, type HuitThptExamEvaluationContext } from './evaluate';
import { huitAdmissionMethods } from './methods';

/** HUIT chưa có cutoff comparison ở `/compare` (chỉ ngưỡng đăng ký xét tuyển) — giữ hành vi đơn
 * giản như VLU/AGU. Adapter dùng Phương thức 1 (thi TN THPT). `thresholdGroup` mặc định
 * `'standard'` — `SchoolComparisonContext` chưa có field chọn nhóm ngành HUIT (mapping ngành→nhóm
 * ngưỡng còn là knowledge gap, xem `huit-program-catalog-not-imported`). */
function buildContext(selection: Omit<ComparisonSelection, 'id'>): HuitThptExamEvaluationContext {
  return { subjectContext: getSubjectContext(selection.context?.combinationId), thresholdGroup: 'standard' };
}

export const huitComparisonAdapter: SchoolComparisonAdapter<HuitThptExamEvaluationContext> = {
  schoolId: 'huit',
  methodId: huitAdmissionMethods[0].id,
  methodName: huitAdmissionMethods[0].name,
  buildContext,
  evaluate(profile, context): SchoolComparisonResult {
    return { evaluation: evaluateHuitThptExamAdmission(profile, context) };
  },
};
