import type { SourcedRule } from '../../core/evidence';

/**
 * Công thức xét tuyển kết hợp IUH 2026 (thang 30) — verbatim từ `iuh-formula-2026`:
 *
 * ĐXT = Max(XT1;XT2;XT3)
 * XT1 = 0.7×ĐK + 0.3×ĐHB + Đ(Kv;Đt) + ĐC
 * XT2 = ĐTN + Đ(Kv;Đt) + ĐC
 * XT3 = ĐĐGNL + Đ(Kv;Đt) + ĐC
 * ĐK = Max(ĐTN, ĐĐGNL); ĐĐGNL = (Kết quả ĐGNL × 30) / ĐTK
 *
 * ĐTK ("điểm thủ khoa của kỳ thi đánh giá năng lực năm 2026") là biến phụ thuộc kết quả thi thật,
 * KHÔNG phải hằng số công bố trong văn bản gốc IUH. Batch 2026-08-20 xác định ĐTK 2026 = 1139 qua
 * nguồn CHÍNH THỨC `iuh-vact-topscore-2026` (ĐHQG-HCM, đơn vị tổ chức kỳ thi tự công bố "điểm cao
 * nhất trong Kỳ thi V-ACT đợt 2 là 1.139 điểm") + cross-check độc lập với UFM (dùng chính số 1139 làm
 * trần bảng quy đổi bách phân vị của họ) — xem `calculator.ts:IUH_DTK_2026`. Cả 3 nhánh XT1/XT2/XT3
 * nay đều implement đầy đủ.
 */
export const iuhFormulaEvidence = {
  value: {
    xt1Formula: '0.7×ĐK + 0.3×ĐHB + Đ(Kv;Đt) + ĐC',
    xt2Formula: 'ĐTN + Đ(Kv;Đt) + ĐC',
    xt3Formula: 'ĐĐGNL + Đ(Kv;Đt) + ĐC',
    finalFormula: 'Max(XT1;XT2;XT3)',
    scale: 30,
    dgnlConversionFormula: 'ĐĐGNL = (Kết quả ĐGNL × 30) / ĐTK',
  },
  evidence: [
    {
      sourceId: 'iuh-formula-2026',
      location: 'Toàn văn 1 trang PDF "CÔNG THỨC TÍNH ĐIỂM XÉT TUYỂN ĐẠI HỌC CHÍNH QUY NĂM 2026" — mục a) Thang điểm, b) Nguyên tắc tính điểm.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-19',
      note: 'Đọc trực tiếp PDF gốc tại `tuyensinh.iuh.edu.vn` (không OCR/mirror).',
    },
    {
      sourceId: 'iuh-vact-topscore-2026',
      location: '"Thí sinh có điểm cao nhất trong Kỳ thi V-ACT đợt 2 là 1.139 điểm" — dùng làm ĐTK trong công thức ĐĐGNL.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-20',
      note: 'Nguồn của chính đơn vị tổ chức kỳ thi (ĐHQG-HCM), cross-check độc lập với UFM (dùng cùng số 1139 làm trần bảng quy đổi bách phân vị của họ).',
    },
  ],
} satisfies SourcedRule<{
  xt1Formula: string;
  xt2Formula: string;
  xt3Formula: string;
  finalFormula: string;
  scale: number;
  dgnlConversionFormula: string;
}>;

/** Ngưỡng đảm bảo chất lượng đầu vào — CHỈ track "Trụ sở chính TP.HCM, chương trình Chuẩn". */
export const iuhThresholdEvidence = {
  value: { standardThreshold30: 18 },
  evidence: [
    {
      sourceId: 'iuh-quality-threshold-2026',
      location:
        'Mục I.1: "Ngưỡng đảm bảo chất lượng đầu vào đối với trình độ đại học chính quy theo phương thức xét tuyển kết hợp cho tất cả các ngành (trừ ngành Dược học và các ngành thuộc lĩnh vực Pháp luật) — Chương trình chuẩn: 18.00 điểm." + "Lưu ý: ... được xác định theo thang điểm 30, không nhân hệ số, không bao gồm điểm ưu tiên khu vực, đối tượng và điểm cộng."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      publishedAt: '2026-07-10',
      verifiedAt: '2026-08-19',
    },
  ],
} satisfies SourcedRule<{ standardThreshold30: number }>;

/** Điểm ưu tiên khu vực/đối tượng — bảng CHUẨN QUỐC GIA (Quy chế tuyển sinh Bộ GDĐT, Thông tư
 * 08/2022 + sửa đổi), cross-checked nội bộ với 8 trường khác trong repo (HCMUT/UEL/HCMUS/USSH/IU/
 * TDTU/HUFLIT/UFM) dùng cùng công thức tỉ lệ 75%/25%/giảm dần khi (học lực+cộng)≥22,5/30 — IUH không
 * tự công bố bảng số riêng trong 2 văn bản đã đọc, chỉ ghi "Đ(Kv;Đt): Điểm ưu tiên khu vực, đối tượng
 * theo quy định của Bộ Giáo dục và Đào tạo" trong công thức. */
export const iuhPriorityEvidence = {
  value: {
    regionPoints30: { KV1: 0.75, 'KV2-NT': 0.5, KV2: 0.25, KV3: 0 },
    categoryPoints30: { UT1: 2, UT2: 1 },
    reductionThreshold30: 22.5,
    reductionDivisor30: 7.5,
  },
  evidence: [
    {
      sourceId: 'iuh-formula-2026',
      location: '"Đ(Kv; Đt): Điểm ưu tiên khu vực, đối tượng theo quy định của Bộ Giáo dục và Đào tạo" — IUH không tự công bố bảng số riêng, dùng bảng chuẩn quốc gia cross-check với 8 trường khác trong repo.',
      verification: 'cross-checked' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-19',
      note: 'Xem knowledgeGaps.ts:iuh-priority-table-not-iuh-specific — cross-checked, KHÔNG verified trực tiếp từ nguồn IUH.',
    },
  ],
} satisfies SourcedRule<{ regionPoints30: Record<string, number>; categoryPoints30: Record<string, number>; reductionThreshold30: number; reductionDivisor30: number }>;

/** Điểm cộng (Điểm xét thưởng — Phụ lục 1, 4/7 dòng tự chứa; Điểm khuyến khích — Phụ lục 2, đầy đủ). */
export const iuhBonusEvidence = {
  value: {
    academicAward30: { second: 1.5, other: 1.25 },
    scienceContestAward30: { second: 1.5, other: 1.25 },
    threeYearExcellent30: 1.25,
    otherOutstandingAchievement30: 0.75,
    rewardCap30: 1.5,
    englishEncouragement30: { 'ielts4.5': 0.5, 'ielts5.0': 0.75, 'ielts5.5': 1.0, 'ielts6.0': 1.25, 'ielts6.5+': 1.5 },
  },
  evidence: [
    {
      sourceId: 'iuh-bonus-appendix-2026',
      location:
        'Phụ lục 1, bảng 7 dòng: dòng 1 (HSG/Olympic cấp tỉnh/tp: giải Nhì trở lên 1,50; giải khác 1,25) · dòng 2 (Khoa học kỹ thuật cấp tỉnh/tp: giải Nhì trở lên 1,50; giải khác 1,25) · dòng 3 (học lực giỏi cả 3 năm 10/11/12: 1,25) · dòng 4 (thành tích nổi bật khác được xác nhận: 0,75) · "Lưu ý: ... điểm xét thưởng sẽ được tính cho tất cả các thành tích nhưng tổng điểm không quá 1,5 điểm." Dòng 5-7 (trường ký kết hợp tác/trường chuyên/Top trường THPT) tham chiếu danh mục tra cứu động, KHÔNG đưa vào bảng này — xem knowledgeGaps.ts.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      publishedAt: '2026-04-16',
      verifiedAt: '2026-08-19',
    },
    {
      sourceId: 'iuh-bonus-appendix-2026',
      location:
        'Phụ lục 2, mục 1 "Mức điểm khuyến khích": IELTS 4.5→0,50; 5.0→0,75; 5.5→1,00; 6.0→1,25; ≥6.5→1,50. Mục 3: bảng quy đổi TOEIC(4 kỹ năng)/VSTEP/TOEFL ITP/TOEFL iBT sang mốc IELTS tương đương.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      publishedAt: '2026-04-16',
      verifiedAt: '2026-08-19',
    },
  ],
} satisfies SourcedRule<{
  academicAward30: { second: number; other: number };
  scienceContestAward30: { second: number; other: number };
  threeYearExcellent30: number;
  otherOutstandingAchievement30: number;
  rewardCap30: number;
  englishEncouragement30: Record<string, number>;
}>;
