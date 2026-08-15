import type { SourcedRule } from '../../core/evidence';
import { hcmueProgramThresholds } from './data/programs';

export const hcmueProgramThresholdEvidence = {
  value: { programCount: hcmueProgramThresholds.length, campus: 'hcmc' },
  evidence: [
    {
      sourceId: 'hcmue-thresholds-2026',
      location: 'Bang nguong dau vao 47 nganh tai tru so chinh TP.HCM, ma tuyen sinh SPS',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ programCount: number; campus: string }>;

export const hcmueThptFormulaEvidence = {
  value: 'DXT = M1 + M2 + M3 + DUT, rounded to two decimals',
  evidence: [
    {
      sourceId: 'hcmue-methods-2026',
      location: 'Muc 2: Xet tuyen su dung ket qua ky thi tot nghiep THPT nam 2026',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<string>;
