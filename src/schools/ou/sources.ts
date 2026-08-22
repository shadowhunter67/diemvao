import type { AdmissionSource } from '../../core/sourceRegistry';

export const ouSources: Omit<AdmissionSource, 'schoolId'>[] = [
  {
    id: 'ou-quality-threshold-2026',
    publisher: 'Cổng thông tin tuyển sinh - Trường Đại học Mở TP.HCM',
    title: 'Thông báo ngưỡng bảo đảm chất lượng đầu vào xét tuyển đại học chính quy năm 2026',
    url: 'https://tuyensinh.ou.edu.vn/thong-bao-nguong-dam-bao-chat-luong-dau-vao-xet-tuyen-dai-hoc-chinh-quy-nam-2026',
    accessedAt: '2026-08-22',
    publishedAt: '2026-07-10',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'ou-equivalent-conversion-2026',
    publisher: 'Cổng thông tin tuyển sinh - Trường Đại học Mở TP.HCM',
    title: 'Thông báo quy tắc quy đổi điểm tương đương năm 2026',
    url: 'https://tuyensinh.ou.edu.vn/thong-bao-quy-tac-quy-doi-diem-tuong-duong-va-bang-quy-doi-diem-thi-vsat-diem-thi-danh-gia-nang-luc-dhqg-tp-ho-chi-minh-nam-2026',
    accessedAt: '2026-08-22',
    publishedAt: '2026-07-10',
    sourceType: 'official-admission',
    verification: 'incomplete',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
];
