import type { SourcedRule } from '../../core/evidence';
import { IU_HS3_THPT_TO_DGNL, IU_K1_THPT, IU_K2_DGNL, IU_K3_TRANSCRIPT } from './calculator';
import { IU_AWARD_BONUS_POINTS, IU_PRIORITY_SCHOOL_POINTS, IU_SPECIAL_ACHIEVEMENT_POINTS_EACH, IU_XET_THUONG_MAX, IU_KHUYEN_KHICH_MAX, IU_TOTAL_BONUS_CAP } from './bonus';
import { IU_PRIORITY_REGION_POINTS_100, IU_PRIORITY_CATEGORY_POINTS_100 } from './priority';

export const iuAcademicWeightsEvidence = {
  value: { k1: IU_K1_THPT, k2: IU_K2_DGNL, k3: IU_K3_TRANSCRIPT, hs3: IU_HS3_THPT_TO_DGNL },
  evidence: [
    {
      sourceId: 'iu-method2-2026',
      location: 'Mục II.2.a: Điểm học lực = k1*THPT + k2*ĐGNL + k3*Học bạ (k1=40%, k2=50%, k3=10%), Hs3=0.83 khi không có ĐGNL 2026',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
    {
      sourceId: 'iu-hs-coefficients-update-2026',
      location: 'Xác nhận lại k1/k2/k3 và công bố đầy đủ Hs1=1.20, Hs2=1.25, Hs3=0.83, Hs4=1.02, Hs5=1',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
    {
      sourceId: 'iu-admission-info-2026',
      location: 'Khoản 2.b: bảng công thức Điểm học lực cho 3 nhóm đối tượng (1.1/1.2/2.1/2.2/2.3/3), Công thức tổng quát Điểm xét tuyển',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{ k1: number; k2: number; k3: number; hs3: number }>;

export const iuBonusEvidence = {
  value: {
    awardBonus: IU_AWARD_BONUS_POINTS,
    prioritySchool: IU_PRIORITY_SCHOOL_POINTS,
    specialAchievementEach: IU_SPECIAL_ACHIEVEMENT_POINTS_EACH,
    xetThuongMax: IU_XET_THUONG_MAX,
    encouragementMax: IU_KHUYEN_KHICH_MAX,
    totalCap: IU_TOTAL_BONUS_CAP,
  },
  evidence: [
    {
      sourceId: 'iu-admission-info-2026',
      location:
        'Khoản 5.a: Điểm cộng (cap 10) = Điểm thưởng (giải QT=10/Nhất QG=9/Nhì QG=8/Ba QG=7) + Điểm xét thưởng (cap 5: trường ưu tiên +3, thành tích đặc biệt +2/giải) + Điểm khuyến khích (cap 5: bảng chứng chỉ ngoại ngữ)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{
  awardBonus: Record<string, number>;
  prioritySchool: number;
  specialAchievementEach: number;
  xetThuongMax: number;
  encouragementMax: number;
  totalCap: number;
}>;

export const iuPriorityEvidence = {
  value: { region: IU_PRIORITY_REGION_POINTS_100, category: IU_PRIORITY_CATEGORY_POINTS_100 },
  evidence: [
    {
      sourceId: 'iu-admission-info-2026',
      location:
        'Khoản 7: KV1=2.5, KV2-NT=1.67, KV2=0.83, KV3=0; UT1(01-03)=6.66, UT2(04-06)=3.33 (thang 100) — khớp bảng chuẩn Bộ GD&ĐT thang 30 × 10/3',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{ region: Record<string, number>; category: Record<string, number> }>;

export const iuPriorityReductionEvidence = {
  value: { threshold: 75, divisor: 25, scale: 100 },
  evidence: [
    {
      sourceId: 'iu-admission-info-2026',
      location:
        'Mục 2.b: (Điểm học lực+Điểm cộng)<75 → hưởng nguyên mức; >=75 → Điểm ưu tiên=[(100-Điểm học lực-Điểm cộng)/25]×mức Khoản 7',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{ threshold: number; divisor: number; scale: number }>;
