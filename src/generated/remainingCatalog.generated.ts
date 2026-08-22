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
import type { RuleEvidence } from '../core/evidence';
import type { SchoolComparisonAdapter, SchoolComparisonResult } from '../compare/schoolComparisonAdapter';

interface RemainingCatalogSchool {
  id: string;
  shortName: string;
  name: string;
  location: string;
  ownership: SchoolModule['ownership'];
  region: SchoolModule['region'];
}

interface ResearchedAdmissionSource {
  title: string;
  url: string;
  sourceId: string;
  checkedAt: string;
  publishedAt?: string;
  note: string;
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

const researchedCatalogCapabilities = {
  admissionInfo: true,
  programs: true,
  eligibility: false,
  cutoffs: false,
  scoreConversion: false,
  exactCalculator: false,
} satisfies NonNullable<SchoolModule['capabilities']>;

const researchedAdmissionSources: Record<string, ResearchedAdmissionSource> = {
  vnuuet: {
    sourceId: 'vnuuet-admission-2026',
    title: 'VNU-UET admission portal and 2026 admission information',
    url: 'https://uet.vnu.edu.vn/tuyen-sinh',
    publishedAt: '2026-04-01',
    checkedAt: '2026-08-22',
    note: 'Official 2026 admission information lists direct/priority admission, THPT, HSA, and SAT; exact evaluator needs threshold/conversion normalization.',
  },
  vnueb: {
    sourceId: 'vnueb-admission-2026',
    title: 'VNU-UEB undergraduate admission portal 2026',
    url: 'https://tuyensinhdaihoc.ueb.edu.vn/',
    checkedAt: '2026-08-22',
    note: 'Official portal has 2026 undergraduate admission and intake flow; exact method/program tables need extraction before runtime eligibility.',
  },
  vnuhus: {
    sourceId: 'vnuhus-admission-2026',
    title: 'VNU-HUS undergraduate admission 2026',
    url: 'https://tuyensinh.hus.vnu.edu.vn/',
    checkedAt: '2026-08-22',
    note: 'Official 2026 page identifies 28 programs and 6 methods; thresholds/conversions require structured extraction.',
  },
  vnussh: {
    sourceId: 'vnussh-admission-2026',
    title: 'VNU-USSH undergraduate admission 2026',
    url: 'https://www.ussh.vnu.edu.vn/vi/news/dao-tao/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026-24126.html',
    publishedAt: '2026-05-31',
    checkedAt: '2026-08-22',
    note: 'Official 2026 admission article is available; method/program details need normalization before executable support.',
  },
  vnuvju: {
    sourceId: 'vnuvju-admission-2026',
    title: 'VJU undergraduate admission 2026',
    url: 'https://vju.vnu.edu.vn/ttts2026/',
    checkedAt: '2026-08-22',
    note: 'Official 2026 page lists programs, HSA/SAT/THPT/interview methods, language conditions, and certificate conversion; needs extraction to decide eligibility/partial scope.',
  },
  hust: {
    sourceId: 'hust-admission-2026',
    title: 'HUST undergraduate admission 2026',
    url: 'https://ts.hust.edu.vn/tin-tuc/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026',
    publishedAt: '2026-02-25',
    checkedAt: '2026-08-22',
    note: 'Official 2026 page lists 3 core methods and 68 programs; not upgraded beyond researched until TSA/THPT/XTTN formula and thresholds are normalized.',
  },
  tmu: {
    sourceId: 'tmu-admission-2026',
    title: 'TMU undergraduate admission 2026',
    url: 'https://tmu.edu.vn/tin-tuc/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026-27910',
    publishedAt: '2026-03-27',
    checkedAt: '2026-08-22',
    note: 'Official 2026 page lists 5800 seats, 51 programs, and 5 admission methods; scoring details need structured normalization.',
  },
  haui: {
    sourceId: 'haui-admission-2026',
    title: 'HaUI undergraduate admission information 2026',
    url: 'https://www.haui.edu.vn/vn/tin-tuc/thong-tin-tuyen-sinh-trinh-do-dai-hoc-nam-2026/67454',
    publishedAt: '2026-03-14',
    checkedAt: '2026-08-22',
    note: 'Official 2026 decision/page includes methods and conditions; threshold/conversion rules need extraction before eligibility or partial support.',
  },
  aof: {
    sourceId: 'aof-admission-2026',
    title: 'AOF admission portal 2026',
    url: 'https://xettuyen.hvtc.edu.vn/Home/Index',
    checkedAt: '2026-08-22',
    note: 'Official 2026 admission portal lists methods for Hanoi, HCMC, and Hung Yen; campus/program scope and formulas need normalization.',
  },
  bav: {
    sourceId: 'bav-admission-2026',
    title: 'Banking Academy undergraduate admission 2026',
    url: 'https://isba.hvnh.net/thong-tin-tuyen-sinh',
    checkedAt: '2026-08-22',
    note: 'Official 2026 page states four methods and formula skeleton score = input + bonus + priority; exact components still need extraction.',
  },
  hanu: {
    sourceId: 'hanu-admission-2026',
    title: 'HANU regular undergraduate admission 2026',
    url: 'https://hanu.edu.vn/a/254574/Thong-tin-tuyen-sinh-dai-hoc-nam-2026-Hinh-thuc-dao-tao-Chinh-quy',
    checkedAt: '2026-08-22',
    note: 'Official 2026 admission page is available; detailed program/method table requires extraction before executable support.',
  },
  hou: {
    sourceId: 'hou-admission-2026',
    title: 'HOU admission portal 2026',
    url: 'https://tuyensinh.hou.edu.vn/',
    checkedAt: '2026-08-22',
    note: 'Official portal lists 2026 admission information, quality thresholds, and first-round cutoffs; normalization required before eligibility/cutoff comparison.',
  },
  vnuulis: {
    sourceId: 'vnuulis-admission-2026',
    title: 'VNU-ULIS undergraduate admission 2026',
    url: 'https://ulis.vnu.edu.vn/tbtsdh26/',
    publishedAt: '2026-04-15',
    checkedAt: '2026-08-22',
    note: 'Official 2026 announcement identifies programs, quotas, THPT, certificate-combined, HSA, and direct admission methods; language coefficient and certificate appendix need structured extraction before calculator support.',
  },
  huce: {
    sourceId: 'huce-admission-2026',
    title: 'HUCE undergraduate admission information 2026',
    url: 'https://tuyensinh.huce.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy',
    checkedAt: '2026-08-22',
    note: 'Official 2026 admission portal lists main admission announcement, threshold, method conversion, bonus, and aptitude-test documents; executable support deferred until linked tables are normalized.',
  },
  humg: {
    sourceId: 'humg-admission-2026',
    title: 'HUMG admission information 2026',
    url: 'https://ts.humg.edu.vn/tuyen-sinh/Pages/Thong-tin-tuyen-sinh.aspx',
    checkedAt: '2026-08-22',
    note: 'Official 2026 portal lists admission information, thresholds, and first-round cutoffs; method conversion and program scope need extraction.',
  },
  vnua: {
    sourceId: 'vnua-admission-2026',
    title: 'VNUA undergraduate admission 2026',
    url: 'https://vnua.edu.vn/tuyen-sinh/tuyen-sinh-dai-hoc/p',
    checkedAt: '2026-08-22',
    note: 'Official 2026 admission page lists admission announcement, thresholds, conversion rules, and cutoffs; exact eligibility/calculator needs normalization of method-specific conditions and conversion rule.',
  },
  dav: {
    sourceId: 'dav-admission-2026',
    title: 'DAV undergraduate admission information 2026',
    url: 'https://www.dav.edu.vn/thong-tin-tuyen-sinh-dai-hoc-he-chinh-quy-nam-2026-cap-nhat-ngay-18-5-2026/',
    publishedAt: '2026-05-20',
    checkedAt: '2026-08-22',
    note: 'Official 2026 page identifies four methods and links threshold/conversion update; certificate-combined and international-test scopes need extraction before executable support.',
  },
  hlu: {
    sourceId: 'hlu-admission-2026',
    title: 'HLU admission portal and 2026 rules',
    url: 'https://tuyensinh.hlu.edu.vn/tsnews/details/30532',
    checkedAt: '2026-08-22',
    note: 'Official admission portal lists 2026 threshold, equivalent conversion, and cutoff notices; use researched-only until the 2026 regulation and conversion documents are extracted.',
  },
  hdu: {
    sourceId: 'hdu-admission-2026',
    title: 'HDU undergraduate admission information 2026',
    url: 'https://tuyensinh.hdu.edu.vn/thong-tin-tuyen-sinh-dao-tao-trinh-do-dai-hoc-nam-2026',
    publishedAt: '2026-01-17',
    checkedAt: '2026-08-22',
    note: 'Official 2026 page gives identity, scope, programs, and four methods; pedagogical residency restrictions and thresholds need structured extraction before eligibility support.',
  },
  vmu: {
    sourceId: 'vmu-admission-2026',
    title: 'VMU undergraduate admission 2026',
    url: 'https://tuyensinh.vimaru.edu.vn/tuyensinh/2026-thong-bao-tuyen-sinh-dai-hoc-he-chinh-quy-nam-2026.vmu',
    publishedAt: '2026-06-04',
    checkedAt: '2026-08-22',
    note: 'Official 2026 announcement lists 55 programs and six independent methods; threshold/conversion announcement and method scopes need extraction before runtime eligibility.',
  },
  ntu: {
    sourceId: 'ntu-admission-2026',
    title: 'NTU undergraduate admission 2026',
    url: 'https://tuyensinh.ntu.edu.vn/',
    checkedAt: '2026-08-22',
    note: 'Official 2026 admission portal lists methods including THPT on scale 40 and HSA/V-ACT scores; formulas, threshold mapping, and program scope need extraction.',
  },
  dlu: {
    sourceId: 'dlu-admission-2026',
    title: 'DLU admission portal 2026',
    url: 'https://tuyensinh.dlu.edu.vn/',
    checkedAt: '2026-08-22',
    note: 'Official 2026 portal lists admission information, threshold, equivalent conversion tool, and cutoffs; conversion table and formula details need normalization before executable support.',
  },
  qnu: {
    sourceId: 'qnu-admission-2026',
    title: 'QNU undergraduate admission 2026',
    url: 'https://www.qnu.edu.vn/vi/dai-hoc-chinh-quy-1764/tb263-thong-bao-tuyen-sinh-dai-hoc-nam-2026',
    checkedAt: '2026-08-22',
    note: 'Official 2026 announcement lists five methods, 4500 expected seats, programs, and notes conversion will be announced separately; threshold/conversion follow-ups need extraction.',
  },
  ttn: {
    sourceId: 'ttn-admission-2026',
    title: 'TTN undergraduate admission 2026',
    url: 'https://tuyensinh.ttn.edu.vn/2026/04/10/tttsdhcqnam2026/',
    publishedAt: '2026-04-10',
    checkedAt: '2026-08-22',
    note: 'Official 2026 admission page links the formal information file and later registration notice; executable support deferred until method thresholds and program scope are extracted.',
  },
  hueu: {
    sourceId: 'hueu-admission-2026',
    title: 'Hue University undergraduate admission methods 2026',
    url: 'https://tuyensinh.hueuni.edu.vn/News/Detail/cac-phuong-thuc-tuyen-sinh-dai-hoc-he-chinh-quy-cua-dai-hoc-hue-nam-2026_20260226073154',
    publishedAt: '2026-02-27',
    checkedAt: '2026-08-22',
    note: 'Official Hue University page lists five common 2026 admission methods; member-school and program-specific thresholds/scopes need extraction before executable support.',
  },
  hce: {
    sourceId: 'hce-admission-2026',
    title: 'HCE admission portal 2026',
    url: 'https://tuyensinh.hce.edu.vn/',
    checkedAt: '2026-08-22',
    note: 'Official 2026 portal lists schedule, admission news, and cutoff/import instructions; detailed method/program tables need extraction.',
  },
  hul: {
    sourceId: 'hul-admission-2026',
    title: 'Hue University of Law admission methods 2026',
    url: 'https://tuyensinh.hul.edu.vn/News/Detail/cac-phuong-thuc-tuyen-sinh-va-to-hop-xet-tuyen-vao-truong-dai-hoc-luat-dai-hoc-hue-nam-2026_20260227210356',
    publishedAt: '2026-02-27',
    checkedAt: '2026-08-22',
    note: 'Official 2026 page lists three methods and subject combinations, with later threshold and conversion notices on the same portal; normalize those before eligibility or partial support.',
  },
};

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

function getResearchedAdmissionSource(schoolId: string): ResearchedAdmissionSource | undefined {
  return researchedAdmissionSources[schoolId];
}

function capabilitiesFor(schoolId: string): NonNullable<SchoolModule['capabilities']> {
  return getResearchedAdmissionSource(schoolId) ? researchedCatalogCapabilities : catalogOnlyCapabilities;
}

function summaryFor(school: RemainingCatalogSchool): string {
  const source = getResearchedAdmissionSource(school.id);
  if (!source) {
    return 'Đã đưa vào roster toàn quốc theo backlog; cần research nguồn tuyển sinh chính thức trước khi tính điều kiện hoặc điểm.';
  }
  return `Da xac minh nguon tuyen sinh chinh thuc 2026 (${source.title}); chua nang len eligibility/calculator vi con thieu normalized formula, threshold, conversion hoac program-scope rules.`;
}

function catalogSourcesFor(schoolId: string): SchoolModule['catalogSources'] | undefined {
  const source = getResearchedAdmissionSource(schoolId);
  if (!source) return undefined;
  return [
    {
      title: source.title,
      url: source.url,
      type: 'official-institution',
      checkedAt: source.checkedAt,
    },
  ];
}

function evidenceFor(schoolId: string): RuleEvidence[] {
  const source = getResearchedAdmissionSource(schoolId);
  if (!source) return [];
  return [
    {
      sourceId: source.sourceId,
      sourceUrl: source.url,
      sourceTitle: source.title,
      sourceType: 'official-school',
      verification: 'official-source-available',
      effectiveYear: 2026,
      publishedAt: source.publishedAt,
      criticality: 'informational',
      verifiedAt: source.checkedAt,
      lastReviewedAt: source.checkedAt,
      note: source.note,
    },
  ];
}

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
      summary: summaryFor(school),
      capabilities: capabilitiesFor(school.id),
      catalogSources: catalogSourcesFor(school.id),
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
    evidence: evidenceFor(school.id),
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
