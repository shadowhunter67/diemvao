import type { SchoolModule } from './schoolModule';

/**
 * CTA label derive từ capability THẬT — không hard-code theo school ID/status nhị phân
 * ("Tính chính xác" vs "Chưa mở"). Ưu tiên từ cao xuống thấp: một trường có exactCalculator vẫn
 * hiện "Tính điểm" dù cũng có eligibility/scoreConversion (không hiện label yếu hơn cho trường
 * mạnh hơn). Trường chưa có `Page` luôn "Chưa mở" bất kể capabilities nói gì — không có nơi để
 * điều hướng tới thì không thể claim capability.
 */
export function deriveSchoolCtaLabel(school: SchoolModule): string {
  if (!school.Page) return 'Chưa mở';

  const c = school.capabilities;
  if (!c) return school.status === 'supported' ? 'Tính điểm' : 'Xem thông tin';

  if (c.exactCalculator) return 'Tính điểm';
  if (c.partialCalculator) return 'Tính một phần';
  if (c.scoreConversion) return 'Quy đổi điểm';
  if (c.eligibility) return 'Kiểm tra điều kiện';
  if (c.admissionInfo) return 'Xem thông tin';
  return 'Chưa mở';
}
