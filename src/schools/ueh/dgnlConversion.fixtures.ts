import type { OfficialExampleFixture } from '../../core/officialFixture';

/**
 * Ví dụ minh họa lấy trực tiếp từ docs/admission-research-2026.md dòng "ĐGNL quy đổi bằng nội
 * suy tuyến tính (ví dụ: 950 điểm ĐGNL → 25.55/30)" — nguồn `ueh-conversion-table-2026`. Đã
 * verify khớp `convertDgnlToThpt(950)` trước khi thêm fixture này (không bịa số).
 */
export const uehDgnlConversionFixtures: OfficialExampleFixture<number, number>[] = [
  {
    id: 'ueh-dgnl-950-to-2555',
    schoolId: 'ueh',
    year: 2026,
    description: 'Ví dụ minh họa chính thức: 950 điểm ĐGNL-HCM (thang 1200) quy đổi ra 25.55/30 điểm THPT tương đương.',
    evidence: [
      {
        sourceId: 'ueh-conversion-table-2026',
        sourceUrl:
          'https://tuyensinh.ueh.edu.vn/bai-viet/huong-dan-quy-doi-diem-giua-cac-ky-thi-trong-phuong-thuc-xet-tuyen-tich-hop-khoa-52-dai-hoc-chinh-quy-ueh-2026/',
        sourceTitle: 'Hướng dẫn quy đổi điểm giữa các kỳ thi trong Phương thức xét tuyển tích hợp Khóa 52 UEH 2026',
        location: 'docs/admission-research-2026.md (dòng ví dụ minh họa UEH)',
        verification: 'verified',
        effectiveYear: 2026,
        verifiedAt: '2026-08-11',
      },
    ],
    input: 950,
    expected: 25.55,
  },
];
