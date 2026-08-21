import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { ftuAdmissionMethods } from './methods';

export const ftuModule: SchoolModule = {
  id: 'ftu',
  name: 'Trường Đại học Ngoại thương',
  shortName: 'FTU',
  about: 'Đại học công lập trọng điểm khối kinh tế đối ngoại, đào tạo kinh doanh quốc tế, tài chính, luật và ngoại ngữ thương mại.',
  year: 2026,
  status: 'researching',
  summary:
    'Phương thức xét tuyển bằng kết quả đánh giá năng lực/tư duy trong nước (HSA/V-ACT/TSA, không kết hợp chứng chỉ ngoại ngữ quốc tế) đã exact theo công thức công bố chính thức, gồm cả điểm thưởng và quy đổi điểm ưu tiên. Danh mục ngành, điểm chuẩn và các nhánh kết hợp chứng chỉ quốc tế chưa được nhập.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(ftuAdmissionMethods),
  },
};

