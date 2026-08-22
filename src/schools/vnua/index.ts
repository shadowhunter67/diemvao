import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { vnuaAdmissionMethods } from './methods';

export const vnuaModule: SchoolModule = {
  id: 'vnua',
  name: 'Hoc vien Nong nghiep Viet Nam',
  shortName: 'VNUA',
  about: 'Public agriculture-focused academy in Hanoi.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hanoi',
  vnuhcm: false,
  summary:
    'Official 2026 VNUA sources are normalized for THPT eligibility: the common 15/30 baseline and numeric HVN01-HVN23 group thresholds are modeled; ministry-governed groups and bonus/priority scoring remain unresolved.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(vnuaAdmissionMethods),
  },
  catalogSources: [
    {
      title: 'Official 2026 regular undergraduate admission notice',
      url: 'https://vnua.edu.vn/thong-bao/thong-bao-tuyen-sinh-dai-hoc-he-chinh-quy-nam-2026-58444',
      type: 'official-institution',
      checkedAt: '2026-08-22',
    },
    {
      title: 'Official 2026 application threshold notice',
      url: 'https://vnua.edu.vn/diemxettuyen',
      type: 'official-institution',
      checkedAt: '2026-08-22',
    },
  ],
};

