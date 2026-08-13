/**
 * Danh mục môn học dùng chung — chỉ các môn thật sự xuất hiện trong tổ hợp xét tuyển ĐH VN phổ
 * biến + các môn đã cần tới trong research hiện có (HCMUT/UIT/UEL/UEH). KHÔNG map field cũ của
 * form HCMUT (`math`/`subject2`/`subject3`) sang taxonomy này trong batch này — UI giữ nguyên,
 * chỉ adapter (khi cần) mới quy đổi qua lại, tránh refactor UI lớn không cần thiết.
 */
export type SubjectId =
  | 'math'
  | 'literature'
  | 'english'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'history'
  | 'geography'
  | 'informatics'
  | 'technology'
  | 'civic-economic-law'
  | 'other';

export interface SubjectCombination {
  id: string;
  subjects: readonly SubjectId[];
}

/**
 * Chỉ vài tổ hợp phổ biến nhất, đủ phục vụ adapter/test hiện tại — KHÔNG cố phủ toàn bộ danh
 * sách tổ hợp Bộ GD&ĐT (A00-D90...) vì chưa có consumer thật cần tới phần còn lại.
 */
export const COMMON_SUBJECT_COMBINATIONS: readonly SubjectCombination[] = [
  { id: 'A00', subjects: ['math', 'physics', 'chemistry'] },
  { id: 'A01', subjects: ['math', 'physics', 'english'] },
  { id: 'B00', subjects: ['math', 'chemistry', 'biology'] },
  { id: 'D01', subjects: ['math', 'literature', 'english'] },
];
