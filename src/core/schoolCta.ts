import type { SchoolModule } from './schoolModule';

export type SchoolCtaAction =
  | { kind: 'school'; schoolId: string }
  | { kind: 'info'; schoolId: string }
  | { kind: 'compare'; schoolId?: string }
  | { kind: 'none' };

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

export function deriveSchoolCtaAction(school: SchoolModule): SchoolCtaAction {
  if (school.Page) return { kind: 'school', schoolId: school.id };
  const c = school.capabilities;
  if (c?.exactCalculator || c?.partialCalculator || c?.scoreConversion || c?.eligibility) {
    return { kind: 'school', schoolId: school.id };
  }
  if (c?.admissionInfo) return { kind: 'info', schoolId: school.id };
  return { kind: 'none' };
}

export function hasSchoolCtaAction(school: SchoolModule): boolean {
  return deriveSchoolCtaAction(school).kind !== 'none';
}
