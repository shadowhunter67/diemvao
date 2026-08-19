import type { SourcedRule } from '../../core/evidence';
import { hcmueProgramThresholds } from './data/programs';

export const hcmueProgramThresholdEvidence = {
  value: { programCount: hcmueProgramThresholds.length, campus: 'hcmc' },
  evidence: [
    {
      sourceId: 'hcmue-thresholds-2026',
      location: 'Bảng ngưỡng đầu vào 47 ngành tại trụ sở chính TP.HCM, mã tuyển sinh SPS',
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
      location: 'Mục 2: Xét tuyển sử dụng kết quả kỳ thi tốt nghiệp THPT năm 2026',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<string>;
