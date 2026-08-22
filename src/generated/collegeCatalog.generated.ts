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

interface CollegeCatalogSchool {
  id: string;
  shortName: string;
  name: string;
  location: string;
  province?: string;
  admissionCode?: string;
  ownership: SchoolModule['ownership'];
  region: SchoolModule['region'];
  entityLevel: 'college_pedagogy' | 'vocational_college';
  aliases?: readonly string[];
  catalogSources?: SchoolModule['catalogSources'];
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
  {
    id: 'danang-gdnn-list-2025',
    title: 'Danh sách cơ sở giáo dục nghề nghiệp đến 08/4/2025 - Sở GD&ĐT TP Đà Nẵng',
    url: 'https://www.danang.edu.vn/thong-bao/danh-sach-co-so-giao-duc-nghe-nghiep-den-0842025/ctmb/5/506',
    type: 'official',
  },
  {
    id: 'hcmc-gdnn-directory',
    title: 'Hệ thống quản lý thông tin giáo dục nghề nghiệp TP.HCM',
    url: 'https://gdnn.tphcm.gov.vn/',
    type: 'official',
  },
] as const;

const MOET_PUBLIC_UNIT_SOURCE: NonNullable<CollegeCatalogSchool['catalogSources']>[number] = {
  title: 'Quyết định 1723/QĐ-TTg ban hành danh sách đơn vị sự nghiệp công lập trực thuộc Bộ GD&ĐT',
  url: 'https://chinhphu.vn/?classid=2&docid=214915&pageid=27160',
  type: 'official-document',
  authority: 'Chính phủ',
  checkedAt: '2026-08-22',
};

const DANANG_GDNN_SOURCE: NonNullable<CollegeCatalogSchool['catalogSources']>[number] = {
  title: 'Danh sách cơ sở giáo dục nghề nghiệp đến 08/4/2025',
  url: 'https://www.danang.edu.vn/thong-bao/danh-sach-co-so-giao-duc-nghe-nghiep-den-0842025/ctmb/5/506',
  type: 'official-local-authority',
  authority: 'Sở GD&ĐT TP Đà Nẵng',
  checkedAt: '2026-08-22',
};

const HCMC_GDNN_SOURCE: NonNullable<CollegeCatalogSchool['catalogSources']>[number] = {
  title: 'Hệ thống quản lý thông tin giáo dục nghề nghiệp TP.HCM',
  url: 'https://gdnn.tphcm.gov.vn/',
  type: 'official-local-authority',
  authority: 'Sở GD&ĐT TP.HCM',
  checkedAt: '2026-08-22',
};

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
  {
    id: 'danangcollege',
    shortName: 'DNC',
    name: 'Trường Cao đẳng Đà Nẵng',
    location: 'Đà Nẵng',
    province: 'Đà Nẵng',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
    aliases: ['Danang College', 'DANAVTC', 'Trường Cao đẳng nghề Đà Nẵng'],
    catalogSources: [
      DANANG_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Đà Nẵng - Cổng thông tin điện tử TP Đà Nẵng',
        url: 'https://danang.gov.vn/vi/w/truong-cao-dang-nghe-da-nang-i',
        type: 'official-local-authority',
        authority: 'UBND TP Đà Nẵng',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Đà Nẵng',
        url: 'https://dnc.edu.vn/',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'dvtc',
    shortName: 'DVTC',
    name: 'Trường Cao đẳng Du lịch Đà Nẵng',
    location: 'Đà Nẵng',
    province: 'Đà Nẵng',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
    aliases: ['Danang Vocational Tourism College', 'Cao đẳng nghề Du lịch Đà Nẵng'],
    catalogSources: [
      DANANG_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Du lịch Đà Nẵng',
        url: 'https://bvhttdl.gov.vn/truong-cao-dang-nghe-du-lich-da-nang-9906.htm',
        type: 'official-ministry',
        authority: 'Bộ Văn hóa, Thể thao và Du lịch',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'cdtm',
    shortName: 'COC',
    name: 'Trường Cao đẳng Thương mại',
    location: 'Đà Nẵng',
    province: 'Đà Nẵng',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
    aliases: ['College of Commerce', 'CĐ Thương mại'],
    catalogSources: [
      DANANG_GDNN_SOURCE,
      {
        title: 'Giới thiệu chung - Trường Cao đẳng Thương mại',
        url: 'https://cdtm.edu.vn/gioi-thieu/gioi-thieu-chung',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Thương mại Đà Nẵng',
        url: 'https://moit.gov.vn/don-vi-su-nghiep/khoi-truong/truong-cao-dang-thuong-mai',
        type: 'official-ministry',
        authority: 'Bộ Công Thương',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'cfi',
    shortName: 'CFI',
    name: 'Trường Cao đẳng Lương thực - Thực phẩm',
    location: 'Đà Nẵng',
    province: 'Đà Nẵng',
    ownership: 'public',
    region: 'other',
    entityLevel: 'vocational_college',
    aliases: ['College of Food Industry', 'CĐ Lương thực - Thực phẩm'],
    catalogSources: [
      DANANG_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Lương thực - Thực phẩm',
        url: 'https://www.cfi.edu.vn/',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'tdc',
    shortName: 'TDC',
    name: 'Trường Cao đẳng Công nghệ Thủ Đức',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Thu Duc College of Technology'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Công nghệ Thủ Đức',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-cong-nghe-thu-duc',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'hotec',
    shortName: 'HOTEC',
    name: 'Trường Cao đẳng Kinh tế - Kỹ thuật Thành phố Hồ Chí Minh',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Trường Cao đẳng Kinh tế Kỹ thuật TP.HCM'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Kinh tế Kỹ thuật TP.HCM',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-kinh-te-ky-thuat-tphcm',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Kinh tế Kỹ thuật Thành phố Hồ Chí Minh',
        url: 'https://ktkthcm.edu.vn/',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'hce-college',
    shortName: 'HCE-CĐ',
    name: 'Trường Cao đẳng Kinh tế Thành phố Hồ Chí Minh',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['HCE', 'Cao đẳng Kinh tế TP.HCM'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Kinh tế Thành phố Hồ Chí Minh',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-kinh-te-thanh-pho-ho-chi-minh',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Kinh tế Thành phố Hồ Chí Minh',
        url: 'https://tuyensinh-kthcm.edu.vn/',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'sgpoly',
    shortName: 'NSPC',
    name: 'Trường Cao đẳng Bách khoa Nam Sài Gòn',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Nam Sai Gon Polytechnic College', 'Cao đẳng Bách khoa Nam Sài Gòn'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Bách khoa Nam Sài Gòn',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-bach-khoa-nam-sai-gon',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'ttc-hcm',
    shortName: 'TTC',
    name: 'Trường Cao đẳng Thủ Thiêm Thành phố Hồ Chí Minh',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Trường Cao đẳng Thủ Thiêm TP.HCM'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Thủ Thiêm TP.HCM',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-thu-thiem-tphcm',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'hcmct',
    shortName: 'HCMCT',
    name: 'Trường Cao đẳng Giao thông Vận tải TP.HCM',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Trường Cao đẳng Giao thông vận tải', 'The Transportation College'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Giao thông Vận tải TP. HCM',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-giao-thong-van-tai-tp-hcm',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Giao thông Vận tải TP.HCM',
        url: 'https://www.hcmct.edu.vn',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'ktxd-hcm',
    shortName: 'KTXD-HCM',
    name: 'Trường Cao đẳng Kiến trúc - Xây dựng Thành phố Hồ Chí Minh',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Trường Cao đẳng Kiến trúc - Xây dựng TP.HCM'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Kiến trúc - Xây dựng Thành phố Hồ Chí Minh',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-kien-truc-xay-dung-thanh-pho-ho-chi-minh',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Kiến trúc - Xây dựng Thành phố Hồ Chí Minh',
        url: 'https://www.ktxd.edu.vn',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'lttc',
    shortName: 'LTTC',
    name: 'Trường Cao đẳng Lý Tự Trọng TP.HCM',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Trường Cao đẳng Lý Tự Trọng Thành phố Hồ Chí Minh', 'LY TU TRONG COLLEGE OF HO CHI MINH CITY'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Lý Tự Trọng TP.HCM',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-ly-tu-trong-tphcm',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Lý Tự Trọng TP.HCM',
        url: 'https://www.lttc.edu.vn',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'hepc',
    shortName: 'HEPC',
    name: 'Trường Cao đẳng Điện lực TP.HCM',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Trường Cao đẳng Điện lực Thành phố Hồ Chí Minh'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Điện lực TP.HCM',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-dien-luc-tphcm',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Điện lực TP.HCM',
        url: 'http://www.hepc.edu.vn',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'vhnthcm',
    shortName: 'VHNT-HCM',
    name: 'Trường Cao đẳng Văn hóa Nghệ thuật TP.HCM',
    admissionCode: 'CDD0215',
    location: 'TP.HCM',
    province: 'TP.HCM',
    ownership: 'public',
    region: 'hcm',
    entityLevel: 'vocational_college',
    aliases: ['Trường Cao đẳng Văn hóa Nghệ thuật Thành phố Hồ Chí Minh'],
    catalogSources: [
      HCMC_GDNN_SOURCE,
      {
        title: 'Trường Cao đẳng Văn hóa nghệ thuật TP.HCM',
        url: 'https://gdnn.tphcm.gov.vn/truong-cao-dang-van-hoa-nghe-thuat-tphcm',
        type: 'official-local-authority',
        authority: 'Sở GD&ĐT TP.HCM',
        checkedAt: '2026-08-22',
      },
      {
        title: 'Trường Cao đẳng Văn hóa Nghệ thuật TP.HCM',
        url: 'http://www.vhnthcm.edu.vn',
        type: 'official-institution',
        checkedAt: '2026-08-22',
      },
    ],
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
      admissionCode: school.admissionCode,
      about: `${school.name} (${school.location}).`,
      year: 2026,
      status: 'formula-incomplete',
      ownership: school.ownership,
      region: school.region,
      province: school.province ?? school.location,
      entityLevel: school.entityLevel,
      educationLevels: ['college'],
      aliases: school.aliases,
      catalogSources:
        school.catalogSources ??
        (school.entityLevel === 'college_pedagogy' || ['vcte', 'dungquatcollege', 'hvct', 'cic1', 'hcmcc', 'ncc', 'cuwc', 'vietxo1', 'lilama2', 'cmc-college', 'ccst', 'hctb'].includes(school.id)
          ? [MOET_PUBLIC_UNIT_SOURCE]
          : undefined),
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
