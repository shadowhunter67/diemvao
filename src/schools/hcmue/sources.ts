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
];
