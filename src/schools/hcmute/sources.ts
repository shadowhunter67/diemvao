import type { SourceLifecycle } from '../../core/freshness';
import type { SourceType } from '../../core/admissionHistory';
import type { VerificationLevel } from '../../core/trust';

export interface HcmuteSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  accessedAt: string;
  publishedAt?: string;
  sourceType?: SourceType;
  verification: VerificationLevel;
  lifecycle?: SourceLifecycle;
}

/**
 * Nguồn đã xác minh cho HCMUTE 2026 — batch research 2026-08-18. Văn bản chính thức "THÔNG TIN
 * TUYỂN SINH ĐẠI HỌC CHÍNH QUY NĂM 2026" số 1691/ĐHCNKT-ĐT, ký ngày 01/06/2026 bởi Hiệu trưởng
 * PGS.TS. Lê Hiếu Giang (có dấu mộc), lưu trên subdomain chính thức `ffl.hcmute.edu.vn` (mirror
 * của khoa, cùng domain `hcmute.edu.vn`, văn bản dẫn địa chỉ công khai chính thức
 * `tuyensinh.hcmute.edu.vn`) — chứa đầy đủ công thức, bảng điểm ưu tiên/điểm cộng, và Phụ lục 4
 * "Các ví dụ minh họa tính điểm xét tuyển" với số liệu tính tay khớp chính xác công thức công bố
 * (Tier A worked example).
 */
export const hcmuteSources: HcmuteSource[] = [
  {
    id: 'hcmute-correlation-coefficients-2026',
    publisher: 'Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh',
    title:
      'Thông báo hệ số tương quan a, b của Phương thức tuyển sinh kết hợp năm 2026, số 2092/TB-ĐHCNKT ngày 07/7/2026 — công bố a=0,8 (Điểm TN THPT/Học bạ), b=0,8 (Điểm TN THPT/ĐGNL), căn cứ Biên bản họp số 58/BB-HĐTSĐHCQ ngày 03/7/2026, kèm 3 bảng công thức HLy.1/HLy.2/HLy.3 theo nhóm ngành (chuẩn / Ngôn ngữ Anh+SP tiếng Anh / Kiến trúc-Kiến trúc Nội thất-Thiết kế đồ họa-Thiết kế thời trang)',
    url: 'https://tuyensinh.hcmute.edu.vn/#/dh-chinh-quy/thong-tin-tuyen-sinh-dh-chinh-quy/Thong-bao-he-so-tuong-quan-ab-cua-Phuong-thuc-tuyen-sinh-ket-hop-nam-2026-1783409425934',
    accessedAt: '2026-08-18',
    publishedAt: '2026-07-07',
    sourceType: 'official-school',
    verification: 'verified',
    lifecycle: { effectiveYear: 2026, publishedAt: '2026-07-07', status: 'current' },
  },
  {
    id: 'hcmute-admission-info-2026',
    publisher: 'Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh',
    title:
      'Thông tin tuyển sinh đại học chính quy năm 2026, số 1691/ĐHCNKT-ĐT — phương thức tuyển sinh kết hợp (mã 500), công thức điểm học lực (Bảng 4/5/6), điểm cộng (Bảng 2/3), ngưỡng đầu vào theo ngành',
    url: 'https://ffl.hcmute.edu.vn/sites/default/files/2026-06/THONG%20TIN%20TUYEN%20SINH%20DAI%20HOC%20CHINH%20QUY%202026_FN_T%20-%20Signed%20(up).pdf',
    accessedAt: '2026-08-18',
    publishedAt: '2026-06-01',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmute-priority-appendix-2026',
    publisher: 'Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh',
    title:
      'Phụ lục 1 (Khu vực và mức điểm ưu tiên) và Phụ lục 2 (Đối tượng chính sách và mức điểm ưu tiên) đính kèm văn bản 1691/ĐHCNKT-ĐT — KV1=0,75/KV2-NT=0,50/KV2=0,25/KV3=0; nhóm ƯT1=2,00 (đối tượng 01-03), nhóm ƯT2=1,00 (đối tượng 04-06), thang điểm 30',
    url: 'https://ffl.hcmute.edu.vn/sites/default/files/2026-06/THONG%20TIN%20TUYEN%20SINH%20DAI%20HOC%20CHINH%20QUY%202026_FN_T%20-%20Signed%20(up).pdf',
    accessedAt: '2026-08-18',
    publishedAt: '2026-06-01',
    sourceType: 'official-school',
    verification: 'verified',
  },
  {
    id: 'hcmute-worked-example-2026',
    publisher: 'Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh',
    title:
      'Phụ lục 4 (Các ví dụ minh họa tính điểm xét tuyển) đính kèm văn bản 1691/ĐHCNKT-ĐT — 3 ví dụ tính tay đầy đủ (thí sinh Nguyễn Văn A/B), dùng làm golden/conformance anchor cho công thức HLy.1/điểm cộng/điểm ưu tiên',
    url: 'https://ffl.hcmute.edu.vn/sites/default/files/2026-06/THONG%20TIN%20TUYEN%20SINH%20DAI%20HOC%20CHINH%20QUY%202026_FN_T%20-%20Signed%20(up).pdf',
    accessedAt: '2026-08-18',
    publishedAt: '2026-06-01',
    sourceType: 'official-school',
    verification: 'verified',
  },
];
