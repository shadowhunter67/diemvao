import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HcmueSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
}

export const hcmueSources: HcmueSource[] = [
  {
    id: 'hcmue-methods-2026',
    publisher: 'Trường Đại học Sư phạm TP.HCM',
    title: 'Phương thức tuyển sinh các ngành đào tạo trình độ đại học và ngành Giáo dục Mầm non trình độ cao đẳng hệ chính quy năm 2026',
    url: 'https://tuyensinh.hcmue.edu.vn/index.php?Itemid=9677&catid=4069%3Atin-tc&id=27804%3Aphng-thc-tuyen-sinh-cac-nganh-ao-tao-trinh-o-ai-hoc-va-nganh-giao-duc-mam-non-trinh-o-cao-ng-he-chinh-quy-nm-2026&lang=vi&option=com_content&site=183&view=article',
    accessedAt: '2026-08-15',
    publishedAt: '2026-04-14',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmue-thresholds-2026',
    publisher: 'Trường Đại học Sư phạm TP.HCM',
    title: 'Thông báo ngưỡng bảo đảm chất lượng đầu vào các ngành trình độ đại học và ngành Giáo dục Mầm non trình độ cao đẳng chính quy năm 2026',
    url: 'https://tuyensinh.hcmue.edu.vn/index.php?Itemid=9677&id=27823&lang=vi&option=com_content&site=183&view=article',
    accessedAt: '2026-08-15',
    publishedAt: '2026-07-11',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmue-cutoffs-2026',
    publisher: 'Trường Đại học Sư phạm TP.HCM',
    title:
      'Thông báo kết quả xét tuyển các ngành đào tạo trình độ đại học, ngành Giáo dục Mầm non trình độ cao đẳng hệ chính quy năm 2026',
    url: 'http://tuyensinh.hcmue.edu.vn/index.php?option=com_content&view=article&id=27828&catid=4069&Itemid=9677&lang=vi&site=183',
    accessedAt: '2026-08-19',
    publishedAt: '2026-08-11',
    sourceType: 'official-school',
    verification: 'verified',
  },
];

/**
 * File điểm chuẩn 2026 đính kèm bài thông báo `hcmue-cutoffs-2026` (Google Drive, không phải
 * text/HTML machine-readable). Đã thử tải cả hai file (`fetch`/`curl` qua link download trực
 * tiếp `drive.usercontent.google.com/download?id=...`) ngày 2026-08-19 — Google Drive trả lỗi
 * "Sorry, the owner hasn't given you permission to download this file." cho cả hai, nên UniscoreVN
 * không đọc được bảng điểm theo ngành qua Drive. Người dùng đã tự chụp ảnh bảng công bố gốc và
 * cung cấp trực tiếp cùng ngày 2026-08-19 — số liệu trong `src/schools/hcmue/data/cutoffs.ts`
 * (47 ngành trụ sở chính + 15 ngành 2 phân hiệu) lấy từ ảnh đó, không phải từ 2 link Drive dưới.
 * Giữ 2 link này để tham chiếu/đối chiếu sau nếu trường mở quyền tải.
 */
export const hcmueCutoffFileLinks2026 = {
  priorityAdmission: 'https://drive.google.com/open?id=1ylqhRWfKWs11yxAG7PM4EV4cmj9BuvpY&usp=drive_fs',
  otherMethods: 'https://drive.google.com/open?id=1lANt8eWxrU94gXvWcs32j8Jyqy4k40xc&usp=drive_fs',
  lookupPortal: 'https://xettuyen.hcmue.edu.vn/tra-cuu-ket-qua',
};
