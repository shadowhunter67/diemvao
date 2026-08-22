import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { huceAdmissionMethods } from './methods';

export const huceModule: SchoolModule = {
  id: 'huce',
  name: 'Truong Dai hoc Xay dung Ha Noi',
  shortName: 'HUCE',
  about: 'Public civil engineering and built-environment university in Hanoi.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hanoi',
  vnuhcm: false,
  summary:
    'Official HUCE 2026 sources are normalized for program-level threshold eligibility across THPT, transcript, TSA, SPT, and V-SAT methods. Full bonus, priority, and subject-combination scope are not verified yet.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(huceAdmissionMethods),
  },
  catalogSources: [
    {
      title: 'HUCE 2026 regular undergraduate admission information',
      url: 'https://tuyensinh.huce.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026-11',
      type: 'official-institution',
      checkedAt: '2026-08-22',
    },
    {
      title: 'HUCE 2026 intake thresholds and method conversion notice',
      url: 'https://tuyensinh.huce.edu.vn/muc-diem-nhan-dang-ky-xet-tuyen-vao-dai-hoc-chinh-quy-dot-1-nam-2026-va-quy-doi-diem-giua-cac-phuong-thuc-xet-tuyen-11',
      type: 'official-institution',
      checkedAt: '2026-08-22',
    },
  ],
};
