import type { KnowledgeGap } from '../../core/knowledgeStatus';

/** 4 khoảng trống chặn exact calculator UIT — trước đây hard-code trong `UitInfoPage.tsx`,
 * chuyển thành data để domain layer là nguồn sự thật duy nhất (UI chỉ render, không tự liệt kê
 * lại). Tất cả đều 'official-but-unparsed' (nguồn tồn tại dạng ảnh/PDF, chưa đọc được text) —
 * KHÔNG phải 'incomplete' (không có nguồn) hay 'provisional' (trường tự ghi dự kiến). */
export const uitKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'uit-percentile-conversion',
    label: 'Công thức/bảng quy đổi bách phân vị giữa THPT và ĐGNL',
    status: 'official-but-unparsed',
  },
  {
    id: 'uit-transcript-formula',
    label: 'Cách tính điểm Học bạ',
    status: 'official-but-unparsed',
  },
  {
    id: 'uit-sat-act-conversion',
    label: 'Cách quy đổi SAT/ACT sang thành phần ĐGNL',
    status: 'official-but-unparsed',
  },
  {
    id: 'uit-ib-alevel-conversion',
    label: 'Cách quy đổi IB/A-Level sang thành phần THPT',
    status: 'official-but-unparsed',
  },
];
