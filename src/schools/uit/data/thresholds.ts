/**
 * Ngưỡng đầu vào UIT 2026 — 2 nhóm nguồn khác mục đích, KHÔNG gộp làm một:
 * - Ngưỡng đảm bảo chất lượng đầu vào (nguồn 'uit-threshold-2026', công bố 08/07/2026): điều
 *   kiện để được THAM GIA xét tuyển tổng hợp.
 * - Ngưỡng đăng ký minh chứng chứng chỉ quốc tế (nguồn 'uit-certificate-registration-2026',
 *   công bố 20/05/2026): điều kiện để được ĐĂNG KÝ dùng chứng chỉ đó làm hồ sơ — thấp hơn
 *   ngưỡng chất lượng đầu vào, phục vụ mục đích khác (sàng lọc hồ sơ sớm).
 */
export const TKVM_PROGRAM_IDS = ['thiet-ke-vi-mach', 'thiet-ke-vi-mach-ta'];

export const UIT_THPT_THRESHOLD = {
  default: 22,
  thietKeViMach: { total: 23, math: 7.5 },
};

export const UIT_DGNL_THRESHOLD = {
  default: 717,
  thietKeViMach: { total: 761, math: 195 },
};

export const UIT_CERTIFICATE_REGISTRATION_THRESHOLD = {
  sat: 1080,
  act: 21,
  aLevelPum: 67,
  ib: 29,
};

export const UIT_CERTIFICATE_QUALITY_THRESHOLD = {
  sat: 1170,
  act: 26,
  aLevelPum: 70,
  ib: 30,
};
