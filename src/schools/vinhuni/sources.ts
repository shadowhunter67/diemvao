import type { AdmissionSource } from '../../core/sourceRegistry';

export const vinhuniSources: Omit<AdmissionSource, 'schoolId'>[] = [
  {
    id: 'vinhuni-quality-threshold-conversion-2026',
    publisher: 'Trường Đại học Vinh',
    title: 'Ngưỡng bảo đảm chất lượng đầu vào và quy tắc quy đổi tương đương để xét tuyển đại học chính quy năm 2026',
    url: 'https://tuyensinh.vinhuni.edu.vn/cac-nganh-dai-hoc-chinh-quy/seo/nguong-bao-dam-chat-luong-dau-vao-va-quy-tac-quy-doi-tuong-duong-de-xet-tuyen-dai-hoc-chinh-quy-nam-2026-144967',
    accessedAt: '2026-08-22',
    publishedAt: '2026-07-09',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'vinhuni-admission-adjustment-2026',
    publisher: 'Trường Đại học Vinh',
    title: 'Điều chỉnh Thông tin tuyển sinh đại học chính quy năm 2026',
    url: 'https://tuyensinh.vinhuni.edu.vn/tin-tuc-tuyen-sinh/seo/dieu-chinh-thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026-144834',
    accessedAt: '2026-08-22',
    publishedAt: '2026-06-27',
    sourceType: 'official-admission',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
];
