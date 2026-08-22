import type { SchoolModule } from './schoolModule';

// CTA labels are capability-first. A school can be actionable without a detail Page
// when its calculator/eligibility logic is available through /compare.
export function deriveSchoolCtaLabel(school: SchoolModule): string {
  const c = school.capabilities;
  if (!c) return school.status === 'supported' ? 'Tính điểm' : 'Xem thông tin';

  if (c.exactCalculator) return 'Tính điểm';
  if (c.partialCalculator) return 'Tính một phần';
  if (c.scoreConversion) return 'Quy đổi điểm';
  if (c.eligibility) return 'Kiểm tra điều kiện';
  if (c.admissionInfo) return 'Xem thông tin';
  return 'Chưa có dữ liệu chi tiết';
}

export function hasSchoolCtaAction(school: SchoolModule): boolean {
  if (school.Page) return true;
  const c = school.capabilities;
  return Boolean(c?.exactCalculator || c?.partialCalculator || c?.scoreConversion || c?.eligibility);
}
