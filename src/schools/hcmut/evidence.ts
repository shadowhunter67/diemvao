import type { SourcedRule } from '../../core/evidence';
import { activeAdmissionConfig } from './config/admission-2026';

/**
 * Provenance cho các hằng số quan trọng nhất trong công thức HCMUT 2026 — trỏ tới
 * docs/admission-research-2026.md#hcmut thay vì lặp lại nội dung research ở đây. Chỉ liệt kê
 * những con số có rủi ro hiểu sai cao nhất (hệ số Toán, trọng số, ngưỡng giảm ưu tiên, mức trần
 * điểm cộng, hệ số quy đổi nhóm không-ĐGNL) — không cố gắng phủ 100% field của AdmissionConfig.
 */
export const hcmutRuleEvidence = {
  weights: {
    value: activeAdmissionConfig.weights,
    evidence: [
      {
        sourceId: 'hcmut-admission-scheme-2026',
        sourceTitle: 'Đề án tuyển sinh HCMUT 2026 — Xét tuyển tổng hợp (ĐGNL 70% + THPT 20% + học bạ 10%)',
        location: 'docs/admission-research-2026.md#hcmut',
        verification: 'verified',
        effectiveYear: 2026,
      },
    ],
  } satisfies SourcedRule<typeof activeAdmissionConfig.weights>,

  dgnlMathMultiplier: {
    value: activeAdmissionConfig.dgnl.mathMultiplier,
    evidence: [
      {
        sourceId: 'hcmut-admission-scheme-2026',
        sourceTitle: 'Đề án tuyển sinh HCMUT 2026 — Toán nhân hệ số 2 trong bài thi ĐGNL',
        location: 'docs/admission-research-2026.md#hcmut',
        verification: 'verified',
        effectiveYear: 2026,
      },
    ],
  } satisfies SourcedRule<number>,

  bonusMaxTotal: {
    value: activeAdmissionConfig.bonus.maxTotal,
    evidence: [
      {
        sourceId: 'hcmut-admission-scheme-2026',
        sourceTitle: 'Đề án tuyển sinh HCMUT 2026 — điểm cộng (thưởng/xét thưởng/khuyến khích) tối đa 10',
        location: 'docs/admission-research-2026.md#hcmut',
        verification: 'verified',
        effectiveYear: 2026,
      },
    ],
  } satisfies SourcedRule<number>,

  priorityReductionThreshold: {
    value: activeAdmissionConfig.priority.reductionThreshold,
    evidence: [
      {
        sourceId: 'hcmut-admission-scheme-2026',
        sourceTitle:
          'Đề án tuyển sinh HCMUT 2026 — điểm ưu tiên KV/ĐT giảm dần khi (điểm học lực + điểm cộng) đạt 75/100',
        location: 'docs/admission-research-2026.md#hcmut',
        verification: 'verified',
        effectiveYear: 2026,
      },
    ],
  } satisfies SourcedRule<number>,

  noDgnlAbilityMultiplier: {
    value: activeAdmissionConfig.noDgnl.abilityMultiplier,
    evidence: [
      {
        sourceId: 'hcmut-no-dgnl-research-2026',
        sourceTitle:
          'Đối tượng 2.2 (không có ĐGNL ĐHQG-HCM 2026): điểm năng lực = điểm THPT quy đổi × 0.75',
        location: 'docs/admission-research-2026.md#hcmut',
        verification: 'cross-checked',
        effectiveYear: 2026,
        note: 'Cross-check 2 nguồn độc lập, chưa fetch trực tiếp được PDF đề án gốc hcmut.edu.vn.',
      },
    ],
  } satisfies SourcedRule<number>,
};

/**
 * HCMUT hiện chưa có ví dụ minh họa bằng số cụ thể ("nhập X → ra Y") từ nguồn chính thức, chỉ có
 * công thức + tham số. KHÔNG bịa fixture cho tới khi tìm được worked example thật — xem
 * `src/core/officialFixture.ts` để biết infra dùng khi có nguồn.
 */
export const HCMUT_MISSING_OFFICIAL_WORKED_EXAMPLE = true;
