import type { SourcedRule } from '../../core/evidence';

export const hsuThptExamThresholdEvidence = {
  value: { standard: 15, law: 20 },
  evidence: [
    {
      sourceId: 'hsu-quality-threshold-2026',
      location: '"Điểm sàn theo phương thức xét tuyển kết quả Kỳ thi tốt nghiệp THPT năm 2026: 15 điểm trở lên."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
    {
      sourceId: 'hsu-law-threshold-2026',
      location: '"điểm sàn đối với khối ngành Pháp luật là 20 điểm (tổng điểm ba môn theo tổ hợp xét tuyển, chưa nhân hệ số, đã bao gồm điểm ưu tiên nếu có)."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law', number>>;

export const hsuTranscriptThresholdEvidence = {
  value: { standard: 18 },
  evidence: [
    {
      sourceId: 'hsu-quality-threshold-2026',
      location:
        '"Điểm sàn theo phương thức xét tuyển kết quả học bạ Trung học phổ thông: 18 điểm trở lên với hình thức xét điểm trên kết quả học tập (học bạ) trung học phổ thông theo tổ hợp 03 môn (6HK)."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
      note: 'Ngưỡng nhóm Luật cho phương thức học bạ chưa công bố — xem `hsu-law-non-thpt-threshold-unpublished`.',
    },
  ],
} satisfies SourcedRule<Record<'standard', number>>;
