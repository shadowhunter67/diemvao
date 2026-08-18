import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { AdmissionInput } from '../types/admission';

/**
 * HCMUT KHÔNG có worked example chính thức (input→output cụ thể) — xác nhận rõ ràng ở
 * `schools/hcmut/evidence.ts` (`HCMUT_MISSING_OFFICIAL_WORKED_EXAMPLE = true`). Toàn bộ case dưới
 * đây là **Tier C (formula-derived)**: input được CHỌN CỐ Ý để mọi bước trung gian ra số tròn
 * (không rơi vào số thập phân lặp lại) — vì `docs/rounding-audit.md` đã ghi nhận HCMUT làm tròn
 * (`round2`) ở TỪNG bước trung gian là ASSUMPTION của developer, chưa có nguồn chính thức xác nhận
 * bước nào round. Chọn input sao cho mọi round2() đều là no-op giúp golden case này ĐÚNG bất kể
 * chính sách rounding nào (round-mỗi-bước hay chỉ round-1-lần-cuối) — không vô tình khóa cứng một
 * rounding assumption chưa verified vào test.
 *
 * Nguồn constants dùng để derive (`sourceId: 'hcmut-admission-scheme-2026'`, verified):
 *   weights.dgnl=0.7, weights.thpt=0.2, weights.transcript=0.1, dgnl.mathMultiplier=2,
 *   dgnl.maxWeightedTotal=1500, thpt/transcript.mathMultiplier=2, maxPerSubject=10, bonus.maxTotal=10,
 *   priority.reductionThreshold=75, priority.reductionDivisor=25, priority.scaleDivisor=3,
 *   priority.scaleMultiplier=10, scoreScale=100 (xem `config/admission-2026.ts` + `evidence.ts`).
 */
export const hcmutGoldenCases: GoldenAdmissionCase<AdmissionInput, { finalScore: number; academicScore: number; bonusReceived: number; priorityReceived: number }>[] = [
  {
    id: 'hcmut-2026-formula-derived-normal',
    schoolId: 'hcmut',
    methodId: 'hcmut-comprehensive-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hcmut-admission-scheme-2026',
    sourceNote: 'Weights 70/20/10 + Toán×2 + maxWeightedTotal 1500 — verified, không có worked example nên input tự chọn để mọi round2() là no-op.',
    derivation: `
      DGNL: vietnamese=250, english=250, math=200 (weighted ×2=400), scientificThinking=150
        weightedScore = 250+250+400+150 = 1050; normalizedScore = 1050/1500×100 = 70.00
      THPT: math=8, subject2=8, subject3=8 → weightedAverage=(16+8+8)/4=8.00; normalizedScore=8/10×100=80.00
      Transcript (3 năm, mỗi năm math=8/subject2=8/subject3=8): weightedAverage=8.00; normalizedScore=80.00
      academic.score = 70×0.7 + 80×0.2 + 80×0.1 = 49 + 16 + 8 = 73.00
      bonus: reward=0, considerationReward=0, encouragement=0 → received=0.00
      baseScoreForPriority = 73.00 + 0 = 73.00 (< 75 → KHÔNG kích hoạt giảm ưu tiên)
      priority: raw30Scale=1.5 → converted=(1.5/3)×10=5.00; received=converted=5.00 (dưới ngưỡng)
      finalScore = min(100, 73.00+0+5.00) = 78.00
    `,
    boundaryNote: 'Normal case — baseScoreForPriority (73) dưới priority.reductionThreshold (75), không kích hoạt công thức giảm.',
    input: {
      dgnl: { vietnamese: 250, english: 250, math: 200, scientificThinking: 150 },
      thpt: { math: 8, subject2: 8, subject3: 8 },
      transcript: {
        grade10: { math: 8, subject2: 8, subject3: 8 },
        grade11: { math: 8, subject2: 8, subject3: 8 },
        grade12: { math: 8, subject2: 8, subject3: 8 },
      },
      bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
      priorityRaw30Scale: 1.5,
    },
    expected: { finalScore: 78.0, academicScore: 73.0, bonusReceived: 0, priorityReceived: 5.0 },
  },
  {
    id: 'hcmut-2026-formula-derived-priority-reduction-boundary',
    schoolId: 'hcmut',
    methodId: 'hcmut-comprehensive-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hcmut-admission-scheme-2026',
    sourceNote: 'Cùng academic base như case normal, chỉ đổi bonus để baseScoreForPriority vượt reductionThreshold=75, kích hoạt công thức giảm điểm ưu tiên (reductionDivisor=25).',
    derivation: `
      Academic giống case normal (academic.score = 73.00)
      bonus: reward=2, considerationReward=1, encouragement=0 → raw=3 (< maxTotal 10, không cap) → received=3.00
      baseScoreForPriority = 73.00 + 3.00 = 76.00 (>= 75 → KÍCH HOẠT công thức giảm)
      priority: raw30Scale=1.5 → converted=(1.5/3)×10=5.00
        received = ((100-76)/25) × 5.00 = (24/25)×5.00 = 0.96×5.00 = 4.80
      finalScore = min(100, 73.00+3.00+4.80) = 80.80
    `,
    boundaryNote: 'Boundary anchor: priority.reductionThreshold (75/100) — baseScoreForPriority=76 vừa vượt ngưỡng, kích hoạt nhánh giảm dần.',
    input: {
      dgnl: { vietnamese: 250, english: 250, math: 200, scientificThinking: 150 },
      thpt: { math: 8, subject2: 8, subject3: 8 },
      transcript: {
        grade10: { math: 8, subject2: 8, subject3: 8 },
        grade11: { math: 8, subject2: 8, subject3: 8 },
        grade12: { math: 8, subject2: 8, subject3: 8 },
      },
      bonus: { reward: 2, considerationReward: 1, encouragement: 0 },
      priorityRaw30Scale: 1.5,
    },
    expected: { finalScore: 80.8, academicScore: 73.0, bonusReceived: 3.0, priorityReceived: 4.8 },
  },
  {
    id: 'hcmut-2026-formula-derived-bonus-and-final-cap',
    schoolId: 'hcmut',
    methodId: 'hcmut-comprehensive-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'hcmut-admission-scheme-2026',
    sourceNote: 'Tất cả thành phần đạt điểm tối đa + bonus raw vượt bonus.maxTotal(10) — kiểm tra 2 cap cùng lúc: bonus cap và finalScore cap ở scoreScale(100).',
    derivation: `
      DGNL max: vietnamese=300, english=300, math=300 (weighted×2=600), scientificThinking=300
        weightedScore=300+300+600+300=1500 (= maxWeightedTotal) → normalizedScore=1500/1500×100=100.00
      THPT max: math=10,subject2=10,subject3=10 → weightedAverage=(20+10+10)/4=10.00 → normalizedScore=100.00
      Transcript max (3 năm 10/10/10): weightedAverage=10.00 → normalizedScore=100.00
      academic.score = 100×0.7 + 100×0.2 + 100×0.1 = 100.00
      bonus: reward=8, considerationReward=5, encouragement=3 → raw=16 (> maxTotal 10) → received=min(16,10)=10.00 [BONUS CAP]
      baseScoreForPriority = 100.00 + 10.00 = 110.00 (>= 75 → nhánh giảm, và (100-110) âm)
      priority: raw30Scale=0 → converted=0.00; received=max(0, ((100-110)/25)×0)=0.00
      finalScore = min(100, 100.00+10.00+0.00) = min(100, 110.00) = 100.00 [FINAL SCORE CAP]
    `,
    boundaryNote: 'Boundary anchor kép: bonus.maxTotal (10, raw 16 bị cắt) VÀ scoreScale cap (100, tổng thô 110 bị cắt).',
    input: {
      dgnl: { vietnamese: 300, english: 300, math: 300, scientificThinking: 300 },
      thpt: { math: 10, subject2: 10, subject3: 10 },
      transcript: {
        grade10: { math: 10, subject2: 10, subject3: 10 },
        grade11: { math: 10, subject2: 10, subject3: 10 },
        grade12: { math: 10, subject2: 10, subject3: 10 },
      },
      bonus: { reward: 8, considerationReward: 5, encouragement: 3 },
      priorityRaw30Scale: 0,
    },
    expected: { finalScore: 100.0, academicScore: 100.0, bonusReceived: 10.0, priorityReceived: 0.0 },
  },
];

/**
 * Đối tượng 2.2 (không có ĐGNL) — cùng infra Result nhưng dùng `calculateAdmissionScoreNoDgnl`.
 * Constants nguồn `hcmut-no-dgnl-research-2026` (verification: `cross-checked`, KHÔNG phải
 * `verified` trực tiếp từ HCMUT — 2 nguồn độc lập cross-check, chưa fetch được PDF đề án gốc, xem
 * `evidence.ts`). Ghi rõ mức tin cậy thấp hơn nhóm case trên.
 */
export const hcmutNoDgnlGoldenCase: GoldenAdmissionCase<
  Omit<AdmissionInput, 'dgnl'>,
  { finalScore: number; academicScore: number; abilityNormalizedScore: number }
> = {
  id: 'hcmut-2026-no-dgnl-formula-derived-normal',
  schoolId: 'hcmut',
  methodId: 'hcmut-comprehensive-2026',
  year: 2026,
  tier: 'C',
  sourceId: 'hcmut-no-dgnl-research-2026',
  sourceNote: 'noDgnl.abilityMultiplier=0.75 (cross-checked, chưa verified trực tiếp từ PDF gốc) — điểm năng lực = THPT quy đổi × 0.75.',
  derivation: `
    THPT: math=8,subject2=8,subject3=8 → normalizedScore=80.00
    Transcript (3 năm 8/8/8): normalizedScore=80.00
    abilityNormalizedScore (điểm năng lực thay ĐGNL) = 80.00 × 0.75 = 60.00
    academic.score = 60×0.7 + 80×0.2 + 80×0.1 = 42 + 16 + 8 = 66.00
    bonus: 0 → received=0.00
    baseScoreForPriority = 66.00 (< 75 → không giảm)
    priority: raw30Scale=1.5 → converted=5.00, received=5.00
    finalScore = min(100, 66.00+0+5.00) = 71.00
  `,
  boundaryNote: 'Method branch anchor: nhánh "không có ĐGNL" (abilityMultiplier 0.75) — công thức thay thế khác hẳn nhánh có ĐGNL.',
  input: {
    thpt: { math: 8, subject2: 8, subject3: 8 },
    transcript: {
      grade10: { math: 8, subject2: 8, subject3: 8 },
      grade11: { math: 8, subject2: 8, subject3: 8 },
      grade12: { math: 8, subject2: 8, subject3: 8 },
    },
    bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
    priorityRaw30Scale: 1.5,
  },
  expected: { finalScore: 71.0, academicScore: 66.0, abilityNormalizedScore: 60.0 },
};
