/**
 * Điểm cộng UIT 2026 — nguồn: thông báo đăng ký minh chứng xét điểm cộng (xem sources.ts,
 * id 'uit-bonus-2026'). Mỗi nhóm có mức trần CỐ ĐỊNH — trong nhóm không có thang trượt theo
 * hạng giải/mức chứng chỉ (đạt điều kiện là nhận trọn mức trần của nhóm đó), nên đây là bảng
 * đủ chính xác để tính điểm cộng thật, không phải suy đoán.
 */
export type UitBonusCategoryId =
  | 'academic-competition'
  | 'olp-voai'
  | 'language-certificate'
  | 'priority-school';

export interface UitBonusCategory {
  id: UitBonusCategoryId;
  maxPoints: number;
  label: string;
  description: string;
}

export const UIT_BONUS_CATEGORIES: UitBonusCategory[] = [
  {
    id: 'academic-competition',
    maxPoints: 10,
    label: 'Huy chương Olympic quốc tế / HSG quốc gia / HSG cấp Tỉnh-Thành',
    description:
      'Huy chương Vàng/Bạc/Đồng Olympic quốc tế; giải Nhất/Nhì/Ba/Khuyến khích kỳ thi chọn HSG quốc gia; giải Nhất/Nhì/Ba kỳ thi HSG cấp Tỉnh/Thành (trong thời gian học THPT), đúng môn theo ngành đăng ký.',
  },
  {
    id: 'olp-voai',
    maxPoints: 5,
    label: 'OLP Tin học sinh viên / VOAI',
    description:
      'Giải Đặc biệt/Nhất/Nhì/Ba kỳ thi OLP (Khối Siêu Cúp/Khối Chuyên Tin) 2024-2026, hoặc VOAI 2025-2026, hoặc thành viên đội tuyển Olympic Trí tuệ Nhân tạo dự thi quốc tế 2026.',
  },
  {
    id: 'language-certificate',
    maxPoints: 5,
    label: 'Chứng chỉ ngoại ngữ quốc tế',
    description: 'IELTS ≥5.0, hoặc TOEFL iBT ≥50, hoặc TOEIC (Nghe-Đọc ≥650 và Nói-Viết ≥250), hoặc JLPT ≥N3.',
  },
  {
    id: 'priority-school',
    maxPoints: 5,
    label: 'Học sinh trường THPT ưu tiên ĐHQG-HCM',
    description:
      'Học tối thiểu 2 năm tại 1 trong 149 trường THPT thuộc danh sách ưu tiên ĐHQG-HCM, học lực Tốt + hạnh kiểm Tốt cả 3 năm, điểm TB tổ hợp xét tuyển cao nhất của ngành đăng ký ≥8.0.',
  },
];

export const UIT_BONUS_OVERALL_CAP = 10;

/** Môn thi HSG/Olympic hợp lệ theo ngành — dùng cho nhóm 'academic-competition'. */
const BASE_SUBJECTS = ['Tin học', 'Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh'];
const NO_VAN_PROGRAMS = ['ky-thuat-may-tinh', 'thiet-ke-vi-mach', 'thiet-ke-vi-mach-ta'];
const NO_HOA_PROGRAMS = ['truyen-thong-da-phuong-tien'];
const SINH_HOC_PROGRAMS = ['khoa-hoc-du-lieu', 'mang-may-tinh-va-truyen-thong-du-lieu', 'he-thong-thong-tin', 'he-thong-thong-tin-tt'];
const SU_DIA_PROGRAMS = ['truyen-thong-da-phuong-tien'];
const TIENG_NHAT_PROGRAMS = ['cong-nghe-thong-tin-viet-nhat'];

/** Chỉ áp dụng đúng theo ngành có tên khớp nguyên văn trong bảng gốc — không suy rộng sang chương trình tiếng Anh tương ứng nếu nguồn không nêu rõ. */
export function getAcademicCompetitionSubjects(programId: string): string[] {
  let subjects = BASE_SUBJECTS.filter((subject) => {
    if (subject === 'Ngữ văn' && NO_VAN_PROGRAMS.includes(programId)) return false;
    if (subject === 'Hóa học' && NO_HOA_PROGRAMS.includes(programId)) return false;
    return true;
  });
  if (SINH_HOC_PROGRAMS.includes(programId)) subjects = [...subjects, 'Sinh học'];
  if (SU_DIA_PROGRAMS.includes(programId)) subjects = [...subjects, 'Lịch sử', 'Địa lý'];
  if (TIENG_NHAT_PROGRAMS.includes(programId)) subjects = [...subjects, 'Tiếng Nhật'];
  return subjects;
}
