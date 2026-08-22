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
  internalUnitEntries: number;
  researched: number;
  eligibilitySupported: number;
  calculatorSupported: number;
  partialCalculator: number;
  fullyVerified: number;
  catalogOnly: number;
}

const NON_INSTITUTION_ENTITY_LEVELS: readonly SchoolEntityLevel[] = ['school', 'faculty', 'campus', 'program_group'];

export function getSchoolEntityLevel(school: SchoolModule): SchoolEntityLevel {
  return school.entityLevel ?? 'institution';
}

export function countsAsInstitutionEntry(school: SchoolModule): boolean {
  return !NON_INSTITUTION_ENTITY_LEVELS.includes(getSchoolEntityLevel(school));
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
