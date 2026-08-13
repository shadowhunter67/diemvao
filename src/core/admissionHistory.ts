/**
 * Model dùng chung cho lịch sử điểm chuẩn nhiều năm (mọi trường) — chỉ generic phần thật sự
 * chung (status, comparability, selector theo năm). Field điểm/ngành/phương thức cụ thể vẫn
 * nằm trong type riêng từng trường (`schools/<id>/types/programs.ts`) vì thang điểm, tên
 * phương thức khác nhau — không ép một `AdmissionCutoff` universal.
 */

/**
 * 'final': số liệu chính thức, dùng để hiển thị/so sánh.
 * 'superseded': từng là 'final' nhưng đã bị thay bằng bản công bố mới hơn — KHÔNG xóa, giữ lại
 * cho lịch sử/audit, UI công khai không hiển thị (trừ view admin sau này).
 * Record không có `status` mặc định coi là 'final' (giữ tương thích ngược với data cũ).
 */
export type CutoffStatus = 'final' | 'superseded';

/**
 * Loại nguồn — dùng để đánh giá độ tin cậy khi hiển thị/QA, KHÔNG bắt buộc set cho mọi record
 * hiện có (optional, additive). 'vnuhcm': Trung tâm Khảo thí & ĐBCL ĐHQG-HCM hoặc ĐHQG-HCM nói
 * chung, tách khỏi 'official-school' (thông báo riêng của từng trường thành viên).
 */
export type SourceType = 'official-school' | 'official-admission' | 'vnuhcm' | 'government' | 'secondary';

interface HistoricalCutoffLike {
  year: number;
  status?: CutoffStatus;
}

function isFinal<T extends HistoricalCutoffLike>(record: T): boolean {
  return (record.status ?? 'final') === 'final';
}

/** true nếu có record 'final' (hoặc không set status) cho đúng năm truyền vào. */
export function isYearPublished<T extends HistoricalCutoffLike>(records: T[], year: number): boolean {
  return records.some((record) => record.year === year && isFinal(record));
}

/** Record 'final' mới nhất, sort theo năm giảm dần. Bỏ qua 'superseded'. */
export function latestFinalCutoff<T extends HistoricalCutoffLike>(records: T[]): T | undefined {
  return records.filter(isFinal).sort((a, b) => b.year - a.year)[0];
}

/**
 * Mốc tham khảo gần nhất TRƯỚC `beforeYear` (không lấy chính beforeYear) — dùng khi năm hiện
 * tại chưa công bố, cần "nearest comparable previous year" chứ không mặc định là beforeYear-1
 * (năm liền trước có thể không có dữ liệu).
 */
export function nearestPreviousFinalCutoff<T extends HistoricalCutoffLike>(
  records: T[],
  beforeYear: number
): T | undefined {
  return records
    .filter((record) => isFinal(record) && record.year < beforeYear)
    .sort((a, b) => b.year - a.year)[0];
}

/** Chỉ record 'final', sort năm mới nhất trước — dùng cho bảng lịch sử công khai. */
export function finalCutoffsSortedDesc<T extends HistoricalCutoffLike>(records: T[]): T[] {
  return records.filter(isFinal).sort((a, b) => b.year - a.year);
}

/**
 * Xác nhận CHỦ ĐỘNG rằng đã kiểm tra nguồn chính thức và trường CHƯA công bố cutoff năm đó —
 * khác hẳn "không có record vì chưa research" hay "research rồi nhưng chưa tìm được nguồn đủ
 * mạnh" (2 trường hợp đó vẫn chỉ là absence, không cần record). Đây là type RIÊNG, KHÔNG trộn
 * vào mảng cutoff của từng trường (AdmissionCutoff/UitCutoff/UelCutoff) — giữ `score` ở các type
 * đó luôn là number thật, tránh phải optional-hóa và narrow lại `score` ở mọi nơi UI đọc cutoff
 * chỉ để phục vụ 1 trường hợp hiếm. Ví dụ thật: xem `src/data/notPublishedCutoffChecks.ts`
 * (USSH 2026, research 2026-08-11, dự kiến công bố 2026-08-13).
 */
export interface NotPublishedCheck {
  schoolId: string;
  /** Bỏ trống = áp dụng cho cả trường/phương thức, không riêng 1 ngành. */
  programId?: string;
  year: number;
  /** Ngày thực sự đối chiếu lại nguồn — không phải ngày tạo record. */
  checkedAt: string;
  sourceUrl?: string;
  notes?: string;
}

export type CutoffPublicationStatus = 'published' | 'not-published' | 'unknown' | 'superseded';
export type CutoffAvailability = CutoffPublicationStatus;

/**
 * 'published': có record 'final' cho năm đó.
 * 'not-published': KHÔNG có record final, NHƯNG có NotPublishedCheck xác nhận đã kiểm tra.
 * 'unknown': không có gì cả — chưa research, hoặc research chưa đủ nguồn. KHÔNG được hiển thị
 * như "trường chưa công bố" (đó là kết luận cần bằng chứng, không phải suy ra từ im lặng).
 */
export function getCutoffAvailability<T extends HistoricalCutoffLike>(
  records: T[],
  year: number,
  notPublishedChecks: Pick<NotPublishedCheck, 'year'>[] = []
): CutoffAvailability {
  if (isYearPublished(records, year)) return 'published';
  if (records.some((record) => record.year === year && record.status === 'superseded')) return 'superseded';
  if (notPublishedChecks.some((check) => check.year === year)) return 'not-published';
  return 'unknown';
}
