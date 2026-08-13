import { describe, expect, it } from 'vitest';
import { hcmutModule } from './hcmut';
import { hcmutAdmissionMethods } from './hcmut/methods';
import { uehModule } from './ueh';
import { uehAdmissionMethods } from './ueh/methods';

/**
 * Method-level capability (`AdmissionMethodDescriptor`) là chi tiết hơn school-level
 * (`SchoolCapabilities`) — test này đảm bảo 2 tầng không lệch nhau khi 1 trường chỉ có 1
 * phương thức (trường hợp hiện tại của HCMUT/UEH). Nếu sau này 1 trường có ≥2 phương thức,
 * `SchoolCapabilities` sẽ cần derive bằng OR qua các method thay vì so sánh 1-1 như đây.
 */
describe('AdmissionMethodDescriptor khớp SchoolCapabilities khi trường chỉ có 1 phương thức', () => {
  it('HCMUT', () => {
    expect(hcmutAdmissionMethods).toHaveLength(1);
    const { scoreConversion, exactCalculator } = hcmutAdmissionMethods[0].capabilities;
    expect(scoreConversion).toBe(hcmutModule.capabilities?.scoreConversion);
    expect(exactCalculator).toBe(hcmutModule.capabilities?.exactCalculator);
  });

  it('UEH', () => {
    expect(uehAdmissionMethods).toHaveLength(1);
    const { scoreConversion, exactCalculator } = uehAdmissionMethods[0].capabilities;
    expect(scoreConversion).toBe(uehModule.capabilities?.scoreConversion);
    expect(exactCalculator).toBe(uehModule.capabilities?.exactCalculator);
  });
});
