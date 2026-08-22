import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { davAdmissionMethods } from './methods';

export const davModule: SchoolModule = {
  id: 'dav',
  name: 'Hoc vien Ngoai giao',
  shortName: 'DAV',
  about: 'Public academy under the Ministry of Foreign Affairs.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hanoi',
  vnuhcm: false,
  summary:
    'Official DAV 2026 sources are decomposed into programs, method scope, thresholds, certificate conversions, bonus/priority notes, law-field constraints, and rounding. Runtime support checks threshold eligibility for THPT, transcript-plus-certificate, and SAT/ACT-plus-certificate contexts; it does not calculate final admitted score.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    partialCalculator: true,
    ...aggregateSchoolCapabilities(davAdmissionMethods),
  },
  catalogSources: [
    {
      title: 'DAV 2026 undergraduate admission information',
      url: 'https://static.dav.edu.vn/files/2026/05/20/hqt-thong-tin-tuyen-sinh-2026-dav-updated-18-05-2026.pdf',
      type: 'official-institution',
      checkedAt: '2026-08-22',
    },
    {
      title: 'DAV 2026 thresholds and equivalent cutoff conversion',
      url: 'https://static.dav.edu.vn/files/2026/07/11/hqt-nguong-do-lech-va-bang-quy-doi.pdf',
      type: 'official-institution',
      checkedAt: '2026-08-22',
    },
  ],
};
