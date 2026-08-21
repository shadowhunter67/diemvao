import type { SourcedRule } from '../../core/evidence';

export const hubStandardThresholdEvidence = {
  value: { standard: 15, 'finance-banking-elite': 15, law: 20 },
  evidence: [
    {
      sourceId: 'hub-quality-threshold-2026',
      location:
        'Mục I.1 — "Các ngành đào tạo tiêu chuẩn nhận hồ sơ xét tuyển từ 15,00 điểm" (thi TN THPT/Tổng hợp/V-SAT, chưa cộng điểm ưu tiên/điểm cộng); áp dụng chung cho ngành Tài chính - Ngân hàng, Chương trình Tinh hoa (Elite Class) — chỉ cộng thêm điều kiện IELTS ≥5.5 riêng.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
    },
  ],
} satisfies SourcedRule<Record<'standard' | 'finance-banking-elite' | 'law', number>>;

export const hubLawThresholdEvidence = {
  value: { thptExamThreshold30: 20, comprehensiveVsatRankPathThreshold30: 18, graduationScoreThreshold10: 8.5 },
  evidence: [
    {
      sourceId: 'hub-quality-threshold-2026',
      location:
        'Mục I.2 — "ngưỡng điểm đầu vào đối với các chương trình đào tạo thuộc lĩnh vực pháp luật là 20 điểm (áp dụng cho thí sinh khu vực 3)... không nhân hệ số, không tính điểm cộng... (các tổ hợp xét tuyển có môn Toán không có môn Văn: A00, A01, D07 thì điểm môn Toán >=6; Các tổ hợp có cả môn Toán và môn Văn: C01, C02, D01 thì điểm môn Toán >=6 và Ngữ văn >=6)". Phương thức Tổng hợp/V-SAT (thí sinh tốt nghiệp 2026): thêm 2 điều kiện thay thế — học lực lớp 12 mức Tốt (giỏi trở lên) + tổng 3 môn ≥18 (cùng điều kiện môn), hoặc điểm xét tốt nghiệp THPT ≥8,5.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
      note: 'Điều kiện dành cho thí sinh khu vực 3; nguồn không nêu ngưỡng tương đương cho khu vực khác (`hub-law-other-priority-zones-threshold-unknown`).',
    },
  ],
} satisfies SourcedRule<{ thptExamThreshold30: number; comprehensiveVsatRankPathThreshold30: number; graduationScoreThreshold10: number }>;

export const hubEliteIeltsRequirementEvidence = {
  value: { ieltsMin: 5.5 },
  evidence: [
    {
      sourceId: 'hub-quality-threshold-2026',
      location:
        'Mục I.1 — "Đối với ngành Tài chính – Ngân hàng, Chương trình Tinh hoa (Elite Class) (mới): Ngoài việc đáp ứng ngưỡng bảo đảm chất lượng đầu vào theo quy định nêu trên, thí sinh phải có chứng chỉ tiếng Anh quốc tế IELTS từ 5.5 trở lên hoặc chứng chỉ tiếng Anh quốc tế khác được quy đổi tương đương theo quy định của Trường."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-21',
      note: 'Bảng quy đổi chứng chỉ tiếng Anh khác ngoài IELTS chưa tìm được (`hub-elite-ielts-equivalent-table-not-found`).',
    },
  ],
} satisfies SourcedRule<{ ieltsMin: number }>;
