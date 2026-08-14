import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { UhsPage } from './UhsPage';
import { uhsAdmissionMethods } from './methods';

export const uhsModule: SchoolModule = {
  id: 'uhs',
  name: 'Truong Dai hoc Khoa hoc Suc khoe - DHQG TP.HCM',
  shortName: 'UHS',
  year: 2026,
  status: 'researching',
  summary:
    'Da co 6 nganh, dieu kien dau vao, thanh phan THPT/DGNL/HB thang 100, quy doi thanh phan bi thieu va diem cong; chua exact vi w1/w2 cong bo dang khoang.',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    partialCalculator: true,
    ...aggregateSchoolCapabilities(uhsAdmissionMethods),
  },
  Page: UhsPage,
};
