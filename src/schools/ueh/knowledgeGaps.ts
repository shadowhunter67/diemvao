import type { KnowledgeGap } from '../../core/knowledgeStatus';

/** 2 khoảng trống chặn exact calculator UEH — cùng pattern với `schools/uit/knowledgeGaps.ts`. */
export const uehKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'ueh-final-conversion-step',
    label: 'Bước quy đổi cuối cùng từ (điểm thi thang 30 + học bạ) sang điểm xét thang 100 — nguồn chưa nêu rõ hệ số cụ thể',
    status: 'official-but-unparsed',
  },
  {
    id: 'ueh-bonus-priority-table',
    label: 'Bảng điểm cộng/điểm ưu tiên chính thức (mới thấy ví dụ minh họa, chưa phải bảng đầy đủ)',
    status: 'incomplete',
  },
];
