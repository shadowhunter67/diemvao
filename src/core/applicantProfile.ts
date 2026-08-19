import type { SubjectId } from './subjects';
import type { VactProfile } from './vactProfile';

/**
 * Dữ liệu FACTUAL của một thí sinh — nhập 1 lần, nhiều school adapter (`schools/<id>/
 * applicantProfileAdapter.ts`) đọc và map sang input riêng của trường/phương thức đó. KHÔNG
 * phải universal formula input — school vẫn tự quyết map field nào dùng, bỏ field nào. Chỉ
 * field đã có consumer thật (xem `schools/hcmut/applicantProfileAdapter.ts`) mới coi là "đã
 * dùng"; field còn lại (certificates ngoài ielts, achievements...) để sẵn cho adapter sau, chưa
 * bắt buộc implement ngay.
 */
export interface ApplicantProfile {
  graduationYear?: number;

  thpt?: {
    scores: Partial<Record<SubjectId, number>>;
  };

  transcript?: {
    grade10?: Partial<Record<SubjectId, number>>;
    grade11?: Partial<Record<SubjectId, number>>;
    grade12?: Partial<Record<SubjectId, number>>;
  };

  exams?: {
    /** ĐGNL ĐHQG-HCM — 4 phần thi, không map theo SubjectId vì không phải môn học phổ thông. Xem
     * `core/vactProfile.ts` cho invariant/reconciliation policy giữa `total` và `components`
     * (batch 5) — KHÔNG tự gán 2 field này rời rạc ở nơi khác, luôn qua
     * `reconcileVactFromComponents`/`reconcileVactFromTotal`. */
    vact?: VactProfile;
  };

  certificates?: {
    ielts?: number;
    toeflIbt?: number;
    toeic?: number;
    sat?: number;
    act?: number;
    ib?: number;
  };

  /** Chỉ lưu category/region dạng mã (vd 'KV1', 'UT1') — KHÔNG lưu lý do/hoàn cảnh cá nhân. */
  priority?: {
    region?: string;
    category?: string;
  };

  /** ID tổ hợp môn ưu tiên (vd 'A01', theo `COMMON_SUBJECT_COMBINATIONS`) — CHỈ để gợi ý nhanh
   * ở hồ sơ dùng chung, KHÔNG phải input trực tiếp cho bất kỳ school adapter nào (mỗi trường tự
   * có danh mục tổ hợp và ngữ cảnh riêng, chọn ở trang trường/Compare — xem
   * `schools/hcmut/applicantProfileAdapter.ts` comment ở đầu file). Không có consumer runtime nào
   * đọc field này để tính điểm; đổi giá trị này KHÔNG tự đổi kết quả tính ở bất kỳ trường nào. */
  preferredCombinationId?: string;
}
