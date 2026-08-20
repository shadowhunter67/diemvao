import type { SourcedRule } from '../../core/evidence';

export const vluThptExamThresholdEvidence = {
  value: { standard: 15, law: 20, 'medicine-dentistry': 22, pharmacy: 20, 'nursing-medlab': 18 },
  evidence: [
    {
      sourceId: 'vlu-quality-threshold-2026',
      location:
        'Mục "Xét điểm thi tốt nghiệp THPT" — "Các ngành đào tạo tiêu chuẩn nhận hồ sơ xét tuyển từ 15,00 điểm. Riêng khối ngành Pháp luật và Khoa học Sức khỏe áp dụng ngưỡng đảm bảo chất lượng đầu vào theo quy định của Bộ Giáo dục & Đào tạo: Luật/Luật Kinh tế 20,00; Y khoa/Răng-Hàm-Mặt 22,00; Dược học 20,00; Điều dưỡng/KTXNYH 18,00."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-20',
      note: 'Cross-check khớp với `vlu-admission-info-2026` (bài công bố thông tin tuyển sinh 2026, mục "Điều kiện tuyển sinh chung").',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law' | 'medicine-dentistry' | 'pharmacy' | 'nursing-medlab', number>>;

export const vluTranscriptExtraRequirementEvidence = {
  value: {
    law: { minRank: 'gioi', altThptTotal30: 18, altGraduationScore10: 8.5 },
    'medicine-dentistry': { minRank: 'gioi', altThptTotal30: 20, altGraduationScore10: 8.5 },
    pharmacy: { minRank: 'gioi', altThptTotal30: 20, altGraduationScore10: 8.5 },
    'nursing-medlab': { minRank: 'kha', altThptTotal30: 16.5, altGraduationScore10: 6.5 },
  },
  evidence: [
    {
      sourceId: 'vlu-admission-info-2026',
      location:
        'Mục "Phương thức 2: Xét kết quả học tập cấp THPT (học bạ)" — điều kiện học lực lớp 12 (giỏi/khá) + tổng 3 môn TN THPT thay thế (20/16,5/18) hoặc điểm xét tốt nghiệp (8,5/6,5/8,5), áp dụng khối Sức khỏe (Y khoa/Dược/RHM, Điều dưỡng/KTXNYH) và Luật/Luật Kinh tế, ghi rõ "không áp dụng đối với phương thức xét điểm thi tốt nghiệp THPT".',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-20',
      note: 'Cross-check khớp với `vlu-quality-threshold-2026` (bài công bố điểm sàn), mục "Xét điểm học bạ và xét tuyển kết hợp".',
    },
  ],
} satisfies SourcedRule<
  Record<'law' | 'medicine-dentistry' | 'pharmacy' | 'nursing-medlab', { minRank: string; altThptTotal30: number; altGraduationScore10: number }>
>;
