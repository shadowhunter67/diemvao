import type { SourcedRule } from '../../core/evidence';

export const nttuTranscriptThresholdEvidence = {
  value: { standard: 18, law: 18, medicine: 23, dentistry: 23, 'traditional-medicine-pharmacy': 21, 'nursing-prevention': 19 },
  evidence: [
    {
      sourceId: 'nttu-quality-threshold-2026',
      location:
        'Bảng tra cứu điểm sàn nhanh (cột Học bạ) — "Y khoa: 23", "Răng – Hàm – Mặt: 23", "Y học cổ truyền & Dược học: 21", "Điều dưỡng, Y học dự phòng, Kỹ thuật xét nghiệm y học, Kỹ thuật phục hồi chức năng: 19", "Luật, Luật Kinh tế, Luật Kinh tế (Chuẩn quốc tế): Học bạ từ 18 điểm", "Tất Cả Các Ngành Còn Lại: 18".',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law' | 'medicine' | 'dentistry' | 'traditional-medicine-pharmacy' | 'nursing-prevention', number>>;

export const nttuTranscriptExtraRequirementEvidence = {
  value: {
    law: { minRank: 'tot', altThptTotal30: 18, altGraduationScore10: 8.5 },
    medicine: { minRank: 'tot', altThptTotal30: 20, altGraduationScore10: 8.5 },
    dentistry: { minRank: 'tot', altThptTotal30: 20, altGraduationScore10: 8.5 },
    'traditional-medicine-pharmacy': { minRank: 'tot', altThptTotal30: 20, altGraduationScore10: 8.5 },
    'nursing-prevention': { minRank: 'kha', altThptTotal30: 16.5, altGraduationScore10: 6.5 },
  },
  evidence: [
    {
      sourceId: 'nttu-quality-threshold-2026',
      location:
        '"Điều kiện đi kèm: Học lực lớp 12 đạt loại Tốt và tổng điểm 3 môn thi từ 20 điểm trở lên HOẶC Điểm xét tốt nghiệp THPT từ 8.5 trở lên" (nhóm Y khoa/RHM/YHCT+Dược); "Điều kiện đi kèm: Học lực lớp 12 đạt loại Khá và tổng điểm 3 môn thi từ 16.5 điểm trở lên HOẶC Điểm xét tốt nghiệp THPT từ 6.5 trở lên" (nhóm Điều dưỡng...); "Điều kiện đi kèm: Học lực lớp 12 đạt loại Tốt và tổng điểm 3 môn thi từ 18 điểm trở lên HOẶC Điểm xét tốt nghiệp THPT từ 8.5 trở lên" (nhóm Luật).',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<
  Record<'law' | 'medicine' | 'dentistry' | 'traditional-medicine-pharmacy' | 'nursing-prevention', { minRank: string; altThptTotal30: number; altGraduationScore10: number }>
>;
