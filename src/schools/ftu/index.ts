import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { ftuAdmissionMethods } from './methods';

export const ftuModule: SchoolModule = {
  id: 'ftu',
  name: 'Truong Dai hoc Ngoai thuong',
  shortName: 'FTU',
  about: 'Public university focused on economics, international business, finance, law, and commercial languages.',
  year: 2026,
  status: 'supported',
  summary:
    'FTU domestic aptitude/thinking exam route is exact for the published standalone HSA/V-ACT/TSA formulas, including bonus cap and priority reduction. Program catalog, cutoffs, and international-certificate combination branches are not imported yet.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(ftuAdmissionMethods),
  },
};

