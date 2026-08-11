/**
 * Ngưỡng đảm bảo chất lượng đầu vào UEL 2026 (phương thức Xét tuyển Tổng hợp) — nguồn:
 * tuyensinh.uel.edu.vn, thông tin tuyển sinh đại học chính quy 2026 (xem sources.ts, id
 * 'uel-formula-2026'): "Tổng điểm ba môn thi tốt nghiệp THPT tương ứng tổ hợp xét tuyển đạt tối
 * thiểu 50 điểm theo thang điểm 100" — tức Y (điểm THPT đã quy đổi thang 100) ≥ 50.
 */
export const UEL_THPT_QUY_DOI_THRESHOLD = 50;

/**
 * Điểm ưu tiên khu vực, thang 100 — nguồn cùng thông báo trên. CHỈ dùng để tra cứu/hiển thị
 * tham khảo, KHÔNG wire vào một "điểm cuối cùng": UniScore chưa xác nhận được UEL có áp quy tắc
 * giảm dần điểm ưu tiên khi tổng điểm đạt ngưỡng cao (như HCMUT) hay không — chưa tìm thấy nguồn
 * nói rõ, không suy đoán để tránh tính sai cho thí sinh có điểm cao.
 */
export const UEL_PRIORITY_BY_ZONE_SCALE_100 = {
  kv1: 9.17,
  kv2Nt: 8.33,
  kv2: 7.5,
  kv3: 6.67,
} as const;

/**
 * Điểm cộng trường THPT ưu tiên ĐHQG-HCM (149 trường, danh sách chung dùng ở nhiều trường thành
 * viên) — nguồn xác nhận mức cố định +5/100, tốt nghiệp đúng năm 2026.
 */
export const UEL_PRIORITY_SCHOOL_BONUS = 5;

/** Cap tổng điểm cộng — nguồn: "Điểm cộng, điểm thưởng không vượt quá 10% điểm tối đa thang điểm xét tuyển". */
export const UEL_BONUS_OVERALL_CAP = 10;
