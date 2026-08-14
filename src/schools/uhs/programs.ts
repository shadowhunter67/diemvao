export type UhsProgramGroup = 'medicine-like' | 'nursing';

export interface UhsProgram {
  id: string;
  code: string;
  name: string;
  quota2026: number;
  combinations: readonly string[];
  group: UhsProgramGroup;
}

export const UHS_PROGRAMS: UhsProgram[] = [
  { id: 'uhs-7720101', code: '7720101', name: 'Y khoa', quota2026: 340, combinations: ['B00', 'A02'], group: 'medicine-like' },
  { id: 'uhs-7720101DH', code: '7720101DH', name: 'Y khoa (dat hang)', quota2026: 120, combinations: ['B00', 'A02'], group: 'medicine-like' },
  { id: 'uhs-7720201', code: '7720201', name: 'Duoc hoc', quota2026: 180, combinations: ['B00', 'A00', 'A02'], group: 'medicine-like' },
  { id: 'uhs-7720501', code: '7720501', name: 'Rang - Ham - Mat', quota2026: 150, combinations: ['B00', 'A00', 'A02'], group: 'medicine-like' },
  { id: 'uhs-7720301', code: '7720301', name: 'Dieu duong', quota2026: 150, combinations: ['B00', 'A00', 'A02'], group: 'nursing' },
  { id: 'uhs-7720115', code: '7720115', name: 'Y hoc co truyen', quota2026: 120, combinations: ['B00', 'A00', 'A02'], group: 'medicine-like' },
];

export function findUhsProgram(programId: string | undefined): UhsProgram | undefined {
  return UHS_PROGRAMS.find((program) => program.id === programId);
}
