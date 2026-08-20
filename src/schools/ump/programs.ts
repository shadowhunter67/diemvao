/** Mã tổ hợp — dùng thẳng string literal khớp `core/subjects.ts:COMMON_SUBJECT_COMBINATIONS`
 * (B08/D07 đã thêm khi implement UMP 2026, xem `core/subjects.ts` comment). */
export type UmpCombinationId = 'A00' | 'B00' | 'B08' | 'D01' | 'D07';

/** Stable ID = mã xét tuyển chính thức (mã ngành) từ Thông báo 2415/TB-ĐHYD mục 4 — KHÔNG dispatch
 * theo tên hiển thị (xem docs/data-maintainer-guide.md mục "Nhập bảng lớn"). */
export interface UmpProgram {
  id: string;
  code: string;
  name: string;
  /** Tổ hợp xét tuyển áp dụng cho ngành này — nguồn: Thông báo 2415/TB-ĐHYD mục 4. */
  combinations: readonly UmpCombinationId[];
  /** Ngưỡng đảm bảo chất lượng đầu vào (thang 30, không tính điểm cộng) — nguồn: Thông báo
   * 2983/TB-ĐHYD (08/7/2026) mục 1, ÁP DỤNG CHUNG cho mọi tổ hợp của ngành (không phân biệt tổ hợp). */
  threshold30: number;
  /** Chỉ tuyển 1 giới tính — hiện tại chỉ Hộ sinh (Thông báo 2415/TB-ĐHYD mục 5.4: "Ngành Hộ sinh:
   * Chỉ tuyển Nữ."). */
  femaleOnly?: boolean;
}

/**
 * 18 ngành/chương trình đào tạo UMP 2026 (KHÔNG gồm mã 772030103 "Điều dưỡng chuyên ngành Gây mê
 * hồi sức" trùng mã ngành gốc 7720301 "Điều dưỡng" trong bảng nguồn — hai dòng khác NHAU về
 * `id`/chỉ tiêu/điểm chuẩn thật dù cùng `code` ngành, nên giữ như 2 program riêng biệt theo đúng
 * cách nguồn trình bày). Nguồn: Thông báo 2415/TB-ĐHYD mục 4 (tổ hợp) + Thông báo 2983/TB-ĐHYD mục 1
 * (ngưỡng). Verified 2026-08-20 — xem `evidence.ts:umpThresholdEvidence`.
 */
export const umpPrograms: readonly UmpProgram[] = [
  { id: '7310401', code: '7310401', name: 'Tâm lý học', combinations: ['A00', 'B00', 'D01'], threshold30: 17.0 },
  { id: '7720101', code: '7720101', name: 'Y khoa', combinations: ['B00'], threshold30: 23.0 },
  { id: '7720110', code: '7720110', name: 'Y học dự phòng', combinations: ['A00', 'B00', 'B08'], threshold30: 18.0 },
  { id: '7720115', code: '7720115', name: 'Y học cổ truyền', combinations: ['B00', 'B08', 'D07'], threshold30: 20.0 },
  { id: '7720201', code: '7720201', name: 'Dược học', combinations: ['A00', 'B00', 'D07'], threshold30: 20.0 },
  { id: '7720202', code: '7720202', name: 'Công nghệ dược phẩm', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0 },
  { id: '7720203', code: '7720203', name: 'Hóa dược', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0 },
  { id: '7720301', code: '7720301', name: 'Điều dưỡng', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0 },
  { id: '772030103', code: '7720301', name: 'Điều dưỡng chuyên ngành Gây mê hồi sức', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0 },
  { id: '7720302', code: '7720302', name: 'Hộ sinh', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0, femaleOnly: true },
  { id: '7720401', code: '7720401', name: 'Dinh dưỡng', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0 },
  { id: '7720501', code: '7720501', name: 'Răng - Hàm - Mặt', combinations: ['B00'], threshold30: 23.0 },
  { id: '7720502', code: '7720502', name: 'Kỹ thuật phục hình răng', combinations: ['A00', 'B00'], threshold30: 18.0 },
  { id: '7720601', code: '7720601', name: 'Kỹ thuật xét nghiệm y học', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0 },
  { id: '7720602', code: '7720602', name: 'Kỹ thuật hình ảnh y học', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0 },
  { id: '7720603', code: '7720603', name: 'Kỹ thuật phục hồi chức năng', combinations: ['A00', 'B00', 'D07'], threshold30: 18.0 },
  { id: '7720701', code: '7720701', name: 'Y tế công cộng', combinations: ['A00', 'B00', 'B08'], threshold30: 17.0 },
  { id: '7760101', code: '7760101', name: 'Công tác xã hội', combinations: ['A00', 'B00', 'D01'], threshold30: 17.0 },
];

export function findUmpProgram(programId: string | undefined): UmpProgram | undefined {
  return umpPrograms.find((program) => program.id === programId);
}
