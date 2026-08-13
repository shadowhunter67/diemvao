import type { SourcedRule } from '../../core/evidence';
import { IU_HS3_THPT_TO_DGNL, IU_K1_THPT, IU_K2_DGNL, IU_K3_TRANSCRIPT } from './calculator';

export const iuAcademicWeightsEvidence = {
  value: { k1: IU_K1_THPT, k2: IU_K2_DGNL, k3: IU_K3_TRANSCRIPT, hs3: IU_HS3_THPT_TO_DGNL },
  evidence: [
    {
      sourceId: 'iu-method2-2026',
      location: 'Mục II.2.a: Điểm học lực = k1*THPT + k2*ĐGNL + k3*Học bạ (k1=40%, k2=50%, k3=10%), Hs3=0.83 khi không có ĐGNL 2026',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ k1: number; k2: number; k3: number; hs3: number }>;
