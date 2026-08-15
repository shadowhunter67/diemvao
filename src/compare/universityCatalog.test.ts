import { describe, expect, it } from 'vitest';
import { getProgramCatalogEntry, searchProgramCatalog, searchUniversityCatalog, universityCatalog } from './universityCatalog';

describe('universityCatalog', () => {
  it('contains the current supported runtime schools with real program registries', () => {
    expect(universityCatalog.map((entry) => entry.schoolId)).toEqual(expect.arrayContaining(['hcmut', 'ueh', 'iu', 'uel', 'hcmus', 'ussh', 'uhs', 'uit', 'agu']));
    expect(getProgramCatalogEntry('ussh', 'ussh-7310401')?.name).toBeTruthy();
    expect(getProgramCatalogEntry('agu', '7480201')?.code).toBe('7480201');
  });

  it('supports acronym, Vietnamese, and accent-insensitive school search', () => {
    expect(searchUniversityCatalog('hcmut').map((entry) => entry.schoolId)).toContain('hcmut');
    expect(searchUniversityCatalog('bach khoa').map((entry) => entry.schoolId)).toContain('hcmut');
    expect(searchUniversityCatalog('nhan van').map((entry) => entry.schoolId)).toContain('ussh');
  });

  it('supports code and accent-insensitive program search', () => {
    const hcmus = universityCatalog.find((entry) => entry.schoolId === 'hcmus')!;
    expect(searchProgramCatalog('7480101TT', hcmus.programs).some((program) => program.code === '7480101TT')).toBe(true);
    expect(searchProgramCatalog('khoa hoc may tinh', hcmus.programs).some((program) => program.name.includes('Khoa'))).toBe(true);
  });
});
