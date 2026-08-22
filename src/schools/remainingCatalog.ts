import type { AdmissionEvaluation } from '../core/admissionEvaluation';
import type { AdmissionMethodDescriptor } from '../core/admissionMethod';
import type { ApplicantProfile } from '../core/applicantProfile';
import type { SchoolModule } from '../core/schoolModule';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../compare/schoolComparisonAdapter';

interface RemainingCatalogSchool {
  id: string;
  shortName: string;
  name: string;
  location: string;
  ownership: SchoolModule['ownership'];
  region: SchoolModule['region'];
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

export const remainingCatalogSchools: readonly RemainingCatalogSchool[] = [
  { id: 'vnuuet', shortName: 'VNU-UET', name: 'Trường Đại học Công nghệ - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnueb', shortName: 'VNU-UEB', name: 'Trường Đại học Kinh tế - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnuhus', shortName: 'VNU-HUS', name: 'Trường Đại học Khoa học Tự nhiên - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnussh', shortName: 'VNU-USSH', name: 'Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnuulis', shortName: 'VNU-ULIS', name: 'Trường Đại học Ngoại ngữ - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnued', shortName: 'VNU-UED', name: 'Trường Đại học Giáo dục - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnuump', shortName: 'VNU-UMP', name: 'Trường Đại học Y Dược - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnuvju', shortName: 'VJU', name: 'Trường Đại học Việt Nhật - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnulaw', shortName: 'VNU-LS', name: 'Trường Đại học Luật - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnuhsb', shortName: 'VNU-HSB', name: 'Trường Quản trị và Kinh doanh - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnuis', shortName: 'VNU-IS', name: 'Trường Quốc tế - ĐHQG Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hust', shortName: 'HUST', name: 'Đại học Bách khoa Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'tmu', shortName: 'TMU', name: 'Trường Đại học Thương mại', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'huce', shortName: 'HUCE', name: 'Trường Đại học Xây dựng Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'humg', shortName: 'HUMG', name: 'Trường Đại học Mỏ - Địa chất', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hou', shortName: 'HOU', name: 'Trường Đại học Mở Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hanu', shortName: 'HANU', name: 'Trường Đại học Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'haui', shortName: 'HaUI', name: 'Trường Đại học Công nghiệp Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'aof', shortName: 'AOF', name: 'Học viện Tài chính', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'bav', shortName: 'BAV', name: 'Học viện Ngân hàng', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnua', shortName: 'VNUA', name: 'Học viện Nông nghiệp Việt Nam', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'dav', shortName: 'DAV', name: 'Học viện Ngoại giao', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'ajc', shortName: 'AJC', name: 'Học viện Báo chí và Tuyên truyền', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hlu', shortName: 'HLU', name: 'Trường Đại học Luật Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hmu', shortName: 'HMU', name: 'Trường Đại học Y Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'hup', shortName: 'HUP', name: 'Trường Đại học Dược Hà Nội', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'tlu', shortName: 'TLU', name: 'Trường Đại học Thủy lợi', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'vnuf', shortName: 'VNUF', name: 'Trường Đại học Lâm nghiệp', location: 'Hà Nội', ownership: 'public', region: 'hanoi' },
  { id: 'thanglong', shortName: 'TLU-HN', name: 'Trường Đại học Thăng Long', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'fptu', shortName: 'FPTU', name: 'Trường Đại học FPT', location: 'Đa cơ sở', ownership: 'private', region: 'hanoi' },
  { id: 'hubt', shortName: 'HUBT', name: 'Trường Đại học Kinh doanh và Công nghệ Hà Nội', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'dainam', shortName: 'DNU-HN', name: 'Trường Đại học Đại Nam', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'phenikaa', shortName: 'Phenikaa', name: 'Trường Đại học Phenikaa', location: 'Hà Nội', ownership: 'private', region: 'hanoi' },
  { id: 'tnu', shortName: 'TNU', name: 'Đại học Thái Nguyên', location: 'Thái Nguyên', ownership: 'public', region: 'other' },
  { id: 'dhp', shortName: 'DHP', name: 'Trường Đại học Hải Phòng', location: 'Hải Phòng', ownership: 'public', region: 'other' },
  { id: 'vmu', shortName: 'VMU', name: 'Trường Đại học Hàng hải Việt Nam', location: 'Hải Phòng', ownership: 'public', region: 'other' },
  { id: 'hpmu', shortName: 'HPMU', name: 'Trường Đại học Y Dược Hải Phòng', location: 'Hải Phòng', ownership: 'public', region: 'other' },
  { id: 'hdu', shortName: 'HDU', name: 'Trường Đại học Hồng Đức', location: 'Thanh Hóa', ownership: 'public', region: 'other' },
  { id: 'htu', shortName: 'HTU', name: 'Trường Đại học Hà Tĩnh', location: 'Hà Tĩnh', ownership: 'public', region: 'other' },
  { id: 'halongu', shortName: 'HALOU', name: 'Trường Đại học Hạ Long', location: 'Quảng Ninh', ownership: 'public', region: 'other' },
  { id: 'tqu', shortName: 'TQU', name: 'Trường Đại học Tân Trào', location: 'Tuyên Quang', ownership: 'public', region: 'other' },
  { id: 'hvu', shortName: 'HVU', name: 'Trường Đại học Hùng Vương', location: 'Phú Thọ', ownership: 'public', region: 'other' },
  { id: 'hueu', shortName: 'HueU', name: 'Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'husc', shortName: 'HUSC', name: 'Trường Đại học Khoa học - Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'hce', shortName: 'HCE', name: 'Trường Đại học Kinh tế - Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'hul', shortName: 'HUL', name: 'Trường Đại học Luật - Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'huaf', shortName: 'HUAF', name: 'Trường Đại học Nông Lâm - Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'hueedu', shortName: 'HUED', name: 'Trường Đại học Sư phạm - Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'hump', shortName: 'HUMP', name: 'Trường Đại học Y Dược - Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'hufl', shortName: 'HUFL', name: 'Trường Đại học Ngoại ngữ - Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'hat', shortName: 'HAT', name: 'Trường Du lịch - Đại học Huế', location: 'Huế', ownership: 'public', region: 'other' },
  { id: 'udn', shortName: 'UDN', name: 'Đại học Đà Nẵng', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'dut', shortName: 'DUT', name: 'Trường Đại học Bách khoa - Đại học Đà Nẵng', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'dueudn', shortName: 'DUE-UDN', name: 'Trường Đại học Kinh tế - Đại học Đà Nẵng', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'uedudn', shortName: 'UED-UDN', name: 'Trường Đại học Sư phạm - Đại học Đà Nẵng', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'uflsudn', shortName: 'UFLS-UDN', name: 'Trường Đại học Ngoại ngữ - Đại học Đà Nẵng', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'uteudn', shortName: 'UTE-UDN', name: 'Trường Đại học Sư phạm Kỹ thuật - Đại học Đà Nẵng', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'vku', shortName: 'VKU', name: 'Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'dtu', shortName: 'DTU', name: 'Trường Đại học Duy Tân', location: 'Đà Nẵng', ownership: 'private', region: 'other' },
  { id: 'uda', shortName: 'UDA', name: 'Trường Đại học Đông Á', location: 'Đà Nẵng', ownership: 'private', region: 'other' },
  { id: 'ntu', shortName: 'NTU', name: 'Trường Đại học Nha Trang', location: 'Khánh Hòa', ownership: 'public', region: 'other' },
  { id: 'dlu', shortName: 'DLU', name: 'Trường Đại học Đà Lạt', location: 'Lâm Đồng', ownership: 'public', region: 'other' },
  { id: 'qnu', shortName: 'QNU', name: 'Trường Đại học Quy Nhơn', location: 'Bình Định', ownership: 'public', region: 'other' },
  { id: 'ttn', shortName: 'TTN', name: 'Trường Đại học Tây Nguyên', location: 'Đắk Lắk', ownership: 'public', region: 'other' },
  { id: 'qnamu', shortName: 'QNamU', name: 'Trường Đại học Quảng Nam', location: 'Quảng Nam', ownership: 'public', region: 'other' },
  { id: 'qbu', shortName: 'QBU', name: 'Trường Đại học Quảng Bình', location: 'Quảng Bình', ownership: 'public', region: 'other' },
  { id: 'pdu', shortName: 'PDU', name: 'Trường Đại học Phạm Văn Đồng', location: 'Quảng Ngãi', ownership: 'public', region: 'other' },
  { id: 'pyu', shortName: 'PYU', name: 'Trường Đại học Phú Yên', location: 'Phú Yên', ownership: 'public', region: 'other' },
  { id: 'ukh', shortName: 'UKH', name: 'Trường Đại học Khánh Hòa', location: 'Khánh Hòa', ownership: 'public', region: 'other' },
  { id: 'muce', shortName: 'MUCE', name: 'Trường Đại học Xây dựng Miền Trung', location: 'Phú Yên', ownership: 'public', region: 'other' },
  { id: 'bmtu', shortName: 'BMTU', name: 'Trường Đại học Y Dược Buôn Ma Thuột', location: 'Đắk Lắk', ownership: 'private', region: 'other' },
  { id: 'dumtp', shortName: 'DUMTP', name: 'Trường Đại học Kỹ thuật Y Dược Đà Nẵng', location: 'Đà Nẵng', ownership: 'public', region: 'other' },
  { id: 'pctu', shortName: 'PCTU', name: 'Trường Đại học Phan Châu Trinh', location: 'Đà Nẵng', ownership: 'private', region: 'other' },
  { id: 'ydlu', shortName: 'YDLU', name: 'Trường Đại học Yersin Đà Lạt', location: 'Lâm Đồng', ownership: 'private', region: 'other' },
  { id: 'upt', shortName: 'UPT', name: 'Trường Đại học Phan Thiết', location: 'Bình Thuận', ownership: 'private', region: 'other' },
];

export const remainingCatalogKnowledgeGap = {
  id: 'remaining-catalog-official-admission-rules',
  label: 'Chưa research đủ nguồn tuyển sinh chính thức 2026 cho trường này.',
  status: 'incomplete' as const,
  impact: 'exact-final-score-blocking' as const,
};

export const remainingCatalogMethods: AdmissionMethodDescriptor[] = remainingCatalogSchools.map((school) => ({
  id: `${school.id}-catalog-2026`,
  schoolId: school.id,
  name: 'Thông tin tuyển sinh 2026 đang chờ research',
  year: 2026,
  applicantTypes: ['Thí sinh xét tuyển đại học chính quy 2026'],
  capabilities: unsupportedCapabilities,
  knowledgeGaps: [remainingCatalogKnowledgeGap],
}));

export const remainingCatalogModules: Record<string, SchoolModule> = Object.fromEntries(
  remainingCatalogSchools.map((school) => [
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
      vnuhcm: false,
      summary: 'Đã đưa vào roster toàn quốc theo backlog; cần research nguồn tuyển sinh chính thức trước khi tính điều kiện hoặc điểm.',
      capabilities: catalogOnlyCapabilities,
    },
  ])
);

function evaluateCatalogOnlySchool(school: RemainingCatalogSchool): AdmissionEvaluation {
  return {
    schoolId: school.id,
    year: 2026,
    methodId: `${school.id}-catalog-2026`,
    confidence: 'unavailable',
    eligibility: {
      status: 'unknown',
      reasons: [`${school.shortName} đã có trong roster toàn quốc, nhưng UniscoreVN chưa có nguồn chính thức đủ để kiểm tra điều kiện hoặc tính điểm.`],
    },
    missingInputs: [],
    missingRules: [remainingCatalogKnowledgeGap.label],
    missingRequirements: [{ kind: 'unsupported', code: remainingCatalogKnowledgeGap.id, label: remainingCatalogKnowledgeGap.label }],
    explanation: [],
    evidence: [],
  };
}

export const remainingCatalogComparisonAdapters: readonly SchoolComparisonAdapter[] = remainingCatalogSchools.map((school) => ({
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
