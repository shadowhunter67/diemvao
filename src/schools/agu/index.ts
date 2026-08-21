import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { aguAdmissionMethods } from './methods';

/**
 * Module AGU — research 2026-08-15 lật lại kết luận "domain không truy cập được" của lần research
 * trước (DNS timeout đó chỉ đúng với `agu.edu.vn`/`www.agu.edu.vn`; domain con thật sự dùng cho
 * tuyển sinh là `tuyensinh.agu.edu.vn`, truy cập được bình thường qua browser thật). Ngưỡng 43
 * ngành + hệ số β1/β2/β3 đã verified từ ảnh Thông báo 24/TB-HĐTS đã ký (xem `sources.ts`,
 * `evidence.ts`). Chưa có `Page` riêng (chỉ data/audit layer) — chưa đủ scope để dựng UI calculator
 * khi công thức quy đổi từng thành phần và bảng điểm cộng/ưu tiên vẫn còn là knowledge gap.
 */
export const aguModule: SchoolModule = {
  id: 'agu',
  name: 'Trường Đại học An Giang – ĐHQG TP.HCM',
  shortName: 'AGU',
  about:
    'Thành lập năm 1999 tại tỉnh An Giang, trở thành trường đại học thành viên ĐHQG-HCM từ 2019; thế mạnh nông nghiệp, tài nguyên và sư phạm.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'other',
  vnuhcm: true,
  summary:
    'Ngưỡng đảm bảo chất lượng 43 ngành và hệ số β1/β2/β3 (0,4/0,4/0,2) đã xác minh từ thông báo chính thức đã ký · Calculator chính xác đang chờ công thức quy đổi từng thành phần và bảng điểm cộng/ưu tiên chính thức (hiện chỉ có trong công cụ ước tính JS tự ghi "hệ số giả lập")',
  capabilities: {
    admissionInfo: true,
    programs: true,
    cutoffs: false,
    ...aggregateSchoolCapabilities(aguAdmissionMethods),
  },
};
