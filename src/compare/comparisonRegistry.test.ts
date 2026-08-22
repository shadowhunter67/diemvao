import { describe, expect, it } from 'vitest';
import type { SchoolComparisonAdapter } from './schoolComparisonAdapter';
import { schoolComparisonAdapters, schoolComparisonAdapterRegistry, COMPARE_SCHOOL_ORDER } from './comparisonRegistry';
import { schoolRegistry } from '../schools';
import { evaluateApplicantAcrossSchools, evaluateComparisonSelections } from './evaluateApplicantAcrossSchools';
import { hcmutAdmissionMethods } from '../schools/hcmut/methods';
import { uehAdmissionMethods } from '../schools/ueh/methods';
import { uelAdmissionMethods } from '../schools/uel/methods';
import { uitAdmissionMethods } from '../schools/uit/methods';
import { hcmusAdmissionMethods } from '../schools/hcmus/methods';
import { usshAdmissionMethods } from '../schools/ussh/methods';
import { uhsAdmissionMethods } from '../schools/uhs/methods';
import { iuAdmissionMethods } from '../schools/iu/methods';
import { aguAdmissionMethods } from '../schools/agu/methods';
import { hcmueAdmissionMethods } from '../schools/hcmue/methods';
import { hcmuteAdmissionMethods } from '../schools/hcmute/methods';
import { tdtuAdmissionMethods } from '../schools/tdtu/methods';
import { huflitAdmissionMethods } from '../schools/huflit/methods';
import { hutechAdmissionMethods } from '../schools/hutech/methods';
import { ufmAdmissionMethods } from '../schools/ufm/methods';
import { iuhAdmissionMethods } from '../schools/iuh/methods';
import { hcmulawAdmissionMethods } from '../schools/hcmulaw/methods';
import { vluAdmissionMethods } from '../schools/vlu/methods';
import { umpAdmissionMethods } from '../schools/ump/methods';
import { ftuAdmissionMethods } from '../schools/ftu/methods';
import { ptitAdmissionMethods } from '../schools/ptit/methods';
import { neuAdmissionMethods } from '../schools/neu/methods';
import { hubAdmissionMethods } from '../schools/hub/methods';
import { huitAdmissionMethods } from '../schools/huit/methods';
import { nttuAdmissionMethods } from '../schools/nttu/methods';
import { hsuAdmissionMethods } from '../schools/hsu/methods';
import { uefAdmissionMethods } from '../schools/uef/methods';
import { ctuAdmissionMethods } from '../schools/ctu/methods';
import { tdmuAdmissionMethods } from '../schools/tdmu/methods';
import { hiuAdmissionMethods } from '../schools/hiu/methods';
import { ouAdmissionMethods } from '../schools/ou/methods';
import { sguAdmissionMethods } from '../schools/sgu/methods';
import { hnueAdmissionMethods } from '../schools/hnue/methods';
import { vinhuniAdmissionMethods } from '../schools/vinhuni/methods';
import { utcAdmissionMethods } from '../schools/utc/methods';
import { southernCatalogMethods } from '../schools/southernCatalog';
import { remainingCatalogMethods } from '../schools/remainingCatalog';

/**
 * Khóa architectural invariant của compare orchestration — CI phải bắt được kiểu bug "trường đã
 * implement module thật + đã có branch compare nhưng bị quên nối 1 nơi khác" (đã xảy ra thật với
 * HCMUE trước refactor này, xem `docs/architecture.md` Batch 16). Sau refactor, orchestration
 * (`evaluateApplicantAcrossSchools.ts`) chỉ lặp qua ĐÚNG `schoolComparisonAdapters` — nên các test
 * dưới đây khóa TRỰC TIẾP nguồn sự thật đó, không khóa từng nơi tiêu thụ riêng lẻ.
 */
const methodDescriptorsBySchool: Record<string, readonly { id: string }[]> = {
  hcmut: hcmutAdmissionMethods,
  ueh: uehAdmissionMethods,
  uel: uelAdmissionMethods,
  uit: uitAdmissionMethods,
  hcmus: hcmusAdmissionMethods,
  ussh: usshAdmissionMethods,
  uhs: uhsAdmissionMethods,
  iu: iuAdmissionMethods,
  agu: aguAdmissionMethods,
  hcmue: hcmueAdmissionMethods,
  hcmute: hcmuteAdmissionMethods,
  tdtu: tdtuAdmissionMethods,
  huflit: huflitAdmissionMethods,
  hutech: hutechAdmissionMethods,
  ufm: ufmAdmissionMethods,
  iuh: iuhAdmissionMethods,
  hcmulaw: hcmulawAdmissionMethods,
  vlu: vluAdmissionMethods,
  ump: umpAdmissionMethods,
  ftu: ftuAdmissionMethods,
  ptit: ptitAdmissionMethods,
  neu: neuAdmissionMethods,
  hub: hubAdmissionMethods,
  huit: huitAdmissionMethods,
  nttu: nttuAdmissionMethods,
  hsu: hsuAdmissionMethods,
  uef: uefAdmissionMethods,
  ctu: ctuAdmissionMethods,
  tdmu: tdmuAdmissionMethods,
  hiu: hiuAdmissionMethods,
  ou: ouAdmissionMethods,
  sgu: sguAdmissionMethods,
  hnue: hnueAdmissionMethods,
  vinhuni: vinhuniAdmissionMethods,
  utc: utcAdmissionMethods,
  ...Object.fromEntries(southernCatalogMethods.map((method) => [method.schoolId!, [method]])),
  ...Object.fromEntries(remainingCatalogMethods.map((method) => [method.schoolId!, [method]])),
};

/** Pure helper — trả danh sách schoolId bị trùng trong 1 mảng adapter. Test cả trên registry thật
 * (phải rỗng) LẪN trên 1 mảng dựng tay có trùng (phải phát hiện được) để chứng minh logic detect
 * hoạt động, không chỉ tình cờ pass vì dữ liệu thật sạch. */
function findDuplicateSchoolIds(adapters: readonly SchoolComparisonAdapter[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const adapter of adapters) {
    if (seen.has(adapter.schoolId)) duplicates.add(adapter.schoolId);
    seen.add(adapter.schoolId);
  }
  return [...duplicates];
}

describe('comparisonRegistry invariants', () => {
  it('every school in schoolRegistry has exactly one comparison adapter, and vice versa (no forgotten school)', () => {
    const registrySchoolIds = Object.keys(schoolRegistry).sort();
    const adapterSchoolIds = schoolComparisonAdapters.map((adapter) => adapter.schoolId).sort();
    expect(adapterSchoolIds).toEqual(registrySchoolIds);
  });

  it('every adapter schoolId resolves to a real SchoolModule in schoolRegistry', () => {
    for (const adapter of schoolComparisonAdapters) {
      expect(schoolRegistry[adapter.schoolId], `adapter.schoolId "${adapter.schoolId}" has no matching SchoolModule`).toBeDefined();
    }
  });

  it('has no duplicate schoolId in the real registry', () => {
    expect(findDuplicateSchoolIds(schoolComparisonAdapters)).toEqual([]);
  });

  it('detects duplicate schoolId when present (proves the detector itself works)', () => {
    const withDuplicate: SchoolComparisonAdapter[] = [
      ...schoolComparisonAdapters,
      { ...schoolComparisonAdapters[0] },
    ];
    expect(findDuplicateSchoolIds(withDuplicate)).toEqual([schoolComparisonAdapters[0].schoolId]);
  });

  it('adapter.methodId matches a real AdmissionMethodDescriptor for that school', () => {
    for (const adapter of schoolComparisonAdapters) {
      const methods = methodDescriptorsBySchool[adapter.schoolId];
      expect(methods, `no method descriptor list wired in this test for "${adapter.schoolId}"`).toBeDefined();
      expect(
        methods.some((method) => method.id === adapter.methodId),
        `adapter.methodId "${adapter.methodId}" not found in ${adapter.schoolId}AdmissionMethods`
      ).toBe(true);
    }
  });

  it('schoolComparisonAdapterRegistry is keyed exactly by each adapter schoolId (lookup consistency)', () => {
    for (const adapter of schoolComparisonAdapters) {
      expect(schoolComparisonAdapterRegistry[adapter.schoolId]).toBe(adapter);
    }
    expect(Object.keys(schoolComparisonAdapterRegistry)).toHaveLength(schoolComparisonAdapters.length);
  });

  it('COMPARE_SCHOOL_ORDER is derived from schoolComparisonAdapters, not a second parallel list', () => {
    expect(COMPARE_SCHOOL_ORDER).toEqual(schoolComparisonAdapters.map((adapter) => adapter.schoolId));
  });

  it('every adapter school id participates in the default roster (evaluateApplicantAcrossSchools)', () => {
    const rosterSchoolIds = evaluateApplicantAcrossSchools({}).map((summary) => summary.schoolId);
    expect(rosterSchoolIds).toEqual(schoolComparisonAdapters.map((adapter) => adapter.schoolId));
  });

  it('every adapter school id participates in selection-driven comparison (evaluateComparisonSelections)', () => {
    const selections = schoolComparisonAdapters.map((adapter, index) => ({ id: `s-${index}`, schoolId: adapter.schoolId }));
    const summaries = evaluateComparisonSelections({}, selections);
    expect(summaries.map((summary) => summary.schoolId)).toEqual(schoolComparisonAdapters.map((adapter) => adapter.schoolId));
    expect(summaries.every((summary) => summary.evaluation !== undefined)).toBe(true);
  });

  it('unknown schoolId in a selection is skipped safely, never crashes', () => {
    expect(() =>
      evaluateComparisonSelections({}, [
        { id: 'a', schoolId: 'not-a-real-school' },
        { id: 'b', schoolId: 'hcmut' },
      ])
    ).not.toThrow();
    const summaries = evaluateComparisonSelections({}, [
      { id: 'a', schoolId: 'not-a-real-school' },
      { id: 'b', schoolId: 'hcmut' },
    ]);
    expect(summaries).toHaveLength(1);
    expect(summaries[0].schoolId).toBe('hcmut');
    expect(summaries[0].selectionId).toBe('b');
  });

  it('unknown schoolId does not throw with an empty profile and no other selections', () => {
    expect(evaluateComparisonSelections({}, [{ id: 'only', schoolId: 'ghost-school' }])).toEqual([]);
  });
});
