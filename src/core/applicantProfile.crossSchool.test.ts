import { describe, expect, it } from 'vitest';
import type { ApplicantProfile } from './applicantProfile';
import { COMMON_SUBJECT_COMBINATIONS } from './subjects';
import { buildHcmutAdmissionInput } from '../schools/hcmut/applicantProfileAdapter';
import { evaluateHcmutAdmission } from '../schools/hcmut/evaluate';
import { activeAdmissionConfig } from '../schools/hcmut/config/admission-2026';
import { buildUehEvaluationInput } from '../schools/ueh/applicantProfileAdapter';
import { evaluateUehAdmission } from '../schools/ueh/evaluate';

const A00 = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === 'A00')!;

/**
 * Proof "một ApplicantProfile, nhiều trường đọc" (workstream M, batch 3): MỘT object
 * `ApplicantProfile` duy nhất, 2 trường đọc 2 field khác nhau của cùng object đó —
 * `exams.vact.components` (HCMUT) và `exams.vact.total` (UEH) — không trường nào cần trường kia
 * đụng vào field mình không hiểu. Không có conversion giữa 2 con số (xem ghi chú trong
 * `schools/ueh/applicantProfileAdapter.ts`) — đây là 2 fact riêng biệt cùng tồn tại trên profile.
 */
describe('ApplicantProfile dùng chung — HCMUT và UEH đọc field khác nhau của cùng 1 profile', () => {
  const sharedProfile: ApplicantProfile = {
    graduationYear: 2026,
    exams: {
      vact: {
        // Số chính thức UEH dùng làm ví dụ minh họa (docs/admission-research-2026.md) — 950/1200.
        total: 950,
        // Số HCMUT dùng, hoàn toàn độc lập với "total" ở trên (2 cách công bố khác nhau).
        components: { vietnamese: 200, english: 220, math: 240, scientificThinking: 210 },
      },
    },
    thpt: { scores: { math: 9, physics: 8, chemistry: 7 } },
    transcript: {
      grade10: { math: 9, physics: 8, chemistry: 7 },
      grade11: { math: 9, physics: 8, chemistry: 7 },
      grade12: { math: 9, physics: 8, chemistry: 7 },
    },
  };

  it('HCMUT đọc exams.vact.components — tính điểm exact-verified bình thường', () => {
    const input = buildHcmutAdmissionInput(sharedProfile, {
      combination: A00,
      bonus: { reward: 0, considerationReward: 0, encouragement: 0 },
      priorityRaw30Scale: 0,
    });
    const evaluation = evaluateHcmutAdmission(input, activeAdmissionConfig);
    expect(evaluation.confidence).toBe('exact-verified');
    expect(evaluation.score).toBeDefined();
  });

  it('UEH đọc exams.vact.total (CÙNG profile, KHÔNG đụng vào components) — trả partial, quy đổi đúng ví dụ chính thức', () => {
    const uehInput = buildUehEvaluationInput(sharedProfile, { campus: 'hcmc' });
    expect(uehInput.dgnlScore).toBe(950);

    const evaluation = evaluateUehAdmission(uehInput);
    expect(evaluation.confidence).toBe('partial');
    expect(evaluation.score).toBeUndefined(); // không bao giờ suy ra final score

    const conversionStep = evaluation.explanation.find((s) => s.id === 'dgnl-to-thpt');
    expect(conversionStep?.output).toBeCloseTo(25.55, 2); // khớp ví dụ minh họa chính thức 950 -> 25.55
  });

  it('UEH KHÔNG đọc/không cần biết gì về exams.vact.components của HCMUT', () => {
    const uehInput = buildUehEvaluationInput(sharedProfile, { campus: 'hcmc' });
    expect(uehInput).not.toHaveProperty('components');
    expect(Object.keys(uehInput)).toEqual(['dgnlScore', 'campus', 'knownAdmissionScore100']);
  });
});
