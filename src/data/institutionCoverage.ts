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
  otherIndependentInstitutions: number;
  internalUnitEntries: number;
  researched: number;
  admissionDataAvailable: number;
  eligibilitySupported: number;
  calculatorSupported: number;
  partialCalculator: number;
  fullyVerified: number;
  catalogOnly: number;
}

export interface InstitutionCatalogAuditIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  schoolId?: string;
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
  const universityInstitutions = schools.filter(countsAsUniversityInstitution).length;
  const academies = schools.filter((school) => getSchoolEntityLevel(school) === 'academy').length;
  const pedagogicalColleges = schools.filter((school) => getSchoolEntityLevel(school) === 'college_pedagogy').length;
  const vocationalColleges = schools.filter((school) => getSchoolEntityLevel(school) === 'vocational_college').length;
  const independentEducationInstitutions = schools.filter(countsAsInstitutionEntry).length;
  const admissionDataAvailable = statuses.filter((status) => status !== 'catalog-only').length;
  return {
    totalCatalogEntries: schools.length,
    institutionEntries: independentEducationInstitutions,
    independentEducationInstitutions,
    universityInstitutions,
    academies,
    pedagogicalColleges,
    vocationalColleges,
    otherIndependentInstitutions: independentEducationInstitutions - universityInstitutions - academies - pedagogicalColleges - vocationalColleges,
    internalUnitEntries: schools.filter((school) => !countsAsInstitutionEntry(school)).length,
    researched: admissionDataAvailable,
    admissionDataAvailable,
    eligibilitySupported: statuses.filter((status) => status === 'eligibility-only').length,
    calculatorSupported: statuses.filter((status) => status === 'partial-calculator' || status === 'verified-calculator').length,
    partialCalculator: statuses.filter((status) => status === 'partial-calculator').length,
    fullyVerified: statuses.filter((status) => status === 'verified-calculator').length,
    catalogOnly: statuses.filter((status) => status === 'catalog-only').length,
  };
}

export const institutionCoverage = summarizeInstitutionCoverage();

function normalizeCatalogKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function duplicateIssues(
  schools: readonly SchoolModule[],
  field: 'id' | 'admissionCode' | 'name',
  code: string,
  label: string
): InstitutionCatalogAuditIssue[] {
  const byValue = new Map<string, SchoolModule[]>();
  for (const school of schools) {
    const raw = field === 'admissionCode' ? school.admissionCode : school[field];
    if (!raw) continue;
    const key = normalizeCatalogKey(raw);
    byValue.set(key, [...(byValue.get(key) ?? []), school]);
  }
  return [...byValue.entries()]
    .filter(([, matches]) => matches.length > 1)
    .map(([value, matches]) => ({
      severity: 'error' as const,
      code,
      message: `Duplicate ${label} "${value}" across: ${matches.map((school) => school.id).join(', ')}`,
    }));
}

export function auditInstitutionCatalog(schools: readonly SchoolModule[] = Object.values(schoolRegistry)): InstitutionCatalogAuditIssue[] {
  const issues: InstitutionCatalogAuditIssue[] = [
    ...duplicateIssues(schools, 'id', 'DUPLICATE_CATALOG_ID', 'catalog id'),
    ...duplicateIssues(schools, 'admissionCode', 'DUPLICATE_ADMISSION_CODE', 'admission code'),
    ...duplicateIssues(schools, 'name', 'DUPLICATE_CANONICAL_NAME', 'canonical name'),
  ];

  for (const school of schools) {
    const entityLevel = getSchoolEntityLevel(school);
    const isCollege = entityLevel === 'college_pedagogy' || entityLevel === 'vocational_college';

    if (isCollege && !school.educationLevels?.includes('college')) {
      issues.push({
        severity: 'warning',
        code: 'COLLEGE_MISSING_EDUCATION_LEVEL',
        schoolId: school.id,
        message: `${school.id} is classified as ${entityLevel} but does not declare educationLevels: ['college'].`,
      });
    }

    if (school.educationLevels?.includes('college') && !isCollege) {
      issues.push({
        severity: 'warning',
        code: 'COLLEGE_EDUCATION_LEVEL_WITHOUT_CLASSIFICATION',
        schoolId: school.id,
        message: `${school.id} declares college education level but is not classified as a college entry.`,
      });
    }

    if (isCollege && countsAsUniversityInstitution(school)) {
      issues.push({
        severity: 'error',
        code: 'COLLEGE_COUNTED_AS_UNIVERSITY',
        schoolId: school.id,
        message: `${school.id} is a college entry but is counted as university-level.`,
      });
    }

    if (
      entityLevel === 'vocational_college' &&
      (school.capabilities?.exactCalculator || school.capabilities?.partialCalculator || school.capabilities?.scoreConversion || school.capabilities?.eligibility)
    ) {
      issues.push({
        severity: 'error',
        code: 'VOCATIONAL_COLLEGE_HAS_UNIVERSITY_CAPABILITY',
        schoolId: school.id,
        message: `${school.id} is a vocational college but exposes calculator/eligibility capabilities.`,
      });
    }

    if (!school.ownership) {
      issues.push({ severity: 'warning', code: 'UNKNOWN_OWNERSHIP', schoolId: school.id, message: `${school.id} has no ownership metadata.` });
    }

    if (!school.region) {
      issues.push({ severity: 'warning', code: 'UNKNOWN_REGION', schoolId: school.id, message: `${school.id} has no region metadata.` });
    }

    if (isCollege && (!school.catalogSources || school.catalogSources.length === 0)) {
      issues.push({
        severity: 'warning',
        code: 'COLLEGE_MISSING_CATALOG_SOURCE',
        schoolId: school.id,
        message: `${school.id} is a college entry but has no catalog identity source metadata.`,
      });
    }
  }

  return issues;
}

export const SUPPORT_STATUS_LABELS: Record<InstitutionSupportStatus, string> = {
  'catalog-only': 'Đang thu thập dữ liệu',
  researched: 'Đang bổ sung dữ liệu',
  'eligibility-only': 'Chỉ kiểm tra điều kiện',
  'partial-calculator': 'Tính được một phần',
  'verified-calculator': 'Calculator xác minh',
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
