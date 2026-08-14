import { round2 } from '../../core/round2';
import { convertHcmusVactToThpt } from './dgnlConversion';

/**
 * "CÁCH TÍNH ĐIỂM XÉT TUYỂN" HCMUS 2026 — nguồn `hcmus-academic-score-formula-2026`:
 *   ĐIỂM XÉT TUYỂN = ĐIỂM HỌC LỰC + ĐIỂM CỘNG + ĐIỂM ƯU TIÊN
 *   ĐIỂM HỌC LỰC = MAX(ĐIỂM HỌC LỰC 1, ĐIỂM HỌC LỰC 2)
 *   ĐIỂM HỌC LỰC 1 (thí sinh có điểm THPT 2026) = 0.8 × ĐIỂM THPT + 0.2 × ĐIỂM HỌC BẠ
 *   ĐIỂM HỌC LỰC 2 (thí sinh có điểm ĐGNL 2026)  = 0.8 × ĐIỂM ĐGNL (đã quy đổi sang thang 30,
 *     xem `dgnlConversion.ts`) + 0.2 × ĐIỂM HỌC BẠ
 *
 * Module này CHỈ tính ĐIỂM HỌC LỰC (route1/route2/max) — KHÔNG cộng thêm Điểm cộng/Điểm ưu tiên
 * vì bảng điểm cộng và công thức ưu tiên đầy đủ CHƯA có evidence đủ (xem `knowledgeGaps.ts`).
 * Kết quả trả về ở đây là "Điểm học lực hiện tính được" — KHÔNG phải điểm xét tuyển cuối cùng. Có thể
 * hiển thị cạnh ngưỡng điểm tổng hợp tối thiểu của chương trình, nhưng không dùng riêng nó để kết luận đạt/rớt
 * vì điểm cuối còn phụ thuộc Điểm cộng và Điểm ưu tiên.
 */
export interface HcmusAcademicScoreInput {
  /** Tổng điểm 3 môn tổ hợp thi tốt nghiệp THPT 2026 (thang 30). */
  thptTotal30?: number;
  /** Điểm ĐGNL ĐHQG-HCM thô, thang 1200. */
  vactRaw1200?: number;
  /** Tổng điểm học bạ 3 môn tổ hợp (thang 30, quy ước trung bình 3 năm — cùng ước lượng UEL/USSH
   * dùng khi trường không công bố trọng số theo năm khác nhau). */
  transcriptTotal30?: number;
}

export interface HcmusAcademicScoreRoute {
  available: boolean;
  value?: number;
  /** Chỉ có ở route 2 (ĐGNL) — kết quả quy đổi trung gian để hiển thị "đã quy đổi". */
  convertedVact?: number;
  vactOutOfSupportedRange?: boolean;
}

export interface HcmusAcademicScoreResult {
  route1Thpt: HcmusAcademicScoreRoute;
  route2Vact: HcmusAcademicScoreRoute;
  /** Điểm học lực = MAX(route1, route2) trong số các route available. undefined nếu cả 2 đều
   * chưa đủ dữ liệu. */
  academicScore?: number;
  usedRoute?: 'thpt' | 'vact';
}

const THPT_WEIGHT = 0.8;
const TRANSCRIPT_WEIGHT = 0.2;

export function calculateHcmusAcademicScore(input: HcmusAcademicScoreInput): HcmusAcademicScoreResult {
  const route1: HcmusAcademicScoreRoute =
    input.thptTotal30 !== undefined && input.transcriptTotal30 !== undefined
      ? { available: true, value: round2(THPT_WEIGHT * input.thptTotal30 + TRANSCRIPT_WEIGHT * input.transcriptTotal30) }
      : { available: false };

  let route2: HcmusAcademicScoreRoute = { available: false };
  if (input.vactRaw1200 !== undefined) {
    const converted = convertHcmusVactToThpt(input.vactRaw1200);
    if (converted === null) {
      route2 = { available: false, vactOutOfSupportedRange: true };
    } else if (input.transcriptTotal30 !== undefined) {
      route2 = {
        available: true,
        value: round2(THPT_WEIGHT * converted.thptScore + TRANSCRIPT_WEIGHT * input.transcriptTotal30),
        convertedVact: converted.thptScore,
      };
    } else {
      route2 = { available: false, convertedVact: converted.thptScore };
    }
  }

  if (route1.available && route2.available) {
    const useThpt = route1.value! >= route2.value!;
    return { route1Thpt: route1, route2Vact: route2, academicScore: useThpt ? route1.value : route2.value, usedRoute: useThpt ? 'thpt' : 'vact' };
  }
  if (route1.available) return { route1Thpt: route1, route2Vact: route2, academicScore: route1.value, usedRoute: 'thpt' };
  if (route2.available) return { route1Thpt: route1, route2Vact: route2, academicScore: route2.value, usedRoute: 'vact' };
  return { route1Thpt: route1, route2Vact: route2 };
}
