/**
 * Ngưỡng đảm bảo chất lượng đầu vào AGU 2026, phương thức Xét tuyển Tổng hợp (Phương thức 2) —
 * đọc trực tiếp từ 2 ảnh trang 1-2 của Thông báo 24/TB-HĐTS ngày 08/07/2026 (xem `sources.ts`,
 * id 'agu-threshold-2026'). Cột `dgnlMin: null` nghĩa là thông báo để trống ô ĐGNL cho ngành đó
 * (Luật) — KHÔNG suy đoán thành 0 hay "không xét ĐGNL", chỉ ghi lại đúng những gì ảnh thể hiện.
 * "Lưu ý" cuối trang 2 của ảnh: mức điểm nhận ĐKXT CHƯA bao gồm điểm cộng/điểm ưu tiên.
 */
export interface AguProgramThreshold {
  programCode: string;
  name: string;
  quota: number;
  /** Mức điểm nhận ĐKXT tối thiểu, thang THPT 30 điểm (chưa cộng điểm cộng/ưu tiên). */
  thptMin: number;
  /** Mức điểm nhận ĐKXT tối thiểu, thang ĐGNL ĐHQG-HCM 1200 điểm. null = thông báo không ghi ngưỡng ĐGNL cho ngành này. */
  dgnlMin: number | null;
}

export const AGU_PROGRAM_THRESHOLDS_2026: AguProgramThreshold[] = [
  { programCode: '7140201', name: 'Giáo dục Mầm non', quota: 50, thptMin: 20, dgnlMin: null },
  { programCode: '7140202', name: 'Giáo dục Tiểu học', quota: 144, thptMin: 20, dgnlMin: null },
  { programCode: '7140205', name: 'Giáo dục Chính trị', quota: 20, thptMin: 20, dgnlMin: null },
  { programCode: '7140209', name: 'Sư phạm Toán học', quota: 33, thptMin: 20, dgnlMin: null },
  { programCode: '7140211', name: 'Sư phạm Vật lý', quota: 20, thptMin: 20, dgnlMin: null },
  { programCode: '7140212', name: 'Sư phạm Hóa học', quota: 20, thptMin: 20, dgnlMin: null },
  { programCode: '7140217', name: 'Sư phạm Ngữ văn', quota: 35, thptMin: 20, dgnlMin: null },
  { programCode: '7140218', name: 'Sư phạm Lịch sử', quota: 20, thptMin: 20, dgnlMin: null },
  { programCode: '7140219', name: 'Sư phạm Địa lý', quota: 20, thptMin: 20, dgnlMin: null },
  { programCode: '7140231', name: 'Sư phạm Tiếng Anh', quota: 77, thptMin: 20, dgnlMin: null },
  { programCode: '7140213', name: 'Sư phạm Sinh học', quota: 20, thptMin: 20, dgnlMin: null },
  { programCode: '7140247', name: 'Sư phạm Khoa học tự nhiên', quota: 30, thptMin: 20, dgnlMin: null },
  { programCode: '7140249', name: 'Sư phạm Lịch sử - Địa lý', quota: 20, thptMin: 20, dgnlMin: null },
  { programCode: '7340101', name: 'Quản trị kinh doanh', quota: 150, thptMin: 15, dgnlMin: 500 },
  { programCode: '7340115', name: 'Marketing', quota: 120, thptMin: 15, dgnlMin: 500 },
  { programCode: '7340201', name: 'Tài chính - Ngân hàng', quota: 150, thptMin: 15, dgnlMin: 500 },
  { programCode: '7340301', name: 'Kế toán', quota: 120, thptMin: 15, dgnlMin: 500 },
  { programCode: '7340122', name: 'Thương mại điện tử', quota: 60, thptMin: 15, dgnlMin: 500 },
  { programCode: '7380101', name: 'Luật', quota: 77, thptMin: 20, dgnlMin: null },
  { programCode: '7420201', name: 'Công nghệ sinh học', quota: 90, thptMin: 15, dgnlMin: 500 },
  { programCode: '7460108', name: 'Khoa học dữ liệu', quota: 30, thptMin: 15, dgnlMin: 500 },
  { programCode: '7480103', name: 'Kỹ thuật phần mềm', quota: 100, thptMin: 15, dgnlMin: 500 },
  { programCode: '7480201', name: 'Công nghệ thông tin', quota: 220, thptMin: 15, dgnlMin: 500 },
  { programCode: '7510406', name: 'Công nghệ kỹ thuật môi trường', quota: 40, thptMin: 15, dgnlMin: 500 },
  { programCode: '7510401', name: 'Công nghệ kỹ thuật hóa học', quota: 40, thptMin: 15, dgnlMin: 500 },
  { programCode: '7540101', name: 'Công nghệ thực phẩm', quota: 70, thptMin: 15, dgnlMin: 500 },
  { programCode: '7540104', name: 'Công nghệ sau thu hoạch', quota: 30, thptMin: 15, dgnlMin: 500 },
  { programCode: '7540106', name: 'Đảm bảo chất lượng và an toàn thực phẩm', quota: 30, thptMin: 15, dgnlMin: 500 },
  { programCode: '7620105', name: 'Chăn nuôi', quota: 30, thptMin: 15, dgnlMin: 500 },
  { programCode: '7620110', name: 'Khoa học cây trồng', quota: 60, thptMin: 15, dgnlMin: 500 },
  { programCode: '7620112', name: 'Bảo vệ thực vật', quota: 100, thptMin: 15, dgnlMin: 500 },
  { programCode: '7620116', name: 'Phát triển nông thôn', quota: 45, thptMin: 15, dgnlMin: 500 },
  { programCode: '7620301', name: 'Nuôi trồng thủy sản', quota: 60, thptMin: 15, dgnlMin: 500 },
  { programCode: '7620191', name: 'Kinh doanh nông nghiệp số', quota: 40, thptMin: 15, dgnlMin: 500 },
  { programCode: '7620190', name: 'Công nghệ nông nghiệp số', quota: 40, thptMin: 15, dgnlMin: 500 },
  { programCode: '7310106', name: 'Kinh tế quốc tế', quota: 100, thptMin: 15, dgnlMin: 500 },
  { programCode: '7310630', name: 'Việt Nam học', quota: 150, thptMin: 15, dgnlMin: 500 },
  { programCode: '7310201', name: 'Chính trị học', quota: 30, thptMin: 15, dgnlMin: 500 },
  { programCode: '7220201', name: 'Ngôn ngữ Anh', quota: 180, thptMin: 15, dgnlMin: 500 },
  { programCode: '7229030', name: 'Văn học', quota: 30, thptMin: 15, dgnlMin: 500 },
  { programCode: '7229001', name: 'Triết học', quota: 20, thptMin: 15, dgnlMin: 500 },
  { programCode: '7850101', name: 'Quản lý tài nguyên và môi trường', quota: 50, thptMin: 15, dgnlMin: 500 },
  { programCode: '7640101', name: 'Thú y', quota: 55, thptMin: 15, dgnlMin: 500 },
];

/** Trọng số β công thức Xét tuyển Tổng hợp — cùng ảnh trang 3 của Thông báo 24/TB-HĐTS, mục 4
 * "Hệ số beta (β) áp dụng trong phương thức xét tuyển Tổng hợp". Đây LÀ số chính thức đã ký ban
 * hành, KHÔNG phải "hệ số giả lập" của công cụ ước tính trên trang tuyensinh.agu.edu.vn/tuyen-sinh
 * (widget ước tính tự ghi rõ đang dùng hệ số giả lập trùng số — UniscoreVN dùng ảnh thông báo đã
 * ký làm nguồn, không dùng widget). */
export const AGU_BETA_WEIGHTS_2026 = {
  beta1Thpt: 0.4,
  beta2Dgnl: 0.4,
  beta3Transcript: 0.2,
};

/** Điều kiện riêng ngành Luật (mục 3 của thông báo, theo Quyết định 678/QĐ-BGDĐT ngày 14/3/2025). */
export const AGU_LAW_EXTRA_CONDITION = {
  programCode: '7380101',
  /** Tổng điểm xét tuyển tối thiểu, thang 100. */
  minTotalScore100: 60,
  /** Điểm môn Toán HOẶC Ngữ văn trong tổ hợp xét tuyển tối thiểu, tính theo % thang điểm tối đa. */
  minMathOrLiteraturePercent: 60,
};
