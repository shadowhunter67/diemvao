import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hubAdmissionMethods } from './methods';

/**
 * Module HUB (Trường Đại học Ngân hàng TP. Hồ Chí Minh, mã trường NHS) — research 2026-08-21,
 * đọc trực tiếp thông báo chính thức `tuyensinh.hub.edu.vn` (xem `sources.ts`). Ngưỡng đảm bảo
 * chất lượng đầu vào theo nhóm ngành cho cả 3 phương thức (thi TN THPT/Tổng hợp/V-SAT: 15/30
 * chung, 20/30 khối Luật kèm điều kiện môn, IELTS≥5.5 riêng Elite Class) đã verified từ 1 thông
 * báo chính thức đọc trực tiếp qua browser thật. Chưa có `Page` riêng (chỉ data/eligibility
 * layer, như VLU/AGU) — quy đổi điểm trúng tuyển tương đương giữa các phương thức/tổ hợp (Phụ
 * lục I/II) vẫn là knowledge gap (xem `knowledgeGaps.ts`).
 */
export const hubModule: SchoolModule = {
  id: 'hub',
  name: 'Trường Đại học Ngân hàng TP. Hồ Chí Minh',
  shortName: 'HUB',
  about: 'Trường đại học công lập trực thuộc Ngân hàng Nhà nước Việt Nam, đào tạo mạnh về tài chính - ngân hàng, kinh tế và luật kinh tế.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Ngưỡng đảm bảo chất lượng đầu vào theo nhóm ngành (thi TN THPT/Tổng hợp/V-SAT: 15/30 các ngành khác; 20/30 khối Luật kèm điều kiện môn Toán/Ngữ văn theo tổ hợp; IELTS ≥5.5 riêng Tài chính - Ngân hàng Elite Class) đã xác minh từ thông báo chính thức tuyensinh.hub.edu.vn (11/07/2026) · Quy đổi điểm trúng tuyển tương đương giữa phương thức/tổ hợp (Phụ lục I bảng phân vị V-SAT, Phụ lục II khung quy đổi Tổng hợp) đang chờ đọc được bảng số liệu đầy đủ',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hubAdmissionMethods),
  },
};
