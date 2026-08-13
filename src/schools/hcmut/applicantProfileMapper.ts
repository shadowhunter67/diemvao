import type { ApplicantProfile } from '../../core/applicantProfile';
import type { SubjectId } from '../../core/subjects';
import { reconcileVactFromComponents } from '../../core/vactProfile';
import type { FieldValidationResult } from '../../core/rangeValidation';
import type { DgnlInput } from './types/admission';
import type { HcmutSubjectContext } from './types/subjectContext';

/**
 * Batch 7 — thay vì nhận số đã "làm tròn về 0 khi rỗng" (như `ThptInput`/`TranscriptInput` dùng
 * cho calculator, xem `core/rangeValidation.ts` — `value: 0` khi `isEmpty: true`), mapper cần biết
 * riêng field nào THẬT SỰ rỗng để không ghi `0` giả vào `ApplicantProfile` (missing ≠ 0). Chỉ cần
 * `value`/`isEmpty`, không cần `error` — dùng `Pick` để không ép caller phải tạo type mới, có thể
 * truyền thẳng `AdmissionFormErrors.thpt`/`.transcript` (đã đúng shape).
 */
type FactualNumberField = Pick<FieldValidationResult, 'value' | 'isEmpty'>;

interface HcmutThptFactualFields {
  math: FactualNumberField;
  subject2: FactualNumberField;
  subject3: FactualNumberField;
}

interface HcmutTranscriptFactualFields {
  grade10: HcmutThptFactualFields;
  grade11: HcmutThptFactualFields;
  grade12: HcmutThptFactualFields;
}

export interface HcmutFormFactualInput {
  /** Chỉ có khi chế độ ĐGNL = "Nhập chi tiết" (4 phần thi thật) — chế độ "Nhập tổng điểm" KHÔNG
   * có breakdown, không thể map an toàn (xem cảnh báo scale ở cuối file). `undefined` = user
   * không sửa nhóm field này trong lượt edit hiện tại (batch 5, workstream H/I) — mapper KHÔNG ghi
   * đè profile bằng giá trị form cũ hydrate từ localStorage nếu caller không truyền vào.
   *
   * Batch 7 — `thpt`/`transcript` giờ ĐỘC LẬP hoàn toàn (trước đây phải có CẢ HAI mới ghi được cái
   * nào, và field rỗng bị ghi thành `0` — 2 bug riêng, xem CLAUDE.md Batch 7 mục B): sửa THPT chỉ
   * ghi `next.thpt`, sửa học bạ chỉ ghi `next.transcript`, field rỗng bị loại khỏi map (không phải
   * `0`). */
  dgnl?: DgnlInput;
  thpt?: HcmutThptFactualFields;
  transcript?: HcmutTranscriptFactualFields;
  /**
   * Batch 6, workstream K — `SubjectId` nào trong `thpt` KHÔNG phải điểm thi thật (vd người dùng
   * bấm "Điền vào Môn 2" từ bảng quy đổi chứng chỉ tiếng Anh quốc tế thay vì tự gõ điểm thi thật).
   * Giá trị đó vẫn hợp lệ để HCMUT tự tính điểm (trường công nhận quy đổi này) nên KHÔNG đổi gì ở
   * `currentInput`/`evaluate()` — nhưng KHÔNG được ghi vào `ApplicantProfile.thpt.scores`, vì field
   * đó phải là "điểm thi THPT thật của thí sinh" dùng chung nhiều trường (`core/thptProfile.ts`),
   * không phải "điểm THPT tương đương do một trường quy đổi". Ghi nhầm sẽ khiến trường khác đọc
   * nhầm giá trị quy đổi của HCMUT như thể đó là điểm thi thật. Chỉ áp dụng cho `thpt` — quy đổi
   * chứng chỉ hiện không áp cho học bạ (`transcript` không bị lọc).
   */
  thptNonFactualSubjectIds?: SubjectId[];
}

/** Bỏ qua field `isEmpty` (chưa nhập) — KHÔNG ghi `0` giả, missing phải là absent khỏi map. */
function mapThptScores(
  thpt: HcmutThptFactualFields,
  subjectContext: HcmutSubjectContext
): Partial<Record<SubjectId, number>> {
  const scores: Partial<Record<SubjectId, number>> = {};
  if (!thpt.math.isEmpty) scores.math = thpt.math.value;
  if (subjectContext.subject2 && !thpt.subject2.isEmpty) scores[subjectContext.subject2] = thpt.subject2.value;
  if (subjectContext.subject3 && !thpt.subject3.isEmpty) scores[subjectContext.subject3] = thpt.subject3.value;
  return scores;
}

/**
 * Đọc factual data từ form HCMUT (điểm gốc, không phải kết quả đã tính) và build/CẬP NHẬT một
 * `ApplicantProfile`. Nguyên tắc bắt buộc (batch 4, workstream F+M):
 *
 * - CHỈ ghi factual raw scores — KHÔNG BAO GIỜ ghi normalizedScore/weightedScore/academic.score/
 *   finalScore hay bất kỳ giá trị đã qua công thức HCMUT nào vào profile.
 * - `exams.vact.components` (4 phần thi thô, thang 300/phần) chỉ ghi khi đang ở chế độ "Nhập chi
 *   tiết" — chế độ "Nhập tổng điểm" (weightedRaw thang 1500, đã nhân hệ số Toán×2) KHÔNG được ghi
 *   vào `exams.vact.total`: đó là một con số HCMUT tự tính (weighted), KHÔNG phải điểm ĐGNL thô
 *   mà UEH/các trường khác hiểu khi nói "V-ACT total" (thang ~450-1200, chưa nhân hệ số). Ghi
 *   nhầm sẽ là scale confusion — đúng rủi ro mà batch 4 yêu cầu tránh tuyệt đối.
 * - `thpt.scores`/`transcript.*` chỉ gán vào đúng `SubjectId` đã được người dùng xác nhận qua
 *   `HcmutSubjectContext` — môn nào chưa xác định identity thì KHÔNG ghi (tránh gán nhầm môn).
 * - Field trường khác không hiểu (vd `certificates`, `priority`) không bị đụng tới — merge nông
 *   (shallow) trên `base`, không xóa dữ liệu factual mà trường khác đã ghi trước đó.
 */
export function buildApplicantProfileFromHcmutForm(
  base: ApplicantProfile,
  input: HcmutFormFactualInput,
  subjectContext: HcmutSubjectContext
): ApplicantProfile {
  const next: ApplicantProfile = { ...base };

  if (input.dgnl) {
    // Components là authoritative factual input (INVARIANT 1, `core/vactProfile.ts`) — tự tính lại
    // `total = sum(components)` KHÔNG nhân hệ số Toán×2 (khác `weightedScore`/`normalizedScore` —
    // 2 giá trị đó đã qua công thức riêng HCMUT, không được ghi vào profile). Ghi đè bất kỳ `total`
    // xung đột nào từ trường khác (vd UEH) — components cụ thể hơn nên thắng, đúng chính sách batch 5.
    next.exams = {
      ...next.exams,
      vact: reconcileVactFromComponents(next.exams?.vact, {
        vietnamese: input.dgnl.vietnamese,
        english: input.dgnl.english,
        math: input.dgnl.math,
        scientificThinking: input.dgnl.scientificThinking,
      }),
    };
  }

  // Batch 7: THPT và học bạ ghi ĐỘC LẬP — sửa cái này không được đụng cái kia (bug cũ: 1 cờ edit
  // dùng chung khiến sửa THPT ghi đè học bạ chưa từng nhập thành `0`, xem CLAUDE.md Batch 7 mục B).
  if (subjectContext.subject2 || subjectContext.subject3) {
    if (input.thpt) {
      const thptScores = mapThptScores(input.thpt, subjectContext);
      for (const subjectId of input.thptNonFactualSubjectIds ?? []) {
        delete thptScores[subjectId];
      }
      next.thpt = { scores: thptScores };
    }
    if (input.transcript) {
      next.transcript = {
        grade10: mapThptScores(input.transcript.grade10, subjectContext),
        grade11: mapThptScores(input.transcript.grade11, subjectContext),
        grade12: mapThptScores(input.transcript.grade12, subjectContext),
      };
    }
  }

  return next;
}
