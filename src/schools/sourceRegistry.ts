import type { AdmissionSource } from '../core/sourceRegistry';
import { hcmutSources } from './hcmut/sources';
import { uehSources } from './ueh/sources';
import { uelSources } from './uel/sources';
import { uitSources } from './uit/sources';
import { hcmusSources } from './hcmus/sources';
import { usshSources } from './ussh/sources';
import { uhsSources } from './uhs/sources';
import { iuSources } from './iu/sources';
import { aguSources } from './agu/sources';
import { hcmueSources } from './hcmue/sources';
import { hcmuteSources } from './hcmute/sources';
import { tdtuSources } from './tdtu/sources';
import { huflitSources } from './huflit/sources';
import { hutechSources } from './hutech/sources';
import { ufmSources } from './ufm/sources';

function withSchoolId(schoolId: string, sources: Omit<AdmissionSource, 'schoolId'>[]): AdmissionSource[] {
  return sources.map((source) => ({ ...source, schoolId }));
}

export const hcmutSourceRegistry: AdmissionSource[] = withSchoolId('hcmut', hcmutSources);
export const uehSourceRegistry: AdmissionSource[] = withSchoolId('ueh', uehSources);
export const uelSourceRegistry: AdmissionSource[] = withSchoolId('uel', uelSources);
export const uitSourceRegistry: AdmissionSource[] = withSchoolId('uit', uitSources);
export const hcmusSourceRegistry: AdmissionSource[] = withSchoolId('hcmus', hcmusSources);
export const usshSourceRegistry: AdmissionSource[] = withSchoolId('ussh', usshSources);
export const uhsSourceRegistry: AdmissionSource[] = withSchoolId('uhs', uhsSources);
export const iuSourceRegistry: AdmissionSource[] = withSchoolId('iu', iuSources);
export const aguSourceRegistry: AdmissionSource[] = withSchoolId('agu', aguSources);
export const hcmueSourceRegistry: AdmissionSource[] = withSchoolId('hcmue', hcmueSources);
export const hcmuteSourceRegistry: AdmissionSource[] = withSchoolId('hcmute', hcmuteSources);
export const tdtuSourceRegistry: AdmissionSource[] = withSchoolId('tdtu', tdtuSources);
export const huflitSourceRegistry: AdmissionSource[] = withSchoolId('huflit', huflitSources);
export const hutechSourceRegistry: AdmissionSource[] = withSchoolId('hutech', hutechSources);
export const ufmSourceRegistry: AdmissionSource[] = withSchoolId('ufm', ufmSources);

export const schoolSourceRegistries: Record<string, AdmissionSource[]> = {
  hcmut: hcmutSourceRegistry,
  ueh: uehSourceRegistry,
  uel: uelSourceRegistry,
  uit: uitSourceRegistry,
  hcmus: hcmusSourceRegistry,
  ussh: usshSourceRegistry,
  uhs: uhsSourceRegistry,
  iu: iuSourceRegistry,
  agu: aguSourceRegistry,
  hcmue: hcmueSourceRegistry,
  hcmute: hcmuteSourceRegistry,
  tdtu: tdtuSourceRegistry,
  huflit: huflitSourceRegistry,
  hutech: hutechSourceRegistry,
  ufm: ufmSourceRegistry,
};

export const allAdmissionSources: AdmissionSource[] = [
  ...hcmutSourceRegistry,
  ...uehSourceRegistry,
  ...uelSourceRegistry,
  ...uitSourceRegistry,
  ...hcmusSourceRegistry,
  ...usshSourceRegistry,
  ...uhsSourceRegistry,
  ...iuSourceRegistry,
  ...aguSourceRegistry,
  ...hcmueSourceRegistry,
  ...hcmuteSourceRegistry,
  ...tdtuSourceRegistry,
  ...huflitSourceRegistry,
  ...hutechSourceRegistry,
  ...ufmSourceRegistry,
];
