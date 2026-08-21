import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { ptitAdmissionMethods } from './methods';

export const ptitModule: SchoolModule = {
  id: 'ptit',
  name: 'Hoc vien Cong nghe Buu chinh Vien thong',
  shortName: 'PTIT',
  about: 'Public academy focused on telecommunications, information technology, digital economy, media, and management programs.',
  year: 2026,
  status: 'researching',
  summary:
    'PTIT domestic DGNL/DGTD route has official eligibility thresholds (V-ACT >=600, HSA >=75, TSA >=50, SPT >=15) and raw formula shape. Exact final score is blocked by equivalent-conversion and program-context gaps.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(ptitAdmissionMethods),
  },
};

