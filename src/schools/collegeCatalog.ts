import type { AdmissionEvaluation } from '../core/admissionEvaluation';
import type { AdmissionMethodDescriptor } from '../core/admissionMethod';
import type { ApplicantProfile } from '../core/applicantProfile';
import type { SchoolModule } from '../core/schoolModule';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../compare/schoolComparisonAdapter';

interface CollegeCatalogSchool {
  id: string;
  shortName: string;
  name: string;
  location: string;
  ownership: SchoolModule['ownership'];
  region: SchoolModule['region'];
  entityLevel: 'college_pedagogy' | 'vocational_college';
  aliases?: readonly string[];
}

const unsupportedCapabilities = {
  eligibility: false,
  scoreConversion: false,
  bonus: false,
  priority: false,
  exactCalculator: false,
} satisfies AdmissionMethodDescriptor['capabilities'];

const catalogOnlyCapabilities = {
  admissionInfo: false,
  programs: false,
  eligibility: false,
  cutoffs: false,
  scoreConversion: false,
  exactCalculator: false,
} satisfies NonNullable<SchoolModule['capabilities']>;

export const collegeCatalogSources = [
  {
    id: 'moet-admission-regulation-06-2026',
    title: 'Thông tư 06/2026/TT-BGDĐT ban hành Quy chế tuyển sinh đại học và cao đẳng ngành Giáo dục Mầm non',
    url: 'https://tuyensinh.moet.gov.vn/ts/van-ban/thong-tu-06-2026-tt-bgddt-cua-bo-giao-duc-va-dao-tao-ban-hanh-quy-che-tuyen-sinh-cac-nganh-dao-tao-t--9483cd05-0038-4279-8fe7-ea36aa5e67ac',
    type: 'official',
  },
  {
    id: 'gov-decision-1723-2025-moet-public-units',
    title: 'Quyết định 1723/QĐ-TTg ban hành danh sách các đơn vị sự nghiệp công lập trực thuộc Bộ Giáo dục và Đào tạo',
    url: 'https://chinhphu.vn/?classid=2&docid=214915&pageid=27160',
    type: 'official',
  },
] as const;

export const collegeCatalogSchools: readonly CollegeCatalogSchool[] = [
  {
    id: 'nce',
    shortName: 'NCE',
    name: 'Trường Cao đẳng Sư phạm Trung ương',
    location: 'Hà Nội',
    ownership: 'public',
    region: 'hanoi',
    entityLevel: 'college_pedagogy',
    aliases: ['CĐSP Trung ương', 'Cao đẳng Sư phạm Trung ương'],
  },
  {
    id: 'ncspnt',
    shortName: 'CĐSPTW-NT',
    name: 'Trường Cao đẳng Sư phạm Trung ương - Nha Trang',
    location: 'Khánh Hòa',
    ownership: 'public',
    region: 'other',
    entityLevel: 'college_pedagogy',
    aliases: ['CĐSP Trung ương Nha Trang', 'Cao đẳng Sư phạm Trung ương Nha Trang'],
  },
  {
    id: 'ncehcm',
    shortName: 'CĐSPTW-HCM',
    name: 'Trường Cao đẳng Sư phạm Trung ương Thành phố Hồ Chí Minh',
    location: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'college_pedagogy',
    aliases: ['CĐSP Trung ương TP.HCM', 'Cao đẳng Sư phạm Trung ương TP.HCM'],
  },
  {
    id: 'vcte',
    shortName: 'VCTE',
    name: 'Trường Cao đẳng nghề Kỹ thuật công nghệ',
    location: 'Hà Nội',
    ownership: 'public',
    region: 'hanoi',
    entityLevel: 'vocational_college',
    aliases: ['Cao đẳng nghề Kỹ thuật công nghệ'],
  },
  {
    id: 'dungquatcollege',
    shortName: 'DQC',
    name: 'Trường Cao đẳng Kỹ nghệ Dung Quất',
    location: 'Quảng Ngãi',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
  },
  {
    id: 'hvct',
    shortName: 'HVCT',
    name: 'Trường Cao đẳng Kỹ nghệ II',
    location: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
  },
  {
    id: 'cic1',
    shortName: 'CIC1',
    name: 'Trường Cao đẳng Xây dựng số 1',
    location: 'Hà Nội',
    ownership: 'public',
    region: 'hanoi',
    entityLevel: 'vocational_college',
  },
  {
    id: 'hcmcc',
    shortName: 'HCMCC',
    name: 'Trường Cao đẳng Xây dựng Thành phố Hồ Chí Minh',
    location: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
  },
  {
    id: 'ncc',
    shortName: 'NCC',
    name: 'Trường Cao đẳng Xây dựng Nam Định',
    location: 'Nam Định',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
  },
  {
    id: 'cuwc',
    shortName: 'CUWC',
    name: 'Trường Cao đẳng Xây dựng Công trình đô thị',
    location: 'Hà Nội',
    ownership: 'public',
    region: 'hanoi',
    entityLevel: 'vocational_college',
  },
  {
    id: 'vietxo1',
    shortName: 'Việt-Xô 1',
    name: 'Trường Cao đẳng nghề Việt - Xô số 1',
    location: 'Vĩnh Phúc',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
    aliases: ['Cao đẳng nghề Việt Xô số 1'],
  },
  {
    id: 'lilama2',
    shortName: 'Lilama 2',
    name: 'Trường Cao đẳng Công nghệ Quốc tế Lilama 2',
    location: 'Đồng Nai',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
  },
  {
    id: 'cmc-college',
    shortName: 'CMC-CĐ',
    name: 'Trường Cao đẳng Cơ giới Xây dựng',
    location: 'Quảng Ninh',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
  },
  {
    id: 'ccst',
    shortName: 'CCST',
    name: 'Trường Cao đẳng Xây dựng và Công nghệ - Xã hội',
    location: 'Nghệ An',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
  },
  {
    id: 'hctb',
    shortName: 'HCTB',
    name: 'Trường Cao đẳng Kỹ thuật và Nghiệp vụ Hà Nội',
    location: 'Hà Nội',
    ownership: 'public',
    region: 'hanoi',
    entityLevel: 'vocational_college',
  },
];

export const collegeCatalogKnowledgeGap = {
  id: 'college-catalog-official-admission-rules',
  label: 'Chưa nhập đủ đề án/thông báo tuyển sinh chính thức cho trường cao đẳng này.',
  status: 'incomplete' as const,
  impact: 'exact-final-score-blocking' as const,
};

export const collegeCatalogMethods: AdmissionMethodDescriptor[] = collegeCatalogSchools.map((school) => ({
  id: `${school.id}-catalog-2026`,
  schoolId: school.id,
  name: 'Thông tin tuyển sinh cao đẳng đang chờ research',
  year: 2026,
  applicantTypes: ['Thí sinh xét tuyển cao đẳng 2026'],
  capabilities: unsupportedCapabilities,
  knowledgeGaps: [collegeCatalogKnowledgeGap],
}));

export const collegeCatalogModules: Record<string, SchoolModule> = Object.fromEntries(
  collegeCatalogSchools.map((school) => [
    school.id,
    {
      id: school.id,
      name: school.name,
      shortName: school.shortName,
      about: `${school.name} (${school.location}).`,
      year: 2026,
      status: 'formula-incomplete',
      ownership: school.ownership,
      region: school.region,
      entityLevel: school.entityLevel,
      educationLevels: ['college'],
      aliases: school.aliases,
      vnuhcm: false,
      summary:
        school.entityLevel === 'college_pedagogy'
          ? 'Có trong catalog cao đẳng sư phạm/Giáo dục Mầm non; cần đề án tuyển sinh chính thức trước khi kiểm tra điều kiện hoặc tính điểm.'
          : 'Có trong catalog cao đẳng giáo dục nghề nghiệp; không dùng chung công thức tuyển sinh đại học và cần nguồn chính thức riêng trước khi tính điểm.',
      capabilities: catalogOnlyCapabilities,
    },
  ])
);

function evaluateCollegeCatalogOnly(school: CollegeCatalogSchool): AdmissionEvaluation {
  return {
    schoolId: school.id,
    year: 2026,
    methodId: `${school.id}-catalog-2026`,
    confidence: 'unavailable',
    eligibility: {
      status: 'unknown',
      reasons: [`${school.shortName} đã có trong catalog cao đẳng, nhưng UniScoreVN chưa có nguồn chính thức đủ để kiểm tra điều kiện hoặc tính điểm.`],
    },
    missingInputs: [],
    missingRules: [collegeCatalogKnowledgeGap.label],
    missingRequirements: [{ kind: 'unsupported', code: collegeCatalogKnowledgeGap.id, label: collegeCatalogKnowledgeGap.label }],
    explanation: [],
    evidence: [],
  };
}

export const collegeCatalogComparisonAdapters: readonly SchoolComparisonAdapter[] = collegeCatalogSchools.map((school) => ({
  schoolId: school.id,
  methodId: `${school.id}-catalog-2026`,
  methodName: 'Thông tin tuyển sinh cao đẳng đang chờ research',
  buildContext() {
    return {};
  },
  evaluate(_profile: ApplicantProfile): SchoolComparisonResult {
    return { evaluation: evaluateCollegeCatalogOnly(school) };
  },
}));
