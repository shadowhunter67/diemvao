export interface DavProgram {
  programCode: string;
  name: string;
  majorCode: string;
  quota: number;
  isLawField: boolean;
}

export const DAV_PROGRAMS_2026: readonly DavProgram[] = [
  { programCode: 'HQT01', name: 'Quan he quoc te', majorCode: '7310206', quota: 400, isLawField: false },
  { programCode: 'HQT02', name: 'Ngon ngu Anh', majorCode: '7220201', quota: 200, isLawField: false },
  { programCode: 'HQT03', name: 'Kinh te quoc te', majorCode: '7310106', quota: 260, isLawField: false },
  { programCode: 'HQT04', name: 'Luat quoc te', majorCode: '7380108', quota: 200, isLawField: true },
  { programCode: 'HQT05', name: 'Truyen thong quoc te', majorCode: '7320107', quota: 400, isLawField: false },
  { programCode: 'HQT06', name: 'Kinh doanh quoc te', majorCode: '7340120', quota: 260, isLawField: false },
  { programCode: 'HQT07', name: 'Luat thuong mai quoc te', majorCode: '7380109', quota: 200, isLawField: true },
  { programCode: 'HQT08', name: 'Han Quoc hoc', majorCode: '7310614', quota: 80, isLawField: false },
  { programCode: 'HQT09', name: 'Hoa Ky hoc', majorCode: '7310640', quota: 40, isLawField: false },
  { programCode: 'HQT10', name: 'Nhat Ban hoc', majorCode: '7310613', quota: 40, isLawField: false },
  { programCode: 'HQT11', name: 'Trung Quoc hoc', majorCode: '7310612', quota: 120, isLawField: false },
];

export function getDavProgram(programCode: string | undefined): DavProgram | undefined {
  return DAV_PROGRAMS_2026.find((program) => program.programCode === programCode);
}
