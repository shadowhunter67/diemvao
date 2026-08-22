// AUTO-GENERATED.
// DO NOT EDIT MANUALLY.
// Source of truth lives in private UniScoreVN data pipeline.

export const runtimeDataBuild = {
  generatedAt: "2026-08-22T00:00:00.000Z",
  schemaVersion: "runtime-v1",
  admissionYear: 2026,
} as const;

import type { AdmissionEvaluation } from '../core/admissionEvaluation';
import type { AdmissionMethodDescriptor } from '../core/admissionMethod';
import type { ApplicantProfile } from '../core/applicantProfile';
import type { SchoolModule } from '../core/schoolModule';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../compare/schoolComparisonAdapter';

interface SouthernCatalogSchool {
  id: string;
  shortName: string;
  name: string;
  location: string;
  ownership: SchoolModule['ownership'];
  summary: string;
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

export const southernCatalogSchools: readonly SouthernCatalogSchool[] = [
  {
    id: 'gdu',
    shortName: 'GDU',
    name: 'Trường Đại học Gia Định',
    location: 'TP.HCM',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research nguồn tuyển sinh chính thức trước khi tính điều kiện hoặc điểm.',
  },
  {
    id: 'stu',
    shortName: 'STU',
    name: 'Trường Đại học Công nghệ Sài Gòn',
    location: 'TP.HCM',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; chưa claim công thức/ngưỡng vì chưa có nguồn chính thức được nhập.',
  },
  {
    id: 'pntu',
    shortName: 'PNTU',
    name: 'Trường Đại học Y khoa Phạm Ngọc Thạch',
    location: 'TP.HCM',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; khối sức khỏe cần đối chiếu ngưỡng Bộ GD&ĐT và thông báo trường trước khi tính.',
  },
  {
    id: 'bdu',
    shortName: 'BDU',
    name: 'Trường Đại học Bình Dương',
    location: 'Bình Dương',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research đề án/điểm sàn chính thức.',
  },
  {
    id: 'lhu',
    shortName: 'LHU',
    name: 'Trường Đại học Lạc Hồng',
    location: 'Đồng Nai',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần nhập nguồn tuyển sinh chính thức trước khi hỗ trợ so sánh.',
  },
  {
    id: 'nlu',
    shortName: 'NLU',
    name: 'Trường Đại học Nông Lâm TP.HCM',
    location: 'TP.HCM',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research thông báo ngưỡng và phương thức 2026.',
  },
  {
    id: 'uah',
    shortName: 'UAH',
    name: 'Trường Đại học Kiến trúc TP.HCM',
    location: 'TP.HCM',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; ngành năng khiếu cần bảng điều kiện riêng trước khi tính.',
  },
  {
    id: 'uth',
    shortName: 'UTH',
    name: 'Trường Đại học Giao thông vận tải TP.HCM',
    location: 'TP.HCM',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; chưa nhập nguồn chính thức cho phương thức/ngưỡng 2026.',
  },
  {
    id: 'vaa',
    shortName: 'VAA',
    name: 'Học viện Hàng không Việt Nam',
    location: 'TP.HCM',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research đề án tuyển sinh và bảng ngưỡng.',
  },
  {
    id: 'hcmunre',
    shortName: 'HCMUNRE',
    name: 'Trường Đại học Tài nguyên và Môi trường TP.HCM',
    location: 'TP.HCM',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần xác minh nguồn tuyển sinh chính thức.',
  },
  {
    id: 'ctump',
    shortName: 'CTUMP',
    name: 'Trường Đại học Y Dược Cần Thơ',
    location: 'Cần Thơ',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; khối sức khỏe cần đối chiếu ngưỡng chính thức trước khi kết luận.',
  },
  {
    id: 'ctuet',
    shortName: 'CTUET',
    name: 'Trường Đại học Kỹ thuật - Công nghệ Cần Thơ',
    location: 'Cần Thơ',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; chưa nhập phương thức/ngưỡng chính thức.',
  },
  {
    id: 'nctu',
    shortName: 'NCTU',
    name: 'Trường Đại học Nam Cần Thơ',
    location: 'Cần Thơ',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research nguồn chính thức trước khi tính điểm.',
  },
  {
    id: 'tdu',
    shortName: 'TDU',
    name: 'Trường Đại học Tây Đô',
    location: 'Cần Thơ',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; chưa nhập dữ liệu tuyển sinh 2026.',
  },
  {
    id: 'tvu',
    shortName: 'TVU',
    name: 'Trường Đại học Trà Vinh',
    location: 'Trà Vinh',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research đề án/ngưỡng chính thức.',
  },
  {
    id: 'dthu',
    shortName: 'DThU',
    name: 'Trường Đại học Đồng Tháp',
    location: 'Đồng Tháp',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; nhóm sư phạm cần đối chiếu điều kiện riêng trước khi tính.',
  },
  {
    id: 'tgu',
    shortName: 'TGU',
    name: 'Trường Đại học Tiền Giang',
    location: 'Tiền Giang',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; chưa nhập nguồn tuyển sinh chính thức.',
  },
  {
    id: 'vnkgu',
    shortName: 'VNKGU',
    name: 'Trường Đại học Kiên Giang',
    location: 'Kiên Giang',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research ngưỡng/phương thức 2026.',
  },
  {
    id: 'blu',
    shortName: 'BLU',
    name: 'Trường Đại học Bạc Liêu',
    location: 'Bạc Liêu',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; chưa claim công thức/ngưỡng.',
  },
  {
    id: 'dnu',
    shortName: 'DNU',
    name: 'Trường Đại học Đồng Nai',
    location: 'Đồng Nai',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần xác minh nguồn tuyển sinh chính thức.',
  },
  {
    id: 'bvu',
    shortName: 'BVU',
    name: 'Trường Đại học Bà Rịa - Vũng Tàu',
    location: 'Bà Rịa - Vũng Tàu',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research thông báo tuyển sinh trước khi hỗ trợ so sánh.',
  },
  {
    id: 'mku',
    shortName: 'MKU',
    name: 'Trường Đại học Cửu Long',
    location: 'Vĩnh Long',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; chưa nhập dữ liệu chính thức.',
  },
  {
    id: 'ttu',
    shortName: 'TTU',
    name: 'Trường Đại học Tân Tạo',
    location: 'Long An',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research đề án/ngưỡng chính thức.',
  },
  {
    id: 'due',
    shortName: 'DLA',
    name: 'Trường Đại học Kinh tế Công nghiệp Long An',
    location: 'Long An',
    ownership: 'private',
    summary: 'Đã đưa vào roster miền Nam theo backlog; chưa nhập nguồn tuyển sinh chính thức.',
  },
  {
    id: 'pvu',
    shortName: 'PVU',
    name: 'Trường Đại học Dầu khí Việt Nam',
    location: 'Bà Rịa - Vũng Tàu',
    ownership: 'public',
    summary: 'Đã đưa vào roster miền Nam theo backlog; cần research phương thức tuyển sinh chính thức.',
  },
];

export const southernCatalogKnowledgeGap = {
  id: 'southern-catalog-official-admission-rules',
  label: 'Chưa research đủ nguồn tuyển sinh chính thức 2026 cho trường này.',
  status: 'incomplete' as const,
  impact: 'exact-final-score-blocking' as const,
};

export const southernCatalogMethods: AdmissionMethodDescriptor[] = southernCatalogSchools.map((school) => ({
  id: `${school.id}-catalog-2026`,
  schoolId: school.id,
  name: 'Thông tin tuyển sinh 2026 đang chờ research',
  year: 2026,
  applicantTypes: ['Thí sinh xét tuyển đại học chính quy 2026'],
  capabilities: unsupportedCapabilities,
  knowledgeGaps: [southernCatalogKnowledgeGap],
}));

export const southernCatalogModules: Record<string, SchoolModule> = Object.fromEntries(
  southernCatalogSchools.map((school) => [
    school.id,
    {
      id: school.id,
      name: school.name,
      shortName: school.shortName,
      about: `${school.name} (${school.location}).`,
      year: 2026,
      status: 'formula-incomplete',
      ownership: school.ownership,
      region: school.location === 'TP.HCM' ? 'hcm' : 'other',
      vnuhcm: false,
      summary: school.summary,
      capabilities: catalogOnlyCapabilities,
    },
  ])
);

function evaluateCatalogOnlySchool(school: SouthernCatalogSchool): AdmissionEvaluation {
  const methodId = `${school.id}-catalog-2026`;
  return {
    schoolId: school.id,
    year: 2026,
    methodId,
    confidence: 'unavailable',
    eligibility: {
      status: 'unknown',
      reasons: [`${school.shortName} đã có trong roster miền Nam, nhưng UniscoreVN chưa có nguồn chính thức đủ để kiểm tra điều kiện hoặc tính điểm.`],
    },
    missingInputs: [],
    missingRules: [southernCatalogKnowledgeGap.label],
    missingRequirements: [{ kind: 'unsupported', code: southernCatalogKnowledgeGap.id, label: southernCatalogKnowledgeGap.label }],
    explanation: [],
    evidence: [],
  };
}

export const southernCatalogComparisonAdapters: readonly SchoolComparisonAdapter[] = southernCatalogSchools.map((school) => ({
  schoolId: school.id,
  methodId: `${school.id}-catalog-2026`,
  methodName: 'Thông tin tuyển sinh 2026 đang chờ research',
  buildContext() {
    return {};
  },
  evaluate(_profile: ApplicantProfile): SchoolComparisonResult {
    return { evaluation: evaluateCatalogOnlySchool(school) };
  },
}));
