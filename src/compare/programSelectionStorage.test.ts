import { describe, expect, it } from 'vitest';
import { parseStoredProgramId, loadStoredProgramSelections } from './programSelectionStorage';
import { schoolComparisonAdapters } from './comparisonRegistry';

describe('programSelectionStorage', () => {
  /**
   * Trước refactor, `programIdsBySchool` là 1 map khai tay chỉ có 7/10 trường — thiếu `agu`/
   * `hcmue` khiến MỌI `programId` hợp lệ đã lưu cho 2 trường này bị coi là invalid (rơi mất âm
   * thầm). Giờ validity tra thẳng `programCatalog.ts` (dùng chung với `universityCatalog.ts`),
   * tự động theo mọi trường có adapter — không cần sửa file khi thêm trường mới.
   */
  it('accepts real AGU and HCMUE program ids (previously silently dropped)', () => {
    expect(parseStoredProgramId('agu', JSON.stringify({ selectedProgramId: '7480201' }))).toBe('7480201');
    expect(parseStoredProgramId('hcmue', JSON.stringify({ selectedProgramId: 'hcmue-7140201' }))).toBe('hcmue-7140201');
  });

  it('loadStoredProgramSelections covers every school with a comparison adapter', () => {
    expect(Object.keys(loadStoredProgramSelections()).sort()).toEqual(schoolComparisonAdapters.map((adapter) => adapter.schoolId).sort());
  });

  it('parses HCMUT existing selectedProgramId shape safely', () => {
    expect(parseStoredProgramId('hcmut', JSON.stringify({ selectedProgramId: 'khoa-hoc-may-tinh' }))).toBe('khoa-hoc-may-tinh');
  });

  it('rejects malformed and unknown program ids', () => {
    expect(parseStoredProgramId('hcmut', '{bad json')).toBeUndefined();
    expect(parseStoredProgramId('hcmut', JSON.stringify({ selectedProgramId: 'unknown' }))).toBeUndefined();
  });

  it('parses HCMUS selected program ids from the official 39-program registry', () => {
    expect(parseStoredProgramId('hcmus', JSON.stringify({ selectedProgramId: 'hcmus-75202a1' }))).toBe('hcmus-75202a1');
    expect(parseStoredProgramId('hcmus', JSON.stringify({ selectedProgramId: '75202a1' }))).toBeUndefined();
  });

  it('parses UHS selected program ids from the official 6-program registry', () => {
    expect(parseStoredProgramId('uhs', JSON.stringify({ selectedProgramId: 'uhs-7720101DH' }))).toBe('uhs-7720101DH');
    expect(parseStoredProgramId('uhs', JSON.stringify({ selectedProgramId: '7720101DH' }))).toBeUndefined();
  });
});
