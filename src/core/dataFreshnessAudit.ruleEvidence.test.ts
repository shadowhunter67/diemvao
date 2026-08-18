import { describe, expect, it } from 'vitest';
import { auditRuleEvidenceSourceReferences } from './dataFreshnessAudit';
import type { RuleEvidence } from './evidence';
import type { AdmissionSource } from './sourceRegistry';

import { verifiedRuntimeEvidence } from './admissionAuditInputs';
import { allAdmissionSources } from '../schools/sourceRegistry';

/**
 * Provenance invariant — batch provenance-hygiene (2026-08-17): "exact score-affecting rules used
 * by an exact method → must have RuleEvidence → RuleEvidence must resolve to source". Generic
 * detector (`auditRuleEvidenceSourceReferences`, `core/dataFreshnessAudit.ts`) đã tồn tại từ trước
 * và được `npm run audit:data` chạy qua `verifiedRuntimeEvidence()` (`admissionAuditInputs.ts`,
 * tách ra khỏi CLI script batch này để import được ở đây) — nhưng KHÔNG có unit test nào khóa
 * detector này hoạt động đúng, và không có gì ngăn ai đó thêm evidence mới vào 1 school's
 * `evidence.ts` mà quên add vào `verifiedRuntimeEvidence()` (audit:data sẽ không thấy evidence đó
 * tồn tại — false negative im lặng).
 *
 * KHÔNG tạo registry thứ hai — `verifiedRuntimeEvidence()` LÀ nguồn sự thật duy nhất (đã dùng bởi
 * CLI script thật), test này chỉ verify detector + dữ liệu thật đang ở trạng thái sạch.
 *
 * UEL migrate xong sang `evidence.ts` (batch 2026-08-18) — không còn gap, xem test riêng cuối file.
 */
describe('exact-method RuleEvidence must resolve to a real source (auditRuleEvidenceSourceReferences)', () => {
  it('positive: every real score-affecting evidence currently wired into audit:data resolves cleanly (0 missing/error)', () => {
    const issues = auditRuleEvidenceSourceReferences(verifiedRuntimeEvidence(), allAdmissionSources);
    const missingOrError = issues.filter((issue) => issue.code === 'MISSING_SOURCE_REFERENCE' && issue.severity === 'error');
    expect(missingOrError, `Unresolved score-affecting evidence: ${missingOrError.map((i) => i.entityId).join(', ')}`).toEqual([]);
  });

  it('negative: a RuleEvidence with an unknown sourceId is detected as an error (proves the detector actually catches drift)', () => {
    const bogusEvidence: RuleEvidence[] = [
      { sourceId: 'this-source-id-does-not-exist-anywhere', verification: 'verified', effectiveYear: 2026 },
    ];
    const issues = auditRuleEvidenceSourceReferences(bogusEvidence, allAdmissionSources);
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'MISSING_SOURCE_REFERENCE', severity: 'error', entityId: 'this-source-id-does-not-exist-anywhere' })
    );
  });

  it('negative: a score-affecting RuleEvidence resolving only to a secondary source is flagged (proves primary-source policy is enforced)', () => {
    const secondarySource: AdmissionSource = {
      id: 'test-secondary-only-source',
      schoolId: 'hcmut',
      publisher: 'Fixture publisher (test-only, not a real source)',
      title: 'Fixture-only secondary source for this test',
      url: 'https://example.invalid/secondary',
      accessedAt: '2026-08-17',
      sourceType: 'secondary',
      verification: 'incomplete',
    };
    const criticalEvidence: RuleEvidence[] = [{ sourceId: secondarySource.id, verification: 'verified', effectiveYear: 2026 }];
    const issues = auditRuleEvidenceSourceReferences(criticalEvidence, [...allAdmissionSources, secondarySource]);
    expect(issues).toContainEqual(expect.objectContaining({ code: 'CRITICAL_RULE_WITHOUT_PRIMARY_SOURCE', severity: 'error' }));
  });

  it('the newly-added HCMUS priority and USSH priority-reduction evidence are part of the audited set (regression guard for this batch)', () => {
    const sourceIds = new Set(verifiedRuntimeEvidence().map((evidence) => evidence.sourceId));
    expect(sourceIds.has('hcmus-academic-score-formula-2026')).toBe(true); // hcmusPriorityEvidence
    expect(sourceIds.has('ussh-scoring-principles-2026')).toBe(true); // usshPriorityReductionEvidence
  });

  it('UEL evidence (formula/priority-table/certificate-bonus/priority-reduction) is part of the audited set, migrated off the known-gap list (batch 2026-08-18)', () => {
    const sourceIds = new Set(verifiedRuntimeEvidence().map((evidence) => evidence.sourceId));
    expect(sourceIds.has('uel-formula-2026')).toBe(true); // uelFormulaEvidence + uelPriorityTableEvidence
    expect(sourceIds.has('uel-certificate-bonus-html-2026')).toBe(true); // uelCertificateBonusEvidence
    expect(sourceIds.has('uel-priority-reduction-2026')).toBe(true); // uelPriorityReductionEvidence
  });
});
