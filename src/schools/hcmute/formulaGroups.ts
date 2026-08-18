/**
 * Nhóm công thức Điểm học lực (HLy) của Phương thức tuyển sinh kết hợp — Thông báo số
 * 2092/TB-ĐHCNKT ngày 07/7/2026 (`sources.ts:hcmute-correlation-coefficients-2026`) chia RÕ 3 nhóm
 * ngành, mỗi nhóm có công thức HLy.1/HLy.2/HLy.3 khác nhau về số môn, hệ số môn chính, và ước số
 * ĐGNL. Dùng stable enum thay vì parse tên ngành — caller (UI/comparison) phải tự gán đúng nhóm
 * theo program metadata, KHÔNG suy từ chuỗi tên ngành ở đây.
 */
export type HcmuteFormulaGroup = 'standard' | 'english' | 'design-architecture';

export const HCMUTE_FORMULA_GROUP_LABELS: Record<HcmuteFormulaGroup, string> = {
  standard: 'Nhóm ngành chuẩn (không thuộc 2 nhóm bên dưới)',
  english: 'Ngôn ngữ Anh và Sư phạm tiếng Anh',
  'design-architecture': 'Kiến trúc, Kiến trúc Nội thất, Thiết kế đồ họa, Thiết kế thời trang',
};

/** Danh sách ngành thuộc nhóm 'design-architecture' theo Thông báo 2092/TB-ĐHCNKT mục 3 — dùng để
 * caller tự map, KHÔNG phải danh sách business rule độc lập (không có ngành nào khác dùng list này). */
export const HCMUTE_DESIGN_ARCHITECTURE_PROGRAM_NAMES = [
  'Kiến trúc',
  'Kiến trúc Nội thất',
  'Thiết kế đồ họa',
  'Thiết kế thời trang',
] as const;

export const HCMUTE_ENGLISH_PROGRAM_NAMES = ['Ngôn ngữ Anh', 'Sư phạm tiếng Anh'] as const;

/**
 * Stable programId → formula group. Thông báo 2092/TB-ĐHCNKT mục 1/2/3 định nghĩa nhóm 'standard'
 * là PHẦN BÙ (complement) của đúng 6 ngành liệt kê dưới đây ("...cho các ngành KHÔNG PHẢI ngành
 * Kiến trúc, Kiến trúc Nội thất, Thiết kế đồ họa, Thiết kế thời trang, Ngôn ngữ Anh và Sư phạm
 * Anh") — nên default 'standard' khi KHÔNG truyền `programId` là đúng theo văn bản, không phải
 * suy đoán. Chỉ khi truyền `programId` khác rỗng nhưng KHÔNG khớp map này (không thuộc 6 ngành
 * đặc biệt lẫn danh sách 'standard' đã biết) mới trả `undefined` để caller coi là chưa nhận diện
 * được — KHÔNG âm thầm coi là 'standard'. Danh sách ID dùng slug ổn định, KHÔNG dùng display name.
 */
export const HCMUTE_PROGRAM_FORMULA_GROUP: Record<string, HcmuteFormulaGroup> = {
  'kien-truc': 'design-architecture',
  'kien-truc-noi-that': 'design-architecture',
  'thiet-ke-do-hoa': 'design-architecture',
  'thiet-ke-thoi-trang': 'design-architecture',
  'ngon-ngu-anh': 'english',
  'su-pham-tieng-anh': 'english',
  // Luật và SP công nghệ dùng công thức nhóm 'standard' nhưng có NGƯỠNG ĐẦU VÀO riêng — đăng ký
  // tường minh ở đây (không phải suy đoán) để `resolveHcmuteFormulaGroup` không trả 'unrecognized'
  // khi evaluate.ts cần biết programId này để áp `eligibility.ts:HCMUTE_TEACHER_OR_LAW_PROGRAM_IDS`.
  luat: 'standard',
  'su-pham-cong-nghe': 'standard',
};

/**
 * Trả `HcmuteFormulaGroup` cho 1 `programId`. `undefined` (không truyền) => 'standard' (đúng theo
 * khung "phần bù" của văn bản). Chuỗi không rỗng nhưng không khớp `HCMUTE_PROGRAM_FORMULA_GROUP` =>
 * trả `'unrecognized'` — caller (`evaluate.ts`) PHẢI trả partial/unavailable rõ ràng, không tự ý
 * coi là 'standard' (ngành ngoài 6 ngành list được BIẾT là standard qua văn bản, nhưng ngành không
 * nằm trong catalog nội bộ của UniscoreVN thì chưa chắc — HCMUTE chưa có program catalog đầy đủ).
 */
export function resolveHcmuteFormulaGroup(programId: string | undefined): HcmuteFormulaGroup | 'unrecognized' {
  if (programId === undefined) return 'standard';
  return HCMUTE_PROGRAM_FORMULA_GROUP[programId] ?? 'unrecognized';
}
