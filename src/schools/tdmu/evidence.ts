import type { SourcedRule } from '../../core/evidence';

/** Ngưỡng đầu vào theo phương thức thi TN THPT (thang 30, điểm thô — không cần quy đổi). */
export const tdmuThptExamThresholdEvidence = {
  value: { standard: 15, law: 20, teacher: 20 },
  evidence: [
    {
      sourceId: 'tdmu-quality-threshold-2026',
      location:
        '"Phương thức xét kết quả kỳ thi tốt nghiệp THPT năm 2026: 15 điểm" (45 ngành khác Luật/sư phạm); "20 điểm đối với phương thức xét kết quả kỳ thi tốt nghiệp THPT" (ngành Luật 7380101); "Ngưỡng đảm bảo chất lượng đầu vào của các ngành này [sư phạm, trừ Kiến trúc/Xây dựng] là 20 điểm" (chỉ dùng phương thức này).',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law' | 'teacher', number>>;

/** Ngưỡng đầu vào theo phương thức học bạ (thang 30 — điểm trung bình 3 môn tổ hợp, 6 học kỳ lớp
 * 10/11/12, cộng trực tiếp — KHÔNG qua bảng quy đổi trung gian). Chỉ áp dụng nhóm `standard`/`law`
 * (nhóm sư phạm CHỈ dùng phương thức thi TN THPT theo nguồn). */
export const tdmuTranscriptThresholdEvidence = {
  value: { standard: 16.5, law: 21.5 },
  evidence: [
    {
      sourceId: 'tdmu-quality-threshold-2026',
      location:
        '"Phương thức xét học bạ (điểm trung bình các môn năm lớp 10, 11 và 12 theo tổ hợp môn): 16,5 điểm" (45 ngành khác); "21,5 điểm đối với phương thức xét học bạ" (ngành Luật).',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law', number>>;

/** Ngưỡng đầu vào theo phương thức ĐGNL ĐHQG-HCM (thang 1200, điểm thô — khớp trực tiếp
 * `ApplicantProfile.exams.vact.total`). Chỉ áp dụng nhóm `standard`/`law`. */
export const tdmuVactThresholdEvidence = {
  value: { standard: 600, law: 750 },
  evidence: [
    {
      sourceId: 'tdmu-quality-threshold-2026',
      location:
        '"Phương thức xét kết quả kỳ thi đánh giá năng lực Đại học Quốc gia TP. Hồ Chí Minh năm 2026: 600 điểm" (45 ngành khác); "750 điểm đối với phương thức xét kết quả Kỳ thi đánh giá năng lực Đại học Quốc gia TP. Hồ Chí Minh" (ngành Luật).',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'law', number>>;
