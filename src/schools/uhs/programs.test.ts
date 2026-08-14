import { describe, expect, it } from 'vitest';
import { UHS_PROGRAMS, findUhsProgram } from './programs';

describe('UHS_PROGRAMS', () => {
  it('contains the 6 official 2026 program identities and 1,060 total quota', () => {
    expect(UHS_PROGRAMS).toHaveLength(6);
    expect(UHS_PROGRAMS.map((program) => program.id)).toEqual([
      'uhs-7720101',
      'uhs-7720101DH',
      'uhs-7720201',
      'uhs-7720501',
      'uhs-7720301',
      'uhs-7720115',
    ]);
    expect(UHS_PROGRAMS.reduce((sum, program) => sum + program.quota2026, 0)).toBe(1060);
  });

  it('keeps regular and commissioned medicine as distinct programs', () => {
    expect(findUhsProgram('uhs-7720101')?.code).toBe('7720101');
    expect(findUhsProgram('uhs-7720101DH')?.code).toBe('7720101DH');
  });

  it('uses official combinations by program', () => {
    expect(findUhsProgram('uhs-7720101')?.combinations).toEqual(['B00', 'A02']);
    expect(findUhsProgram('uhs-7720201')?.combinations).toEqual(['B00', 'A00', 'A02']);
    expect(findUhsProgram('uhs-7720301')?.group).toBe('nursing');
  });
});
