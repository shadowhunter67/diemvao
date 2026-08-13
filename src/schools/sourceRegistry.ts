import type { AdmissionSource } from '../core/sourceRegistry';
import { hcmutSources } from './hcmut/sources';
import { uehSources } from './ueh/sources';
import { uelSources } from './uel/sources';
import { uitSources } from './uit/sources';

function withSchoolId(schoolId: string, sources: Omit<AdmissionSource, 'schoolId'>[]): AdmissionSource[] {
  return sources.map((source) => ({ ...source, schoolId }));
}

export const hcmutSourceRegistry: AdmissionSource[] = withSchoolId('hcmut', hcmutSources);
export const uehSourceRegistry: AdmissionSource[] = withSchoolId('ueh', uehSources);
export const uelSourceRegistry: AdmissionSource[] = withSchoolId('uel', uelSources);
export const uitSourceRegistry: AdmissionSource[] = withSchoolId('uit', uitSources);

export const schoolSourceRegistries: Record<string, AdmissionSource[]> = {
  hcmut: hcmutSourceRegistry,
  ueh: uehSourceRegistry,
  uel: uelSourceRegistry,
  uit: uitSourceRegistry,
};

export const allAdmissionSources: AdmissionSource[] = [
  ...hcmutSourceRegistry,
  ...uehSourceRegistry,
  ...uelSourceRegistry,
  ...uitSourceRegistry,
];
