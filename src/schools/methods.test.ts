import { describe, expect, it } from 'vitest';
import { aggregateSchoolCapabilities, type AdmissionMethodDescriptor } from '../core/admissionMethod';
import { hcmutModule } from './hcmut';
import { hcmutAdmissionMethods } from './hcmut/methods';
import { uehModule } from './ueh';
import { uehAdmissionMethods } from './ueh/methods';
import { uelModule } from './uel';
import { uelAdmissionMethods } from './uel/methods';
import { uitModule } from './uit';
import { uitAdmissionMethods } from './uit/methods';

/**
 * Method-level capability (`AdmissionMethodDescriptor`) là chi tiết hơn school-level
 * (`SchoolCapabilities`). Batch 6: `SchoolModule.capabilities` giờ DERIVE trực tiếp từ
 * `aggregateSchoolCapabilities(methods)` (xem `schools/<id>/index.ts`) thay vì hard-code song
 * song — test dưới đây khóa chặt việc đó không bị revert âm thầm (school-level không được nói
 * mạnh hơn method-level thực tế).
 */
describe('SchoolModule.capabilities khớp aggregateSchoolCapabilities(methods)', () => {
  it.each([
    ['HCMUT', hcmutModule, hcmutAdmissionMethods],
    ['UEH', uehModule, uehAdmissionMethods],
    ['UEL', uelModule, uelAdmissionMethods],
    ['UIT', uitModule, uitAdmissionMethods],
  ] as const)('%s', (_label, schoolModule, methods) => {
    const aggregated = aggregateSchoolCapabilities(methods);
    expect(schoolModule.capabilities?.eligibility).toBe(aggregated.eligibility);
    expect(schoolModule.capabilities?.scoreConversion).toBe(aggregated.scoreConversion);
    expect(schoolModule.capabilities?.exactCalculator).toBe(aggregated.exactCalculator);
  });
});

describe('Method descriptor đúng capability thật đã biết (khớp evidence hiện có)', () => {
  it('HCMUT: exact calculator = true (formula verified, đã wire UI thật)', () => {
    expect(hcmutAdmissionMethods).toHaveLength(1);
    expect(hcmutAdmissionMethods[0].capabilities.exactCalculator).toBe(true);
  });

  it('UEH: exact calculator = true (re-audit 2026-08-13, Đối tượng 1 — worked example + bảng bonus/priority đầy đủ)', () => {
    expect(uehAdmissionMethods).toHaveLength(1);
    expect(uehAdmissionMethods[0].capabilities.exactCalculator).toBe(true);
    expect(uehAdmissionMethods[0].capabilities.scoreConversion).toBe(true);
    expect(uehAdmissionMethods[0].capabilities.bonus).toBe(true);
    expect(uehAdmissionMethods[0].capabilities.priority).toBe(true);
  });

  it('UEL: exact calculator = false trừ khi research mới unblock (batch 6: unblock priority reduction, vẫn thiếu bảng bonus ngoại ngữ)', () => {
    expect(uelAdmissionMethods).toHaveLength(1);
    expect(uelAdmissionMethods[0].capabilities.exactCalculator).toBe(false);
    expect(uelAdmissionMethods[0].capabilities.scoreConversion).toBe(true);
    expect(uelAdmissionMethods[0].capabilities.priority).toBe(true);
    expect(uelAdmissionMethods[0].capabilities.bonus).toBe(false);
    expect(uelAdmissionMethods[0].knowledgeGaps?.length).toBeGreaterThan(0);
  });

  it('UIT: eligibility = true, bonus = true, exact calculator = false', () => {
    expect(uitAdmissionMethods).toHaveLength(1);
    const { eligibility, bonus, exactCalculator } = uitAdmissionMethods[0].capabilities;
    expect(eligibility).toBe(true);
    expect(bonus).toBe(true);
    expect(exactCalculator).toBe(false);
  });
});

describe('aggregateSchoolCapabilities — OR semantics qua nhiều method', () => {
  const baseMethod: AdmissionMethodDescriptor = {
    id: 'a',
    name: 'A',
    year: 2026,
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
  };

  it('true nếu ÍT NHẤT MỘT method có capability đó, kể cả khi method khác không có', () => {
    const methods: AdmissionMethodDescriptor[] = [
      baseMethod,
      { ...baseMethod, id: 'b', capabilities: { ...baseMethod.capabilities, exactCalculator: true } },
    ];
    expect(aggregateSchoolCapabilities(methods)).toEqual({
      eligibility: false,
      scoreConversion: false,
      exactCalculator: true,
    });
  });

  it('false nếu KHÔNG method nào có capability đó', () => {
    expect(aggregateSchoolCapabilities([baseMethod])).toEqual({
      eligibility: false,
      scoreConversion: false,
      exactCalculator: false,
    });
  });

  it('mảng rỗng (trường identity-only, chưa có method nào) → toàn bộ false, không throw', () => {
    expect(() => aggregateSchoolCapabilities([])).not.toThrow();
    expect(aggregateSchoolCapabilities([])).toEqual({
      eligibility: false,
      scoreConversion: false,
      exactCalculator: false,
    });
  });
});

describe('AGU — research 2026-08-15 nâng từ identity-only lên module thật (eligibility)', () => {
  it('có capabilities thật derive từ aguAdmissionMethods (eligibility=true, chưa có Page riêng)', async () => {
    const { schoolRegistry } = await import('./index');
    const agu = schoolRegistry['agu'];
    expect(agu).toBeDefined();
    expect(agu.capabilities).toEqual({
      admissionInfo: true,
      programs: true,
      cutoffs: false,
      eligibility: true,
      scoreConversion: false,
      exactCalculator: false,
    });
    expect(agu.Page).toBeUndefined();
  });
});
