import type { GoldenAdmissionCase } from '../../../core/goldenAdmissionCase';
import type { UelScoreInput } from '../calculator';

/**
 * UEL 2026 không có official worked example (input→output cụ thể) đã tìm thấy trong `sources.ts` —
 * chỉ có công thức β1/β2/β3 + bảng ưu tiên + quy tắc giảm (đều `verification: 'verified'`, xem
 * `sources.ts` id `uel-formula-2026`/`uel-priority-reduction-2026`). Toàn bộ case dưới đây Tier C.
 * `dgnlScale100`/`thptScale100`/`transcriptScale100` coi là INPUT ĐÃ QUY ĐỔI thang 100 (không phải
 * điều đang được golden-test ở đây — công thức β1/β2/β3 VÀ quy tắc giảm ưu tiên MỚI là rule cần
 * anchor). DGNL raw → dgnlScale100 dùng `convertDgnlToScale100` thật (×100/1200, verified riêng),
 * test gọi luôn hàm đó để tăng độ phủ chain thật.
 */
export const uelGoldenCases: GoldenAdmissionCase<
  UelScoreInput & { dgnlRaw1200: number },
  { academicScore: number; priorityEffective: number; finalScore: number }
>[] = [
  {
    id: 'uel-2026-formula-derived-normal-no-reduction',
    schoolId: 'uel',
    methodId: 'uel-comprehensive-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'uel-formula-2026',
    sourceNote: 'β1=0.55 (ĐGNL), β2=0.35 (THPT), β3=0.1 (học bạ), DT1 — verified.',
    derivation: `
      dgnlRaw1200=720 → convertDgnlToScale100(720) = 720×100/1200 = 60.00
      thptScale100=60 (given, đã quy đổi thang 100), transcriptScale100=60 (given)
      academicScore = round2(60×0.55 + 60×0.35 + 60×0.1) = round2(60×1.0) = 60.00
      bonus: certificateBonus=undefined, prioritySchool=false → bonus=0
      academicPlusBonus = min(100, 60.00) = 60.00 (< 75 → KHÔNG giảm ưu tiên)
      standardPriority100 = KV2(0.83)+UT2(3.33) = 4.16 (given, bảng đã verified)
      priority.effectivePriority = standardPriority = 4.16 (dưới ngưỡng, không giảm)
      finalScore = round2(min(100, 60.00+4.16)) = 64.16
    `,
    boundaryNote: 'Control case — academicPlusBonus (60) dưới REDUCTION_THRESHOLD (75).',
    input: { applicantType: 'dt1', dgnlRaw1200: 720, thptScale100: 60, transcriptScale100: 60, standardPriority100: 4.16 },
    expected: { academicScore: 60.0, priorityEffective: 4.16, finalScore: 64.16 },
  },
  {
    id: 'uel-2026-formula-derived-priority-reduction-boundary',
    schoolId: 'uel',
    methodId: 'uel-comprehensive-2026',
    year: 2026,
    tier: 'C',
    sourceId: 'uel-priority-reduction-2026',
    sourceNote: 'Quy tắc giảm điểm ưu tiên "(100 – Điểm học lực – Điểm cộng)/25 × Điểm ưu tiên quy đổi" khi tổng ≥75 — verified, nguyên văn nguồn.',
    derivation: `
      dgnlRaw1200=900 → convertDgnlToScale100(900) = 900×100/1200 = 75.00
      thptScale100=80, transcriptScale100=70 (given)
      academicScore = round2(75×0.55 + 80×0.35 + 70×0.1) = round2(41.25+28+7) = round2(76.25) = 76.25
      bonus=0 → academicPlusBonus = min(100, 76.25) = 76.25 (>= 75 → KÍCH HOẠT giảm)
      standardPriority100 = KV2(0.83)+UT2(3.33) = 4.16
      effectivePriority = round(((100-76.25)/25) × 4.16 × 100)/100 = round((23.75/25)×4.16×100)/100
                          = round(0.95×4.16×100)/100 = round(395.2)/100 = 3.95
      finalScore = round2(min(100, 76.25+3.95)) = 80.20
    `,
    boundaryNote: 'Boundary anchor: REDUCTION_THRESHOLD (75/100) — academicPlusBonus=76.25 vừa vượt ngưỡng, kích hoạt nhánh giảm dần.',
    input: { applicantType: 'dt1', dgnlRaw1200: 900, thptScale100: 80, transcriptScale100: 70, standardPriority100: 4.16 },
    expected: { academicScore: 76.25, priorityEffective: 3.95, finalScore: 80.2 },
  },
];
