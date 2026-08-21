import type { SourcedRule } from '../../core/evidence';

export const huitThptExamThresholdEvidence = {
  value: { standard: 16, law: 20 },
  evidence: [
    {
      sourceId: 'huit-quality-threshold-2026',
      location:
        'Mục "Cụ thể, đối với phương thức xét tuyển bằng điểm thi tốt nghiệp THPT năm 2026, điểm sàn nhóm ngành Luật và Luật kinh tế là 20 điểm; các ngành còn lại là 16 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
      note: 'Đây là ngưỡng CUỐI CÙNG (bản 10/07/2026, sau kỳ thi THPT) — không dùng số liệu tạm thời (15/18) của bản 19/05/2026 (`huit-admission-info-2026-superseded`).',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law', number>>;

export const huitTranscriptThresholdEvidence = {
  value: { standard: 20, law: 20 },
  evidence: [
    {
      sourceId: 'huit-quality-threshold-2026',
      location:
        'Mục "Đối với phương thức xét tuyển bằng kết quả học tập THPT, điểm sàn nhóm ngành Luật và Luật kinh tế là 20 điểm; các ngành còn lại là 20 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
      note: 'Nguồn không nêu công thức tính chi tiết (theo năm/theo học kỳ) — xem `huit-transcript-methodology-unpublished`.',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law', number>>;
