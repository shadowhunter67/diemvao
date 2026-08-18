import type { SourcedRule } from '../../core/evidence';
import { HCMUTE_PRIORITY_REDUCTION_THRESHOLD_30, HCMUTE_PRIORITY_REDUCTION_DIVISOR_30, HCMUTE_PRIORITY_REGION_POINTS_30, HCMUTE_PRIORITY_CATEGORY_POINTS_30 } from './priority';
import { HCMUTE_BONUS_PROVINCIAL_RANK_POINTS_30, HCMUTE_BONUS_NATIONAL_ENCOURAGEMENT_POINTS_30, HCMUTE_BONUS_CAP_30 } from './bonus';

export const hcmutePriorityEvidence = {
  value: {
    reductionThreshold30: HCMUTE_PRIORITY_REDUCTION_THRESHOLD_30,
    reductionDivisor30: HCMUTE_PRIORITY_REDUCTION_DIVISOR_30,
    regionPoints30: HCMUTE_PRIORITY_REGION_POINTS_30,
    categoryPoints30: HCMUTE_PRIORITY_CATEGORY_POINTS_30,
  },
  evidence: [
    {
      sourceId: 'hcmute-priority-appendix-2026',
      location:
        'Phụ lục 1/2 — KV1=0,75/KV2-NT=0,50/KV2=0,25/KV3=0; nhóm ƯT1 (đối tượng 01-03)=2,00, nhóm ƯT2 (đối tượng 04-06)=1,00 (thang 30); công thức giảm ĐUT=[(30,00-(ĐHL+ĐC))/7,50]×MĐUT khi (ĐHL+ĐC)≥22,50 (mục 2.2.2)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{
  reductionThreshold30: number;
  reductionDivisor30: number;
  regionPoints30: Record<string, number>;
  categoryPoints30: Record<string, number>;
}>;

export const hcmuteBonusEvidence = {
  value: {
    provincialRankPoints30: HCMUTE_BONUS_PROVINCIAL_RANK_POINTS_30,
    nationalEncouragementPoints30: HCMUTE_BONUS_NATIONAL_ENCOURAGEMENT_POINTS_30,
    cap30: HCMUTE_BONUS_CAP_30,
  },
  evidence: [
    {
      sourceId: 'hcmute-admission-info-2026',
      location: 'Bảng 2 mục 2/3 — giải HSG cấp tỉnh/thành phố Nhất/Nhì/Ba = 1,20/1,00/0,80; giải khuyến khích HSG quốc gia = 1,50; điểm cộng trần 3,00 (thang 30)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note: 'Chỉ phủ mục 2 (giải cấp tỉnh) + mục 3 (khuyến khích QG) — mục 1/4-7 (điểm thưởng diện tuyển thẳng không dùng quyền, giải KHKT/mỹ thuật/thể thao/tay nghề theo ngành đặc thù) và ĐXTT nhóm trường (Bảng 3) chưa implement, xem knowledgeGaps.ts.',
    },
  ],
} satisfies SourcedRule<{
  provincialRankPoints30: Record<'nhat' | 'nhi' | 'ba', number>;
  nationalEncouragementPoints30: number;
  cap30: number;
}>;

export const hcmuteEligibilityEvidence = {
  value: { generalThreshold30: 15.0 },
  evidence: [
    {
      sourceId: 'hcmute-admission-info-2026',
      location:
        'Mục 3.1 "Ngưỡng đầu vào" — tổng điểm 3 môn thi TN THPT 2026 theo tổ hợp xét tuyển (không nhân hệ số) hoặc điểm 3 môn (Toán+Văn+môn khác) ≥ 15,00/30, áp dụng mọi ngành trừ Sư phạm tiếng Anh/Sư phạm công nghệ/Luật/Kỹ thuật thiết kế vi mạch',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{ generalThreshold30: number }>;

export const hcmuteCorrelationCoefficientsEvidence = {
  value: { a: 0.8, b: 0.8 },
  evidence: [
    {
      sourceId: 'hcmute-correlation-coefficients-2026',
      location:
        'Thông báo 2092/TB-ĐHCNKT (07/7/2026) — "Hệ số tương quan giữa Điểm thi tốt nghiệp THPT và Học bạ: a = 0,8; Hệ số tương quan giữa Điểm thi tốt nghiệp THPT và Điểm thi Đánh giá năng lực (ĐGNL): b = 0,8", căn cứ Biên bản họp số 58/BB-HĐTSĐHCQ ngày 03/7/2026',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note: 'Supersede statement "sẽ công bố sau" của văn bản 1691/ĐHCNKT-ĐT (01/6/2026) và số "giả định" ở Phụ lục 4 văn bản đó — đây là số CHÍNH THỨC, không phải minh họa.',
    },
  ],
} satisfies SourcedRule<{ a: number; b: number }>;

export const hcmuteHly2Evidence = {
  value: { weightThpt: 0.8, weightTranscript: 0.2 },
  evidence: [
    {
      sourceId: 'hcmute-correlation-coefficients-2026',
      location:
        'Thông báo 2092/TB-ĐHCNKT, mục 1/2/3 — công thức HLy.2 = 0,8×[thành phần điểm TN THPT] + 0,2×[thành phần điểm học bạ] + ĐXTT (+ M_NK cho nhóm Kiến trúc/Thiết kế); mỗi nhóm ngành có công thức thành phần riêng, xem `calculator.ts`',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note: 'ĐXTT (điểm xét thưởng nhóm trường) trong công thức này CHƯA implement — xem knowledgeGaps.ts:hcmute-school-group-bonus-dxtt. HLy.2 chỉ tính được khi thí sinh xác nhận ĐXTT (0 hoặc giá trị cụ thể).',
    },
  ],
} satisfies SourcedRule<{ weightThpt: number; weightTranscript: number }>;

export const hcmuteHly3Evidence = {
  value: { weightThpt: 0.8, weightDgnl: 0.2, dgnlDivisorStandard: 40, dgnlDivisorDesign: 60 },
  evidence: [
    {
      sourceId: 'hcmute-correlation-coefficients-2026',
      location:
        'Thông báo 2092/TB-ĐHCNKT, mục 1/2/3 — công thức HLy.3 = 0,8×[thành phần điểm TN THPT] + 0,2×(ĐG/40) cho nhóm chuẩn/Ngôn ngữ Anh, ước số ĐGNL = 60 cho nhóm Kiến trúc/Thiết kế (+ M_NK)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note: 'Không phụ thuộc ĐXTT — tính được ĐẦY ĐỦ ngay khi có điểm ĐGNL, không bị chặn bởi gap còn lại của HLy.2.',
    },
  ],
} satisfies SourcedRule<{ weightThpt: number; weightDgnl: number; dgnlDivisorStandard: number; dgnlDivisorDesign: number }>;

export const hcmuteAcademicFormulaEvidence = {
  value: { mainSubjectWeight: 2, secondarySubjectWeight: 1, scaleFactor: 3, divisor: 4 },
  evidence: [
    {
      sourceId: 'hcmute-admission-info-2026',
      location: 'Bảng 4/5, công thức (1): HLy.1 = [(MT1×2 + MT2 + MT3) / 4] × 3 — môn chính (MT1) nhân hệ số 2, không phụ thuộc hệ số tương quan a/b',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
    {
      sourceId: 'hcmute-worked-example-2026',
      location: 'Phụ lục 4, ví dụ minh họa 1 — tổ hợp A01 (Toán 8.5, Vật lý 8.0, Tiếng Anh quy đổi 9.7): HLy.1 = 26,025, khớp chính xác công thức công bố',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
    },
  ],
} satisfies SourcedRule<{ mainSubjectWeight: number; secondarySubjectWeight: number; scaleFactor: number; divisor: number }>;
