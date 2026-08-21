import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { ctuAdmissionMethods } from './methods';

/**
 * Module CTU (Trường Đại học Cần Thơ, mã trường TCT) — research 2026-08-21, đọc trực tiếp thông
 * báo chính thức `tuyensinh.ctu.edu.vn` (xem `sources.ts`). Điều kiện 1 (tổng 3 môn thi TN THPT
 * 2026 ≥15/30, không môn nào ≤1,0) verified, áp dụng chung mọi ngành/phương thức — đây là điều
 * kiện CẦN chứ chưa phải ĐỦ, điểm sàn chi tiết theo mã xét tuyển (điều kiện 2) nằm trong phụ lục
 * PDF ảnh scan chưa đọc được. Nhóm pháp luật/sư phạm (trừ GDMN/GDTC) có đường thay thế qua học
 * lực lớp 12 + điểm thi TN THPT/điểm xét tốt nghiệp THPT, đọc trực tiếp từ văn bản — nhóm sư phạm
 * có thể kết luận `eligible` chắc chắn qua đường này, nhóm pháp luật còn vướng điều kiện tổ hợp
 * môn cần bảng quy đổi V-SAT/học bạ (chưa có).
 */
export const ctuModule: SchoolModule = {
  id: 'ctu',
  name: 'Trường Đại học Cần Thơ',
  shortName: 'CTU',
  about: 'Đại học vùng công lập trọng điểm khu vực Đồng bằng sông Cửu Long, đào tạo đa ngành: nông nghiệp, thủy sản, kỹ thuật, CNTT, kinh tế, sư phạm, y dược.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'other',
  vnuhcm: false,
  summary:
    'Điều kiện 1 (tổng 3 môn thi TN THPT 2026 ≥15/30, không môn nào ≤1,0) đã xác minh từ thông báo chính thức tuyensinh.ctu.edu.vn (08/7/2026), áp dụng chung mọi ngành/phương thức — điều kiện CẦN, chưa phải ĐỦ · Điểm sàn chi tiết theo mã xét tuyển (điều kiện 2, Phương thức 2) nằm trong phụ lục PDF ảnh scan chưa đọc được · Nhóm pháp luật/sư phạm (trừ Giáo dục Mầm non/Thể chất) có đường thay thế qua học lực lớp 12 + điểm thi TN THPT/điểm xét tốt nghiệp THPT (Phương thức 3/4) — nhóm sư phạm kết luận được eligible chắc chắn qua đường này, nhóm pháp luật còn vướng điều kiện tổ hợp môn cần bảng quy đổi V-SAT/học bạ chưa có.',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(ctuAdmissionMethods),
  },
};
