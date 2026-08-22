import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const sguKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'sgu-program-threshold-table-not-imported',
    label: 'Bảng ngưỡng đầu vào 47 ngành/chương trình SGU 2026 chưa được nhập thành dataset runtime.',
    status: 'official-but-unparsed',
    sourceId: 'sgu-quality-threshold-2026',
    scoreAffecting: true,
    knownData: ['Điểm sàn SGU 2026 dao động khoảng 16-23/30 theo ngành/chương trình'],
    impact: 'Compare chỉ loại chắc chắn hồ sơ dưới 16/30; chưa kết luận đạt cho từng ngành.',
  },
  {
    id: 'sgu-conversion-and-bonus-appendices-not-imported',
    label: 'Các phụ lục quy đổi chứng chỉ tiếng Anh, V-SAT/ĐGNL và bảng điểm cộng SGU 2026 chưa được nhập.',
    status: 'official-but-unparsed',
    sourceId: 'sgu-admission-info-2026',
    scoreAffecting: true,
    impact: 'Chưa bật scoreConversion/exactCalculator; cần đọc phụ lục chính thức hoặc file đính kèm.',
  },
  {
    id: 'sgu-cutoff-image-not-imported',
    label: 'Thông báo điểm trúng tuyển SGU 2026 tồn tại dạng ảnh/file trên trang chính thức nhưng chưa nhập bảng điểm chuẩn.',
    status: 'official-but-unparsed',
    sourceId: 'sgu-quality-threshold-2026',
    scoreAffecting: false,
  },
];
