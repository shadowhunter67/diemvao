import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const iuKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'iu-diem-thuong-khuyen-khich-table',
    label: '"Điểm thưởng" và "điểm khuyến khích" (2/3 phần của Điểm cộng) nằm trong PDF 24 trang (Thông tin tuyển sinh 2026) — chưa đọc được, tránh OCR PDF dài',
    status: 'official-but-unparsed',
  },
  {
    id: 'iu-priority-points-table',
    label: 'Bảng mức Điểm ưu tiên theo khu vực/đối tượng (Khoản 7, Mục II) nằm trong cùng PDF 24 trang — chưa đọc được',
    status: 'official-but-unparsed',
  },
];
