import type { SourcedRule } from '../../core/evidence';

export const uefThptExamThresholdEvidence = {
  value: { standard: 15, law: 20 },
  evidence: [
    {
      sourceId: 'uef-quality-threshold-2026',
      location:
        '"Xét kết quả kỳ thi tốt nghiệp THPT năm 2026: 15 điểm (tổng điểm tổ hợp 3 môn)." / "Riêng nhóm ngành Luật (Luật, Luật Kinh tế, Luật quốc tế và Luật thương mại quốc tế)... phải đáp ứng mức điểm ngưỡng đầu vào theo quy định của Bộ Giáo dục và Đào tạo đối với lĩnh vực pháp luật là từ 20 điểm trở lên."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law', number>>;

export const uefTranscriptStandardThresholdEvidence = {
  value: { standard: 18 },
  evidence: [
    {
      sourceId: 'uef-quality-threshold-2026',
      location: '"Xét học bạ THPT (điểm trung bình tổ hợp 3 môn của 6 học kỳ): 18 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard', number>>;

export const uefLawNonThptExtraRequirementEvidence = {
  value: { minRank: 'tot-gioi' as const, altThptTotal30: 18, altGraduationScore10: 8.5 },
  evidence: [
    {
      sourceId: 'uef-quality-threshold-2026',
      location:
        '"Đối với các phương thức xét tuyển không sử dụng kết quả kỳ thi tốt nghiệp THPT... thí sinh cần đáp ứng đồng thời các điều kiện... Kết quả trung bình chung học tập được đánh giá mức tốt (học lực xếp loại từ Tốt/Giỏi trở lên) cả năm lớp 12... và tổng điểm 03 môn thi tốt nghiệp THPT theo tổ hợp xét tuyển... đạt 18,00 điểm trở lên hoặc điểm xét tốt nghiệp THPT từ 8,5 trở lên."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<{ minRank: 'tot-gioi'; altThptTotal30: number; altGraduationScore10: number }>;
