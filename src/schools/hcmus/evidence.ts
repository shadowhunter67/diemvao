import type { SourcedRule } from '../../core/evidence';
import { HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE, HCMUS_THPT_COMBINATION_THRESHOLD_30 } from './eligibility';
import { HCMUS_BONUS_CATEGORIES_2026, HCMUS_BONUS_REDUCTION_THRESHOLD_30, HCMUS_MAX_SCORE_30 } from './data/bonus';
import {
  HCMUS_PRIORITY_REDUCTION_THRESHOLD_30,
  HCMUS_PRIORITY_REDUCTION_DIVISOR_30,
  HCMUS_PRIORITY_REGION_POINTS_30,
  HCMUS_PRIORITY_CATEGORY_POINTS_30,
} from './priority';

export const hcmusThresholdEvidence = {
  value: { thptThreshold30: HCMUS_THPT_COMBINATION_THRESHOLD_30, nuclearMinSubject: HCMUS_NUCLEAR_ENGINEERING_MIN_SUBJECT_SCORE },
  evidence: [
    {
      sourceId: 'hcmus-threshold-method2-2026',
      location: 'Ngưỡng THPT tổ hợp ≥15,00/30 + điều kiện riêng ngành Kỹ thuật hạt nhân (Toán, Lý ≥7.5)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ thptThreshold30: number; nuclearMinSubject: number }>;

export const hcmusProgramThresholdEvidence = {
  value: { programCount: 39 },
  evidence: [
    {
      sourceId: 'hcmus-threshold-method2-2026',
      location:
        'Mục 3 - infographic "NGƯỠNG ĐẢM BẢO CHẤT LƯỢNG PHƯƠNG THỨC XÉT TUYỂN TỔNG HỢP NĂM 2026 (PHƯƠNG THỨC 2)", 39 dòng ngành/nhóm ngành.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-14',
    },
  ],
} satisfies SourcedRule<{ programCount: number }>;

/**
 * Evidence cho Điểm học lực (route1 THPT / route2 ĐGNL, MAX) + bảng quy đổi phân vị ĐGNL↔THPT —
 * nguồn ảnh infographic official user cung cấp 2026-08-13 (xem `sources.ts`
 * `hcmus-academic-score-formula-2026`/`hcmus-vact-conversion-table-2026`). KHÔNG phải evidence cho
 * điểm xét tuyển cuối cùng (còn thiếu Điểm cộng/Điểm ưu tiên — xem `knowledgeGaps.ts`).
 */
export const hcmusAcademicScoreEvidence = {
  value: { thptWeight: 0.8, transcriptWeight: 0.2 },
  evidence: [
    {
      sourceId: 'hcmus-academic-score-formula-2026',
      location: 'ĐIỂM XÉT TUYỂN = ĐIỂM HỌC LỰC + ĐIỂM CỘNG + ĐIỂM ƯU TIÊN; ĐIỂM HỌC LỰC = MAX(0.8×THPT+0.2×Học bạ, 0.8×ĐGNL+0.2×Học bạ)',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
    {
      sourceId: 'hcmus-vact-conversion-table-2026',
      location: 'Khung quy đổi tương đương điểm thi ĐGNL với điểm thi tốt nghiệp THPT năm 2026 — 101 dòng phân vị',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-13',
    },
  ],
} satisfies SourcedRule<{ thptWeight: number; transcriptWeight: number }>;

/**
 * Evidence cho bảng "Điểm cộng" Phương thức 2 (2026) — re-audit 2026-08-15, ảnh chính thức mở qua
 * chrome-devtools trực tiếp từ trang tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/. Đóng gap
 * `hcmus-bonus-table` (xem `knowledgeGaps.ts`). Điểm ưu tiên khu vực/đối tượng VẪN là gap riêng.
 */
export const hcmusBonusEvidence = {
  value: {
    categoryCount: HCMUS_BONUS_CATEGORIES_2026.length,
    reductionThreshold30: HCMUS_BONUS_REDUCTION_THRESHOLD_30,
    maxScore30: HCMUS_MAX_SCORE_30,
  },
  evidence: [
    {
      sourceId: 'hcmus-bonus-table-2026',
      location:
        'Ảnh "BẢNG ĐIỂM CỘNG PHƯƠNG THỨC 2..." + mục "2. Điểm cộng" trang tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/ — 15 dòng thang điểm cơ sở, chỉ cộng 01 loại cao nhất, công thức giảm khi tổng điểm ≥28,5/30, điểm xét không vượt 30/30.',
      verification: 'verified' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-15',
    },
  ],
} satisfies SourcedRule<{ categoryCount: number; reductionThreshold30: number; maxScore30: number }>;

/**
 * Evidence cho Điểm ưu tiên khu vực/đối tượng — batch provenance-hygiene (2026-08-17) phát hiện
 * `priority.ts` KHÔNG có comment/evidence nào trước đó (khác mọi file constants khác của HCMUS),
 * dù đang được `evaluateHcmusAdmission` dùng cho method `hcmus-method2-2026` (`exactCalculator:
 * true`). Đã audit trực tiếp (chrome-devtools, 2026-08-17) cả 3 trang text HCMUS đã đăng ký trong
 * `sources.ts` (`hcmus-info-2026`, `hcmus-threshold-method2-2026`, `hcmus-methods-2026`) — KHÔNG
 * trang nào có mục "Điểm ưu tiên" hay bảng KV/UT cụ thể (trang `2026-thong-tin-tuyen-sinh/` hiện
 * chỉ có mục 1/2/3/4: Điều kiện / Điểm cộng / Tiêu chí phân ngành / Quy đổi chứng chỉ — KHÔNG có
 * mục "Điểm ưu tiên"). KHÔNG tìm được worked example/bảng số nào công bố trực tiếp bởi HCMUS cho
 * rule này — do đó KHÔNG đánh dấu `verification: 'verified'` (sẽ overclaim).
 *
 * Re-audit 2026-08-18 (bounded, thêm 1 trang mới `phuong-thuc-tuyen-sinh/` ngoài 3 trang cũ): vẫn
 * KHÔNG tìm được nguồn trực tiếp — xem chi tiết URL đã kiểm ở `note` của evidence object bên dưới.
 * Kết luận không đổi: giữ `cross-checked`.
 *
 * Cross-check: `KV1=0.75/KV2-NT=0.5/KV2=0.25/KV3=0, UT1=2/UT2=1` (thang 30) VÀ ngưỡng giảm
 * `22.5/30 (75%)`, `divisor 7.5 (25% thang 30)` khớp CHÍNH XÁC bảng ưu tiên chuẩn quốc gia (Thông
 * tư quy chế tuyển sinh hiện hành của Bộ GDĐT) — CÙNG bảng hằng số đã verified/cross-checked độc
 * lập ở 3 trường khác trong chính repo này dùng đúng công thức tỉ lệ 75%/25% (`schools/uel/
 * priorityReduction.ts` ngưỡng 75/100, `schools/iu/priorityReduction.ts` ngưỡng 75/100,
 * `schools/ussh/priority.ts` — USSH's comment tự xác nhận "CÙNG bảng hằng số quốc gia đã dùng cho
 * HCMUS"). Vì vậy `verification: 'cross-checked'` (không phải 'verified' trực tiếp từ 1 trang
 * HCMUS cụ thể, cũng không phải suy đoán vô căn cứ — có cross-check nội bộ nhất quán 3 nguồn độc
 * lập cùng công thức tỉ lệ).
 *
 * `sourceId` trỏ `hcmus-academic-score-formula-2026` — nguồn DUY NHẤT của HCMUS xác nhận "Điểm ưu
 * tiên" LÀ một thành phần trong công thức điểm xét tuyển ("ĐIỂM XÉT TUYỂN = ĐIỂM HỌC LỰC + ĐIỂM
 * CỘNG + ĐIỂM ƯU TIÊN") — nguồn này KHÔNG chứa bảng số KV/UT cụ thể, chỉ xác nhận rule tồn tại.
 * KHÔNG dùng `hcmus-bonus-table-2026` (source đó chỉ nói về "2. Điểm cộng", semantic khác — công
 * thức giảm điểm CỘNG ngưỡng 28,5/1,5, khác hẳn công thức giảm điểm ƯU TIÊN ngưỡng 22,5/7,5).
 */
export const hcmusPriorityEvidence = {
  value: {
    reductionThreshold30: HCMUS_PRIORITY_REDUCTION_THRESHOLD_30,
    reductionDivisor30: HCMUS_PRIORITY_REDUCTION_DIVISOR_30,
    regionPoints30: HCMUS_PRIORITY_REGION_POINTS_30,
    categoryPoints30: HCMUS_PRIORITY_CATEGORY_POINTS_30,
  },
  evidence: [
    {
      sourceId: 'hcmus-academic-score-formula-2026',
      location:
        'Infographic "CÁCH TÍNH ĐIỂM XÉT TUYỂN" xác nhận "Điểm ưu tiên" là 1 trong 3 thành phần điểm xét tuyển — KHÔNG chứa bảng KV/UT cụ thể.',
      verification: 'cross-checked' as const,
      effectiveYear: 2026,
      verifiedAt: '2026-08-18',
      note:
        'KV1=0.75/KV2-NT=0.5/KV2=0.25/KV3=0, UT1=2/UT2=1 (thang 30) + ngưỡng giảm 22,5/7,5 khớp bảng ưu tiên chuẩn quốc gia (Bộ GDĐT) đã verified/cross-checked độc lập ở UEL/IU/USSH trong cùng repo (cùng công thức tỉ lệ 75%/25%) — không tìm được trang HCMUS nào công bố trực tiếp bảng số này. Re-audit 2026-08-18 (bounded, 4 trang): tuyensinh.hcmus.edu.vn/ (trang chủ), /2026-thong-tin-tuyen-sinh/, /2026-thong-bao-ve-nguong-dam-bao-chat-luong-phuong-thuc-2/, /phuong-thuc-tuyen-sinh/ — cả 4 trang chỉ nhắc "điểm ưu tiên khu vực, đối tượng" như một thành phần bị LOẠI TRỪ khỏi ngưỡng đảm bảo chất lượng (không cộng khi xét ngưỡng), dẫn 2 văn bản Bộ GDĐT (2101/QĐ-BGDĐT, 1050/QĐ-BGDĐT) nhưng không kèm link hay bảng số, không có PDF/link ngoài nào khác trên các trang này. Vẫn giữ "cross-checked". Nếu tìm được nguồn HCMUS trực tiếp, nâng verification lên "verified".',
    },
  ],
} satisfies SourcedRule<{
  reductionThreshold30: number;
  reductionDivisor30: number;
  regionPoints30: Record<string, number>;
  categoryPoints30: Record<string, number>;
}>;
