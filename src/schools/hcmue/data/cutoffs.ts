import type { ComparableCutoffRecord } from '../../../core/cutoffComparison';

/**
 * Điểm trúng tuyển HCMUE 2026, thang 30, cột "PT sử dụng KQ thi TN THPT 2026 / KQ thi TN THPT
 * 2026 kết hợp thi NK" (methodId 'thpt') — CHƯA nhập cột song song "PT sử dụng KQ học tập THPT
 * kết hợp ĐGNLCB / kết quả thi NK kết hợp ĐGNLCB" để tránh rủi ro lẫn cột khi nhập tay 60+ dòng
 * trong 1 lượt (xem `hcmueKnowledgeGaps['hcmue-current-cutoffs-2026']`).
 *
 * HCMUE là eligibility/threshold-checker (runtime KHÔNG tính `evaluation.score`), nên bảng này
 * KHÔNG kích hoạt cutoff-comparison ở `/compare` (helper `withProgramCutoffComparison` cần
 * `evaluation.score`) — mục đích hiện tại là dữ liệu tham khảo/đóng gap, có thể hiển thị dạng
 * bảng tham khảo ở `HcmuePage.tsx` sau này.
 *
 * `combinationId` ghi đúng mã tổ hợp gốc trên bảng công bố (vd 'A00', 'C00VA' cho tổ hợp NK) —
 * KHÔNG phải danh mục tổ hợp chuẩn hoá trong `core/subjects.ts`.
 *
 * Nguồn: "THÔNG BÁO KẾT QUẢ XÉT TUYỂN CÁC NGÀNH ĐÀO TẠO TRÌNH ĐỘ ĐẠI HỌC, NGÀNH GIÁO DỤC MẦM NON
 * TRÌNH ĐỘ CAO ĐẲNG HỆ CHÍNH QUY NĂM 2026" (`hcmueSources['hcmue-cutoffs-2026']`, đăng 11/08/2026,
 * id=27828) — người dùng cung cấp trực tiếp ảnh chụp bảng gốc (2 file Drive đính kèm bài đăng bị
 * khóa quyền tải nên trước đó không đọc được), không phải suy đoán từ báo chí thứ cấp.
 */
const SOURCE_2026 = {
  methodId: 'thpt' as const,
  scoreScale: 30,
  sourceLabel:
    'Thông báo kết quả xét tuyển các ngành đào tạo trình độ đại học, ngành Giáo dục Mầm non trình độ cao đẳng hệ chính quy năm 2026 — Trường Đại học Sư phạm TP.HCM',
  sourceUrl: 'http://tuyensinh.hcmue.edu.vn/index.php?option=com_content&view=article&id=27828&catid=4069&Itemid=9677&lang=vi&site=183',
  publishedAt: '2026-08-11',
  accessedAt: '2026-08-19',
};

/** Trụ sở chính TP.HCM — 47 ngành, khớp `hcmueProgramThresholds` campus 'hcmc'. */
export const hcmueCutoffsHcmc: ComparableCutoffRecord[] = [
  { year: 2026, programId: 'hcmue-7140101', campusId: 'hcmc', combinationId: 'A00', score: 24.25, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140103', campusId: 'hcmc', combinationId: 'A01', score: 20.25, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140114', campusId: 'hcmc', combinationId: 'A00', score: 24.73, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140201', campusId: 'hcmc', combinationId: 'M03', score: 25.84, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140202', campusId: 'hcmc', combinationId: 'D01', score: 26.04, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140202SN', campusId: 'hcmc', combinationId: 'D01', score: 26.63, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140203', campusId: 'hcmc', combinationId: 'C00', score: 25.21, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140204', campusId: 'hcmc', combinationId: 'X70', score: 24.76, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140205', campusId: 'hcmc', combinationId: 'X70', score: 25.79, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140206', campusId: 'hcmc', combinationId: 'T01', score: 26.67, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140208', campusId: 'hcmc', combinationId: 'Q02', score: 25.8, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140209', campusId: 'hcmc', combinationId: 'A00', score: 29.49, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140210', campusId: 'hcmc', combinationId: 'A01', score: 25.3, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140211', campusId: 'hcmc', combinationId: 'A00', score: 29.78, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140212', campusId: 'hcmc', combinationId: 'A00', score: 29.83, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140213', campusId: 'hcmc', combinationId: 'B00', score: 27.66, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140217', campusId: 'hcmc', combinationId: 'C00', score: 29.8, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140218', campusId: 'hcmc', combinationId: 'C00', score: 29.8, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140219', campusId: 'hcmc', combinationId: 'C00', score: 27.44, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140246', campusId: 'hcmc', combinationId: 'A01', score: 24.33, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140247', campusId: 'hcmc', combinationId: 'A00', score: 28.15, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140249', campusId: 'hcmc', combinationId: 'C00', score: 25.88, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140231', campusId: 'hcmc', combinationId: 'D01', score: 27.79, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140232', campusId: 'hcmc', combinationId: 'D01', score: 23.26, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140233', campusId: 'hcmc', combinationId: 'D01', score: 24.17, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140234', campusId: 'hcmc', combinationId: 'D01', score: 26.87, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7220201', campusId: 'hcmc', combinationId: 'D01', score: 25.5, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7220202', campusId: 'hcmc', combinationId: 'D01', score: 19, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7220203', campusId: 'hcmc', combinationId: 'D01', score: 18.5, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7220204', campusId: 'hcmc', combinationId: 'D01', score: 23.5, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7220209', campusId: 'hcmc', combinationId: 'D01', score: 19.5, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7220210', campusId: 'hcmc', combinationId: 'D01', score: 22, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7229030', campusId: 'hcmc', combinationId: 'C00', score: 24.68, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7310201', campusId: 'hcmc', combinationId: 'X70', score: 22.35, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7310401', campusId: 'hcmc', combinationId: 'D01', score: 24.2, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7310403', campusId: 'hcmc', combinationId: 'D01', score: 22, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7310501', campusId: 'hcmc', combinationId: 'C00', score: 24.45, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7310601', campusId: 'hcmc', combinationId: 'D14', score: 20.25, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7310630', campusId: 'hcmc', combinationId: 'C00', score: 21.07, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7420203', campusId: 'hcmc', combinationId: 'B00', score: 22.61, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7440102', campusId: 'hcmc', combinationId: 'A00', score: 25.05, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7440112', campusId: 'hcmc', combinationId: 'A00', score: 25.89, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7460112', campusId: 'hcmc', combinationId: 'A00', score: 26.44, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7480201', campusId: 'hcmc', combinationId: 'A01', score: 18, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7760101', campusId: 'hcmc', combinationId: 'C00', score: 22.1, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7760103', campusId: 'hcmc', combinationId: 'C00', score: 23.35, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7810101', campusId: 'hcmc', combinationId: 'C00', score: 21.1, ...SOURCE_2026 },
];

/** Phân hiệu Long An (mã tuyển sinh SPT) — 10 ngành, khớp `hcmueProgramThresholds` campus 'long-an'. */
export const hcmueCutoffsLongAn: ComparableCutoffRecord[] = [
  { year: 2026, programId: 'hcmue-51140201-longan', campusId: 'long-an', combinationId: 'M03', score: 24.83, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140201-longan', campusId: 'long-an', combinationId: 'M03', score: 25.41, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140202-longan', campusId: 'long-an', combinationId: 'D01', score: 25.55, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140206-longan', campusId: 'long-an', combinationId: 'T01', score: 25.82, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140208-longan', campusId: 'long-an', combinationId: 'Q02', score: 24.87, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140209-longan', campusId: 'long-an', combinationId: 'A00', score: 28.84, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140217-longan', campusId: 'long-an', combinationId: 'C00', score: 26.3, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140231-longan', campusId: 'long-an', combinationId: 'D01', score: 26.7, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140249-longan', campusId: 'long-an', combinationId: 'C00', score: 25.14, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7220210-longan', campusId: 'long-an', combinationId: 'D01', score: 18, ...SOURCE_2026 },
];

/** Phân hiệu Gia Lai (mã tuyển sinh SPG) — 5 ngành, khớp `hcmueProgramThresholds` campus 'gia-lai'. */
export const hcmueCutoffsGiaLai: ComparableCutoffRecord[] = [
  { year: 2026, programId: 'hcmue-51140201-gialai', campusId: 'gia-lai', combinationId: 'M03', score: 23.7, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140201-gialai', campusId: 'gia-lai', combinationId: 'M03', score: 25.17, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140202-gialai', campusId: 'gia-lai', combinationId: 'D01', score: 24.54, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7140247-gialai', campusId: 'gia-lai', combinationId: 'A00', score: 25.5, ...SOURCE_2026 },
  { year: 2026, programId: 'hcmue-7810101-gialai', campusId: 'gia-lai', combinationId: 'C00', score: 18, ...SOURCE_2026 },
];

export const hcmueCutoffs: ComparableCutoffRecord[] = [...hcmueCutoffsHcmc, ...hcmueCutoffsLongAn, ...hcmueCutoffsGiaLai];
