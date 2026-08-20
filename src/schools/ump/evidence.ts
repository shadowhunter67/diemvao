import type { SourcedRule } from '../../core/evidence';

/**
 * Công thức Điểm xét tuyển (ĐXT) — Thông báo 2415/TB-ĐHYD mục 6.2.2: "Điểm xét tuyển = Tổng điểm 3
 * môn (a) + Điểm ưu tiên (b) + Điểm khuyến khích (c)", tổng 3 môn theo tổ hợp thang 30, KHÔNG nhân
 * hệ số môn nào.
 */
export const umpFormulaEvidence = {
  value: {
    formulaDescription: 'ĐXT = Tổng điểm 3 môn theo tổ hợp (thang 30, không nhân hệ số) + Điểm ưu tiên + Điểm khuyến khích, kẹp thang 30.',
    roundingDescription: 'Làm tròn toán học đến hàng phần trăm, thực hiện SAU KHI đã cộng đầy đủ điểm ưu tiên và điểm khuyến khích (không làm tròn từng bước trung gian).',
  },
  evidence: [
    {
      sourceId: 'ump-admission-notice-2415-2026',
      location:
        'Mục 6.2.2 (trang 5): "Điểm xét tuyển: là tổng điểm 03 môn (trong tổ hợp xét tuyển) theo thang điểm 30 đối với từng môn (không nhân hệ số) cộng với điểm ưu tiên và điểm khuyến khích (nếu có). Điểm xét tuyển = Tổng điểm 3 môn (a) + Điểm ưu tiên (b) + Điểm khuyến khích (c)". Mục 3 (trang 1-2)/mục 6.2.2 (trang 7): quy tắc làm tròn "theo nguyên tắc làm tròn toán học đến hàng phần trăm, sau khi cộng đầy đủ điểm ưu tiên và điểm khuyến khích".',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-20',
    },
  ],
} satisfies SourcedRule<{ formulaDescription: string; roundingDescription: string }>;

/**
 * Điểm ưu tiên khu vực/đối tượng — UMP TỰ CÔNG BỐ TRỰC TIẾP công thức + bảng mức điểm (không phải
 * cross-check qua trường khác như UFM) — Thông báo 2415/TB-ĐHYD mục 6.2.2(b), verbatim khớp công
 * thức chuẩn quốc gia (Thông tư 08/2022/TT-BGDĐT Điều 7).
 */
export const umpPriorityEvidence = {
  value: {
    regionPoints30: { KV1: 0.75, 'KV2-NT': 0.5, KV2: 0.25, KV3: 0 },
    categoryPoints30: { UT1: 2, UT2: 1 },
    reductionThreshold30: 22.5,
    reductionDivisor30: 7.5,
  },
  evidence: [
    {
      sourceId: 'ump-admission-notice-2415-2026',
      location:
        'Mục 6.2.2(b) (trang 5): "Điểm ưu tiên đối với thí sinh đạt tổng điểm từ 22,50 trở lên... được làm tròn đến hàng phần trăm và xác định theo công thức sau: Điểm ưu tiên = [(30 - Tổng điểm đạt được)/7,50] x Mức điểm ưu tiên theo quy định. Mức điểm ưu tiên áp dụng cho khu vực 1 (KV1) là 0,75 điểm, khu vực 2 nông thôn (KV2-NT) là 0,50 điểm, khu vực 2 (KV2) là 0,25 điểm, khu vực 3 (KV3) không được tính điểm ưu tiên... Mức điểm ưu tiên áp dụng cho nhóm đối tượng UT1 (gồm các đối tượng 01 đến 03) là 2,00 điểm và cho nhóm đối tượng UT2 (gồm các đối tượng 04 đến 06) là 1,00 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-20',
    },
  ],
} satisfies SourcedRule<{ regionPoints30: Record<string, number>; categoryPoints30: Record<string, number>; reductionThreshold30: number; reductionDivisor30: number }>;

/**
 * Điểm khuyến khích (chứng chỉ ngoại ngữ / SAT) — Thông báo 2415/TB-ĐHYD mục 6.2.2(c) + mục 6
 * (trang 6): ngưỡng đạt + công thức 0,9×(điểm/thang tối đa) cho từng loại, cộng dồn (nếu có cả 2
 * loại minh chứng) rồi kẹp trần 1,50.
 */
export const umpBonusEvidence = {
  value: {
    ieltsThreshold: 6.0,
    toeflIbtThreshold: 80,
    satThreshold: 1340,
    ieltsMax: 9,
    toeflIbtMax: 120,
    satMax: 1600,
    bonusFactor: 0.9,
    cap30: 1.5,
  },
  evidence: [
    {
      sourceId: 'ump-admission-notice-2415-2026',
      location:
        'Mục 6.2.2(c) (trang 5): "Điểm khuyến khích dành cho các đối tượng thí sinh có chứng chỉ ngoại ngữ hoặc có chứng chỉ quốc tế; mức điểm khuyến khích từ 0 - 1,50 điểm theo thang điểm 30." Mục 6 (trang 6): "Ngưỡng được điểm khuyến khích: Thí sinh có chứng chỉ IELTS Academic đạt từ 6.0 trở lên hoặc TOEFL iBT đạt từ 80 điểm trở lên; Thí sinh có kết quả SAT đạt từ 1340 điểm trở lên." "Cách tính điểm khuyến khích: Chứng chỉ ngoại ngữ (chỉ chọn 1 trong 2: IELTS hoặc TOEFL iBT): Điểm khuyến khích = 0,9 x (điểm IELTS / 9), hoặc Điểm khuyến khích = 0,9 x (điểm TOEFL iBT / 120). Kết quả SAT: Điểm khuyến khích = 0,9 x (điểm SAT / 1600). Điểm khuyến khích = Điểm khuyến khích (chứng chỉ ngoại ngữ) + Điểm khuyến khích (kết quả SAT). Trường hợp tổng điểm khuyến khích vượt quá 1,50 điểm thì được tính tối đa là 1,50 điểm."',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-20',
      note:
        'Đọc verbatim: công thức cộng dồn 2 thành phần (chứng chỉ ngoại ngữ + SAT) rồi kẹp trần, KHÔNG phải "chỉ được chọn 1 trong 2 loại minh chứng" — câu "Thí sinh chỉ chọn 1 kết quả điểm trong số các kỳ thi còn giá trị sử dụng" (mục 6) áp dụng cho việc chọn 1 kết quả tốt nhất KHI thí sinh có NHIỀU lần thi CÙNG loại (vd nhiều lần thi SAT), không phải giới hạn chỉ 1 trong 2 loại minh chứng (ngoại ngữ vs SAT) — khớp với câu "chỉ chọn 1 trong 2: IELTS hoặc TOEFL iBT" áp dụng RIÊNG cho lựa chọn giữa IELTS/TOEFL, và công thức tổng cuối cùng liệt kê rõ ràng phép cộng giữa 2 thành phần khác nhau (ngoại ngữ + SAT).',
    },
  ],
} satisfies SourcedRule<{
  ieltsThreshold: number;
  toeflIbtThreshold: number;
  satThreshold: number;
  ieltsMax: number;
  toeflIbtMax: number;
  satMax: number;
  bonusFactor: number;
  cap30: number;
}>;

/**
 * Ngưỡng đảm bảo chất lượng đầu vào 2026 (18 ngành, thang 30, không tính điểm cộng, không phân
 * biệt tổ hợp) — Thông báo 2983/TB-ĐHYD (08/7/2026), đọc trực tiếp từ ảnh bảng gốc.
 */
export const umpThresholdEvidence = {
  value: {
    thresholdRange30: { min: 17.0, max: 23.0 },
  },
  evidence: [
    {
      sourceId: 'ump-threshold-notice-2983-2026',
      location:
        'Mục 1 "Xác định ngưỡng đảm bảo chất lượng đầu vào" — bảng 18 dòng (mã ngành/tên ngành/tổ hợp/ngưỡng ĐBCL đầu vào), giá trị từ 17,0 (Tâm lý học, Y tế công cộng, Công tác xã hội) đến 23,0 (Y khoa, Răng - Hàm - Mặt). Xem giá trị đầy đủ theo từng ngành ở `programs.ts`.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      publishedAt: '2026-07-08',
      verifiedAt: '2026-08-20',
    },
  ],
} satisfies SourcedRule<{ thresholdRange30: { min: number; max: number } }>;
