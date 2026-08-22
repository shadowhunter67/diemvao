import { schoolRegistry } from '../schools';
import type { SchoolEntityLevel, SchoolModule } from '../core/schoolModule';

export type InstitutionSupportStatus =
  | 'catalog-only'
  | 'researched'
  | 'eligibility-only'
  | 'partial-calculator'
  | 'verified-calculator';

export interface InstitutionCoverage {
  totalCatalogEntries: number;
  institutionEntries: number;
  independentEducationInstitutions: number;
  universityInstitutions: number;
  academies: number;
  pedagogicalColleges: number;
  vocationalColleges: number;
  internalUnitEntries: number;
  researched: number;
  eligibilitySupported: number;
  calculatorSupported: number;
  partialCalculator: number;
  fullyVerified: number;
  catalogOnly: number;
}

const NON_INSTITUTION_ENTITY_LEVELS: readonly SchoolEntityLevel[] = ['school', 'faculty', 'campus', 'program_group'];
const UNIVERSITY_ENTITY_LEVELS: readonly SchoolEntityLevel[] = [
  'institution',
  'university_system',
  'member_university',
  'other_degree_awarding_institution',
];

export function getSchoolEntityLevel(school: SchoolModule): SchoolEntityLevel {
  return school.entityLevel ?? 'institution';
}

export function countsAsInstitutionEntry(school: SchoolModule): boolean {
  return !NON_INSTITUTION_ENTITY_LEVELS.includes(getSchoolEntityLevel(school));
}

export function countsAsUniversityInstitution(school: SchoolModule): boolean {
  return UNIVERSITY_ENTITY_LEVELS.includes(getSchoolEntityLevel(school));
}

export function deriveInstitutionSupportStatus(school: SchoolModule): InstitutionSupportStatus {
  const capabilities = school.capabilities;
  if (capabilities?.exactCalculator) return 'verified-calculator';
  if (capabilities?.partialCalculator || capabilities?.scoreConversion) return 'partial-calculator';
  if (capabilities?.eligibility || capabilities?.cutoffs) return 'eligibility-only';
  if (capabilities?.admissionInfo || capabilities?.programs) return 'researched';
  return 'catalog-only';
}

export function summarizeInstitutionCoverage(schools: readonly SchoolModule[] = Object.values(schoolRegistry)): InstitutionCoverage {
  const statuses = schools.map((school) => deriveInstitutionSupportStatus(school));
  return {
    totalCatalogEntries: schools.length,
    institutionEntries: schools.filter(countsAsInstitutionEntry).length,
    independentEducationInstitutions: schools.filter(countsAsInstitutionEntry).length,
    universityInstitutions: schools.filter(countsAsUniversityInstitution).length,
    academies: schools.filter((school) => getSchoolEntityLevel(school) === 'academy').length,
    pedagogicalColleges: schools.filter((school) => getSchoolEntityLevel(school) === 'college_pedagogy').length,
    vocationalColleges: schools.filter((school) => getSchoolEntityLevel(school) === 'vocational_college').length,
    internalUnitEntries: schools.filter((school) => !countsAsInstitutionEntry(school)).length,
    researched: statuses.filter((status) => status !== 'catalog-only').length,
    eligibilitySupported: statuses.filter((status) => status === 'eligibility-only').length,
    calculatorSupported: statuses.filter((status) => status === 'partial-calculator' || status === 'verified-calculator').length,
    partialCalculator: statuses.filter((status) => status === 'partial-calculator').length,
    fullyVerified: statuses.filter((status) => status === 'verified-calculator').length,
    catalogOnly: statuses.filter((status) => status === 'catalog-only').length,
  };
}

export const institutionCoverage = summarizeInstitutionCoverage();

export const SUPPORT_STATUS_LABELS: Record<InstitutionSupportStatus, string> = {
  'catalog-only': 'Đang thu thập dữ liệu',
  researched: 'Đang bổ sung dữ liệu',
  'eligibility-only': 'Chỉ kiểm tra điều kiện',
  'partial-calculator': 'Tính được một phần',
  'verified-calculator': 'Đã xác minh',
};

export function getEntityLevelLabel(school: SchoolModule): string {
  switch (getSchoolEntityLevel(school)) {
    case 'academy':
      return 'Học viện';
    case 'college_pedagogy':
      return 'Cao đẳng sư phạm/GDMN';
    case 'vocational_college':
      return 'Cao đẳng nghề';
    case 'university_system':
      return 'Đại học';
    case 'member_university':
      return 'Trường thành viên';
    case 'school':
    case 'faculty':
    case 'program_group':
      return 'Đơn vị nội bộ';
    case 'campus':
      return 'Phân hiệu/cơ sở';
    case 'other_degree_awarding_institution':
      return 'Cơ sở đào tạo khác';
    case 'institution':
      return 'Trường đại học';
  }
}
