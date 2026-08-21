import type { SchoolModule } from '../../core/schoolModule';
import { aggregateSchoolCapabilities } from '../../core/admissionMethod';
import { hcmuteAdmissionMethods } from './methods';

/**
 * Module HCMUTE — research 2026-08-18 (batch 1) tìm được văn bản chính thức "THÔNG TIN TUYỂN SINH
 * ĐẠI HỌC CHÍNH QUY NĂM 2026" số 1691/ĐHCNKT-ĐT (đã ký, có Phụ lục 4 ví dụ minh họa tính điểm tay
 * khớp chính xác công thức công bố — Tier A worked example, xem `sources.ts`/`evidence.ts`).
 * Re-audit 2026-08-18 (batch 2): hệ số tương quan a=0,8/b=0,8 đã được công bố chính thức (Thông
 * báo 2092/TB-ĐHCNKT, 07/7/2026) — HLy.1/HLy.2/HLy.3/HLy.max đều tính được (HLy.2 vẫn cần ĐXTT cho
 * thí sinh khai học bạ, xem `knowledgeGaps.ts`). Ngưỡng đầu vào chung, bảng điểm ưu tiên + công
 * thức giảm, ĐXTCN (2/4 mục) đã verified. Chưa đủ để unlock exact calculator ở mức method (còn 3
 * blocker: ĐXTT, ngưỡng riêng SP tiếng Anh/SP công nghệ/Luật chưa wire theo ngành, ĐXTCN mục
 * 1/4-7) — xem `knowledgeGaps.ts`. Chưa có `Page` riêng (chỉ data/audit layer, giống AGU).
 */
export const hcmuteModule: SchoolModule = {
  id: 'hcmute',
  name: 'Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh',
  shortName: 'HCMUTE',
  about:
    'Đại học công lập tự chủ tài chính, tiền thân từ năm 1962; đổi tên từ Đại học Sư phạm Kỹ thuật TP.HCM sang tên hiện tại cuối năm 2025.',
  year: 2026,
  status: 'researching',
  ownership: 'public',
  region: 'hcm',
  vnuhcm: false,
  summary:
    'Ngưỡng đầu vào chung, bảng điểm ưu tiên khu vực/đối tượng + công thức giảm, và điểm học lực HLy.1/HLy.2/HLy.3/HLy.max (hệ số tương quan a=b=0,8 công bố chính thức 07/7/2026) đã xác minh từ văn bản chính thức đã ký · HLy.2 (nhánh học bạ) vẫn chờ ĐXTT theo nhóm trường (Bảng 3, phụ lục chưa import); ngưỡng riêng SP tiếng Anh/SP công nghệ/Luật và ĐXTCN mục 1/4-7 chưa wire',
  capabilities: {
    admissionInfo: true,
    programs: false,
    cutoffs: false,
    ...aggregateSchoolCapabilities(hcmuteAdmissionMethods),
  },
};
