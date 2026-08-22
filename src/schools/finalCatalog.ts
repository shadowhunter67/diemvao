import type { AdmissionEvaluation } from '../core/admissionEvaluation';
import type { AdmissionMethodDescriptor } from '../core/admissionMethod';
import type { ApplicantProfile } from '../core/applicantProfile';
import type { SchoolModule } from '../core/schoolModule';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../compare/schoolComparisonAdapter';

interface FinalCatalogSchool {
  id: string;
  shortName: string;
  name: string;
  location: string;
  ownership: SchoolModule['ownership'];
  region: SchoolModule['region'];
  entityLevel?: SchoolModule['entityLevel'];
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

export const finalCatalogSchools: readonly FinalCatalogSchool[] = [
  { id: 'vnusis', shortName: 'VNU-SIS', name: 'Trường Khoa học liên ngành và Nghệ thuật - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'tnus', shortName: 'TNUS', name: 'Trường Đại học Khoa học - Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'tueba', shortName: 'TUEBA', name: 'Trường Đại học Kinh tế và Quản trị kinh doanh - Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'tnut', shortName: 'TNUT', name: 'Trường Đại học Kỹ thuật Công nghiệp - Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'tuaf', shortName: 'TUAF', name: 'Trường Đại học Nông Lâm - Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'tnue', shortName: 'TNUE', name: 'Trường Đại học Sư phạm - Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'tump', shortName: 'TUMP', name: 'Trường Đại học Y Dược - Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'tnuis', shortName: 'TNU-IS', name: 'Khoa Quốc tế - Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'tnufl', shortName: 'TNUFL', name: 'Trường Ngoại ngữ - Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'soict', shortName: 'SoICT', name: 'Trường Công nghệ Thông tin và Truyền thông - Đại học Bách khoa Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'sms', shortName: 'SMS-HUST', name: 'Trường Vật liệu - Đại học Bách khoa Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'sme', shortName: 'SME-HUST', name: 'Trường Cơ khí - Đại học Bách khoa Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'scls', shortName: 'SCLS', name: 'Trường Hóa và Khoa học sự sống - Đại học Bách khoa Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'seee', shortName: 'SEEE', name: 'Trường Điện - Điện tử - Đại học Bách khoa Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'semhust', shortName: 'SEM-HUST', name: 'Trường Kinh tế - Đại học Bách khoa Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'neucob', shortName: 'NEU-CoB', name: 'Trường Kinh doanh - Đại học Kinh tế Quốc dân', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'ncepa', shortName: 'NCEPA', name: 'Trường Kinh tế và Quản lý công - Đại học Kinh tế Quốc dân', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'nctneu', shortName: 'NCT-NEU', name: 'Trường Công nghệ - Đại học Kinh tế Quốc dân', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'naem', shortName: 'NAEM', name: 'Học viện Quản lý giáo dục', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'uad', shortName: 'UAD', name: 'Trường Đại học Mỹ thuật Công nghiệp', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'nuae', shortName: 'NUAE', name: 'Trường Đại học Sư phạm Nghệ thuật Trung ương', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hupes', shortName: 'HUPES', name: 'Trường Đại học Sư phạm Thể dục Thể thao Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hcmupes', shortName: 'HCMUPES', name: 'Trường Đại học Sư phạm Thể dục Thể thao TP.HCM', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'vgu', shortName: 'VGU', name: 'Trường Đại học Việt Đức', location: 'Bình Dương', ownership: 'public', region: 'other' },
  { id: 'hpu2', shortName: 'HPU2', name: 'Trường Đại học Sư phạm Hà Nội 2', location: 'Phú Thọ', ownership: 'public', region: 'other' },
  { id: 'vnam', shortName: 'VNAM', name: 'Học viện Âm nhạc Quốc gia Việt Nam', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnad', shortName: 'VNAD', name: 'Học viện Múa Việt Nam', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'huc', shortName: 'HUC', name: 'Trường Đại học Văn hóa Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnufa', shortName: 'VNUFA', name: 'Trường Đại học Mỹ thuật Việt Nam', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'skda', shortName: 'SKDA', name: 'Trường Đại học Sân khấu - Điện ảnh Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hcmcons', shortName: 'HCMCONS', name: 'Nhạc viện Thành phố Hồ Chí Minh', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'skdahcm', shortName: 'SKDAHCM', name: 'Trường Đại học Sân khấu - Điện ảnh TP.HCM', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'hcmufa', shortName: 'HCMUFA', name: 'Trường Đại học Mỹ thuật TP.HCM', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'ush', shortName: 'USH', name: 'Trường Đại học Thể dục Thể thao TP.HCM', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'vhs', shortName: 'VHS', name: 'Trường Đại học Văn hóa TP.HCM', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'ham', shortName: 'HAM', name: 'Học viện Âm nhạc Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'upes1', shortName: 'UPES1', name: 'Trường Đại học Thể dục Thể thao Bắc Ninh', location: 'Bắc Ninh', ownership: 'public', region: 'other' },
  { id: 'dsu', shortName: 'DSU', name: 'Trường Đại học Thể dục Thể thao Đà Nẵng', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'utt', shortName: 'UTT', name: 'Trường Đại học Công nghệ Giao thông vận tải', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hau', shortName: 'HAU', name: 'Trường Đại học Kiến trúc Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hnmu', shortName: 'HNMU', name: 'Trường Đại học Thủ đô Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hca', shortName: 'HCA', name: 'Học viện Cán bộ Thành phố Hồ Chí Minh', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'uhd', shortName: 'UHD', name: 'Trường Đại học Hải Dương', location: 'Hải Dương', ownership: 'public', region: 'other' },
  { id: 'naue', shortName: 'NAUE', name: 'Trường Đại học Kinh tế Nghệ An', location: 'Nghệ An', ownership: 'public', region: 'other' },
  { id: 'vmuvinh', shortName: 'VMU-Vinh', name: 'Trường Đại học Y khoa Vinh', location: 'Nghệ An', ownership: 'public', region: 'other' },
  { id: 'hluv', shortName: 'HLUV', name: 'Trường Đại học Hoa Lư', location: 'Ninh Bình', ownership: 'public', region: 'other' },
  { id: 'tbu', shortName: 'TBU', name: 'Trường Đại học Thái Bình', location: 'Thái Bình', ownership: 'public', region: 'other' },
  { id: 'tucst', shortName: 'TUCST', name: 'Trường Đại học Văn hóa, Thể thao và Du lịch Thanh Hóa', location: 'Thanh Hóa', ownership: 'public', region: 'other' },
  { id: 'cmcu', shortName: 'CMCU', name: 'Trường Đại học CMC', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'utm', shortName: 'UTM', name: 'Trường Đại học Công nghệ và Quản lý hữu nghị', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'hdiu', shortName: 'HDIU', name: 'Trường Đại học Đông Đô', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'hbu', shortName: 'HBU', name: 'Trường Đại học Hòa Bình', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'ntuhn', shortName: 'NTU-HN', name: 'Trường Đại học Nguyễn Trãi', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'fbu', shortName: 'FBU', name: 'Trường Đại học Tài chính - Ngân hàng Hà Nội', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'thanhdo', shortName: 'ThanhDo', name: 'Trường Đại học Thành Đô', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'vinuni', shortName: 'VinUni', name: 'Trường Đại học VinUni', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'dhv', shortName: 'DHV', name: 'Trường Đại học Hùng Vương TP.HCM', location: 'TP.HCM', ownership: 'private', region: 'hcm' },
  { id: 'umt', shortName: 'UMT', name: 'Trường Đại học Quản lý và Công nghệ TP.HCM', location: 'TP.HCM', ownership: 'private', region: 'hcm' },
  { id: 'bhu', shortName: 'BHU', name: 'Trường Đại học Quốc tế Bắc Hà', location: 'Bắc Ninh', ownership: 'private', region: 'other' },
  { id: 'eaut', shortName: 'EAUT', name: 'Trường Đại học Công nghệ Đông Á', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'cvauni', shortName: 'CVAUni', name: 'Trường Đại học Chu Văn An', location: 'Hưng Yên', ownership: 'private', region: 'other' },
  { id: 'ltvuni', shortName: 'LTVUni', name: 'Trường Đại học Lương Thế Vinh', location: 'Nam Định', ownership: 'private', region: 'other' },
  { id: 'trungvuong', shortName: 'TVUni', name: 'Trường Đại học Trưng Vương', location: 'Vĩnh Phúc', ownership: 'private', region: 'other' },
  { id: 'kinhbac', shortName: 'KBU', name: 'Trường Đại học Kinh Bắc', location: 'Bắc Ninh', ownership: 'private', region: 'other' },
  { id: 'mdu', shortName: 'MDU', name: 'Trường Đại học Miền Đông', location: 'Đồng Nai', ownership: 'private', region: 'other' },
  { id: 'vttu', shortName: 'VTTU', name: 'Trường Đại học Võ Trường Toản', location: 'Hậu Giang', ownership: 'private', region: 'other' },
  { id: 'eiu', shortName: 'EIU', name: 'Trường Đại học Quốc tế Miền Đông', location: 'Bình Dương', ownership: 'private', region: 'other' },
  { id: 'aiu', shortName: 'AIU', name: 'Trường Đại học Quốc tế Á Châu', location: 'TP.HCM', ownership: 'private', region: 'hcm' },
  { id: 'qtu', shortName: 'QTU', name: 'Trường Đại học Quang Trung', location: 'Bình Định', ownership: 'private', region: 'other' },
  { id: 'tbdu', shortName: 'TBDU', name: 'Trường Đại học Thái Bình Dương', location: 'Khánh Hòa', ownership: 'private', region: 'other' },
  { id: 'pxu', shortName: 'PXU', name: 'Trường Đại học Phú Xuân', location: 'Huế', ownership: 'private', region: 'other' },
  { id: 'fuv', shortName: 'FUV', name: 'Trường Đại học Fulbright Việt Nam', location: 'TP.HCM', ownership: 'private', region: 'hcm' },
  { id: 'rmitvn', shortName: 'RMITVN', name: 'Trường Đại học RMIT Việt Nam', location: 'TP.HCM', ownership: 'private', region: 'hcm' },
  { id: 'buv', shortName: 'BUV', name: 'Trường Đại học Anh Quốc Việt Nam', location: 'Hưng Yên', ownership: 'private', region: 'other' },
  { id: 'apd', shortName: 'APD', name: 'Học viện Chính sách và Phát triển', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'napa', shortName: 'NAPA', name: 'Học viện Hành chính Quốc gia', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'gass', shortName: 'GASS', name: 'Học viện Khoa học xã hội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'usth', shortName: 'USTH', name: 'Trường Đại học Khoa học và Công nghệ Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vwa', shortName: 'VWA', name: 'Học viện Phụ nữ Việt Nam', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vya', shortName: 'VYA', name: 'Học viện Thanh thiếu niên Việt Nam', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'tuu', shortName: 'TUU', name: 'Trường Đại học Công đoàn', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hunre', shortName: 'HUNRE', name: 'Trường Đại học Tài nguyên và Môi trường Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'ulsa', shortName: 'ULSA', name: 'Trường Đại học Lao động - Xã hội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'mpa', shortName: 'MPA', name: 'Học viện Chính trị Quân đội Nhân dân Việt Nam', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'logacademy', shortName: 'MAL', name: 'Học viện Hậu cần', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'msa', shortName: 'MSA', name: 'Học viện Khoa học Quân sự', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'actvn', shortName: 'ACTVN', name: 'Học viện Kỹ thuật Mật mã', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'mta', shortName: 'MTA', name: 'Học viện Kỹ thuật Quân sự', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'aadaa', shortName: 'AADAA', name: 'Học viện Phòng không - Không quân', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vmmu', shortName: 'VMMU', name: 'Học viện Quân y', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'nda', shortName: 'NDA', name: 'Học viện Quốc phòng', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'ocp', shortName: 'OCP', name: 'Trường Đại học Sĩ quan Chính trị', location: 'Bắc Ninh', ownership: 'public', region: 'other' },
  { id: 'tqt', shortName: 'TQT', name: 'Trường Đại học Trần Quốc Tuấn - Sĩ quan Lục quân 1', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'sigo', shortName: 'SIGO', name: 'Trường Đại học Sĩ quan Thông tin liên lạc', location: 'Khánh Hòa', ownership: 'public', region: 'other' },
  { id: 'aoc', shortName: 'AOC', name: 'Trường Đại học Sĩ quan Pháo binh', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'cco', shortName: 'CCO', name: 'Trường Đại học Sĩ quan Phòng hóa', location: 'Bắc Giang', ownership: 'public', region: 'other' },
  { id: 'psa', shortName: 'PSA', name: 'Học viện An ninh Nhân dân', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'ppa', shortName: 'PPA', name: 'Học viện Cảnh sát Nhân dân', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'fpfu', shortName: 'FPFU', name: 'Trường Đại học Phòng cháy chữa cháy', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'psu', shortName: 'PSU-CAND', name: 'Trường Đại học An ninh Nhân dân', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'ppu', shortName: 'PPU-CAND', name: 'Trường Đại học Cảnh sát Nhân dân', location: 'TP.HCM', ownership: 'public', region: 'hcm' },
  { id: 'bga', shortName: 'BGA', name: 'Học viện Biên phòng', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'navalacademy', shortName: 'VNA-Navy', name: 'Học viện Hải quân', location: 'Khánh Hòa', ownership: 'public', region: 'other' },
];

const finalCatalogInternalUnitIds = new Set([
  'tnuis',
  'soict',
  'sms',
  'sme',
  'scls',
  'seee',
  'semhust',
  'neucob',
  'ncepa',
  'nctneu',
]);

function resolveFinalCatalogEntityLevel(school: FinalCatalogSchool): SchoolModule['entityLevel'] {
  if (finalCatalogInternalUnitIds.has(school.id)) return school.id === 'tnuis' ? 'faculty' : 'school';
  if (school.name.startsWith('Học viện')) return 'academy';
  if (school.name.startsWith('Đại học')) return 'university_system';
  return school.entityLevel ?? 'institution';
}

export const finalCatalogKnowledgeGap = {
  id: 'final-catalog-official-admission-rules',
  label: 'Chưa research đủ nguồn tuyển sinh chính thức 2026 cho trường này.',
  status: 'incomplete' as const,
  impact: 'exact-final-score-blocking' as const,
};

export const finalCatalogMethods: AdmissionMethodDescriptor[] = finalCatalogSchools.map((school) => ({
  id: `${school.id}-catalog-2026`,
  schoolId: school.id,
  name: 'Thông tin tuyển sinh 2026 đang chờ research',
  year: 2026,
  applicantTypes: ['Thí sinh xét tuyển đại học chính quy 2026'],
  capabilities: unsupportedCapabilities,
  knowledgeGaps: [finalCatalogKnowledgeGap],
}));

export const finalCatalogModules: Record<string, SchoolModule> = Object.fromEntries(
  finalCatalogSchools.map((school) => [
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
      entityLevel: resolveFinalCatalogEntityLevel(school),
      vnuhcm: false,
      summary: 'Đã đưa vào roster 238 theo catalog toàn quốc; cần research nguồn tuyển sinh chính thức trước khi tính điều kiện hoặc điểm.',
      capabilities: catalogOnlyCapabilities,
    },
  ])
);

function evaluateCatalogOnlySchool(school: FinalCatalogSchool): AdmissionEvaluation {
  return {
    schoolId: school.id,
    year: 2026,
    methodId: `${school.id}-catalog-2026`,
    confidence: 'unavailable',
    eligibility: {
      status: 'unknown',
      reasons: [`${school.shortName} đã có trong roster 238, nhưng UniscoreVN chưa có nguồn chính thức đủ để kiểm tra điều kiện hoặc tính điểm.`],
    },
    missingInputs: [],
    missingRules: [finalCatalogKnowledgeGap.label],
    missingRequirements: [{ kind: 'unsupported', code: finalCatalogKnowledgeGap.id, label: finalCatalogKnowledgeGap.label }],
    explanation: [],
    evidence: [],
  };
}

export const finalCatalogComparisonAdapters: readonly SchoolComparisonAdapter[] = finalCatalogSchools.map((school) => ({
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
