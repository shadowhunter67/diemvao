import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface TdtuSource {
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

/**
 * Nguồn đã xác minh cho TDTU 2026 — research 2026-08-18. Trang "Phương thức tuyển sinh năm 2026"
 * là HTML text thật (không phải ảnh/PDF quét) chứa ĐẦY ĐỦ công thức PT1/PT2 dạng số cụ thể — Tier A
 * primary source, đọc trực tiếp qua browser. Phụ lục 5/6/7 (PDF, text layer đọc được) bổ sung bảng
 * số điểm ưu tiên/điểm thưởng/điểm xét thưởng. Phụ lục 2 (PDF, 24 trang, text layer đọc được, 119
 * dòng ngành/tổ hợp/ngưỡng) CHỈ dùng để xác nhận ngưỡng chung 15/30 áp dụng đa số ngành — UniscoreVN
 * CHƯA import toàn bộ danh mục 119 ngành/tổ hợp trong batch này (xem `knowledgeGaps.ts`).
 */
export const tdtuSources: TdtuSource[] = [
  {
    id: 'tdtu-admission-plan-2026',
    publisher: 'Trường Đại học Tôn Đức Thắng',
    title:
      'Phương thức tuyển sinh năm 2026 — PHƯƠNG ÁN TUYỂN SINH ĐẠI HỌC CHÍNH QUY NĂM 2026 (Trường Đại học Tôn Đức Thắng - Mã trường DTT), công thức Điểm xét tuyển PT1 (thang 100) và PT2/ĐGNL (thang 1200), công thức Điểm năng lực theo từng Đối tượng 1.1-1.5, công thức Điểm ưu tiên + quy tắc giảm',
    url: 'https://admission.tdtu.edu.vn/dai-hoc/tuyen-sinh/phuong-thuc-tuyen-sinh-2026',
    accessedAt: '2026-08-18',
    publishedAt: '2026-03-01',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'tdtu-pl5-priority-2026',
    publisher: 'Trường Đại học Tôn Đức Thắng',
    title: 'Phụ lục 5 — Quy định điểm ưu tiên khu vực, đối tượng năm 2026 (thang 30/100/1200)',
    url: 'https://admission.tdtu.edu.vn/sites/admission/files/Tuyen-sinh/2026/PATS2026-T03/PL5.Danh-muc-diem-utkvdt-2026.pdf',
    accessedAt: '2026-08-18',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'tdtu-pl6-bonus-award-2026',
    publisher: 'Trường Đại học Tôn Đức Thắng',
    title: 'Phụ lục 6 — Quy định điểm thưởng Phương thức 1 năm 2026 (thang 100, trần 10)',
    url: 'https://admission.tdtu.edu.vn/sites/admission/files/Tuyen-sinh/2026/PATS2026-T03/PL6.Quy-dinh-diem-thuong-2026.pdf',
    accessedAt: '2026-08-18',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'tdtu-pl7-merit-award-2026',
    publisher: 'Trường Đại học Tôn Đức Thắng',
    title: 'Phụ lục 7 — Quy định điểm xét thưởng Phương thức 1 năm 2026 (thang 100, trần 5)',
    url: 'https://admission.tdtu.edu.vn/sites/admission/files/Tuyen-sinh/2026/PATS2026-T03/PL7.Quy-dinh-diem-xet-thuong-2026.pdf',
    accessedAt: '2026-08-18',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
  {
    id: 'tdtu-pl2-programs-pt1-2026',
    publisher: 'Trường Đại học Tôn Đức Thắng',
    title:
      'Phụ lục 2 — Danh mục ngành, tổ hợp, điều kiện xét tuyển Phương thức 1 năm 2026 (119 dòng ngành/chương trình, 24 trang) — dùng để xác nhận ngưỡng chung 15/30 áp dụng đa số ngành; UniscoreVN chưa import đầy đủ danh mục',
    url: 'https://admission.tdtu.edu.vn/sites/admission/files/Tuyen-sinh/2026/PATS2026-T03/PL2.Danh-muc-nganh-tuyen-sinh-PT1-2026.pdf',
    accessedAt: '2026-08-18',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, status: 'current' },
  },
];
