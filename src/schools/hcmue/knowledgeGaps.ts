import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const hcmueKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmue-program-combination-map-2026',
    label: 'Danh sách tổ hợp xét tuyển theo từng ngành HCMUE 2026 chưa được transcribe vào runtime.',
    status: 'official-but-unparsed',
    sourceId: 'hcmue-methods-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-context-guard',
  },
  {
    id: 'hcmue-current-cutoffs-2026',
    label: 'Điểm trúng tuyển 2026 theo ngành/phương thức chưa được tích hợp; ngưỡng đầu vào không được gán là điểm chuẩn.',
    status: 'incomplete',
    sourceId: 'hcmue-thresholds-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'cutoff-comparison-blocking',
  },
];
