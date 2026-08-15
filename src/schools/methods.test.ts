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

describe('SchoolModule.capabilities matches aggregateSchoolCapabilities(methods)', () => {
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

describe('Method descriptors reflect current evidence', () => {
  it('HCMUT is exact', () => {
    expect(hcmutAdmissionMethods[0].capabilities.exactCalculator).toBe(true);
  });

  it('UEH is exact', () => {
    expect(uehAdmissionMethods[0].capabilities).toMatchObject({
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: true,
    });
  });

  it('UEL is exact after the public certificate bonus table re-audit', () => {
    expect(uelAdmissionMethods[0].capabilities).toMatchObject({
      scoreConversion: true,
      bonus: true,
      priority: true,
      exactCalculator: true,
    });
    expect(uelAdmissionMethods[0].knowledgeGaps?.length ?? 0).toBe(0);
  });

  it('UIT remains partial eligibility/bonus', () => {
    expect(uitAdmissionMethods[0].capabilities).toMatchObject({
      eligibility: true,
      bonus: true,
      exactCalculator: false,
    });
  });
});

describe('aggregateSchoolCapabilities OR semantics', () => {
  const baseMethod: AdmissionMethodDescriptor = {
    id: 'a',
    name: 'A',
    year: 2026,
    capabilities: { eligibility: false, scoreConversion: false, bonus: false, priority: false, exactCalculator: false },
  };

  it('returns true if at least one method supports a capability', () => {
    const methods: AdmissionMethodDescriptor[] = [
      baseMethod,
      { ...baseMethod, id: 'b', capabilities: { ...baseMethod.capabilities, exactCalculator: true } },
    ];
    expect(aggregateSchoolCapabilities(methods)).toEqual({ eligibility: false, scoreConversion: false, exactCalculator: true });
  });

  it('returns false if no method supports a capability', () => {
    expect(aggregateSchoolCapabilities([baseMethod])).toEqual({ eligibility: false, scoreConversion: false, exactCalculator: false });
  });

  it('handles empty method arrays', () => {
    expect(aggregateSchoolCapabilities([])).toEqual({ eligibility: false, scoreConversion: false, exactCalculator: false });
  });
});

describe('AGU module', () => {
  it('has real eligibility capabilities and no exact calculator yet', async () => {
    const { schoolRegistry } = await import('./index');
    const agu = schoolRegistry['agu'];
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
