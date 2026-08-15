import type { KnowledgeGap } from '../../core/knowledgeStatus';

export const hcmueKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmue-program-combination-map-2026',
    label: 'Danh sach to hop xet tuyen theo tung nganh HCMUE 2026 chua duoc transcribe vao runtime.',
    status: 'official-but-unparsed',
    sourceId: 'hcmue-methods-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'eligibility-context-guard',
  },
  {
    id: 'hcmue-current-cutoffs-2026',
    label: 'Diem trung tuyen 2026 theo nganh/phuong thuc chua duoc tich hop; nguong dau vao khong duoc gan la diem chuan.',
    status: 'incomplete',
    sourceId: 'hcmue-thresholds-2026',
    scoreAffecting: false,
    implemented: false,
    impact: 'cutoff-comparison-blocking',
  },
];
