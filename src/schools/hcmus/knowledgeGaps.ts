import type { KnowledgeGap } from '../../core/knowledgeStatus';

/**
 * Re-audit 2026-08-15: bonus table and priority reduction formula are verified
 * from official HCMUS pages. The remaining gap is a program-specific eligibility
 * lookup for national percentile conditions, not a final-score formula blocker.
 */
export const hcmusKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'hcmus-semiconductor-percentile',
    label:
      'Dieu kien nganh Thiet ke vi mach/Cong nghe ban dan can nguong Toan top 20% va to hop top 25% toan quoc theo du lieu Bo GD&DT; UniscoreVN chua co bang bach phan vi quoc gia de tra.',
    status: 'incomplete',
    scoreAffecting: false,
    impact: 'eligibility-warning',
  },
];
