import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { neuAdmissionMethods } from './methods';

export const neuModule: SchoolModule = {
  id: 'neu',
  name: 'Dai hoc Kinh te Quoc dan',
  shortName: 'NEU',
  about: 'Public university in Hanoi focused on economics, business, management, finance, law, and data-oriented programs.',
  year: 2026,
  status: 'researching',
  summary:
    'NEU 2026 official Notice 1613 provides the 22/30 threshold and equivalent admitted-score bands for THPT/HSA/SAT/V-ACT/TSA. UniscoreVN reports the official band only; detailed within-band conversion and cutoffs are not modeled yet.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(neuAdmissionMethods),
  },
};

