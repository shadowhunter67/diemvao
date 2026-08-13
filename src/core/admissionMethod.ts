/**
 * Capability ở mức PHƯƠNG THỨC xét tuyển — chi tiết hơn `SchoolCapabilities` (school-level).
 * Một trường có thể có nhiều phương thức, mỗi phương thức capability khác nhau (vd HCMUT có thể
 * có "Xét tuyển tổng hợp" exact + "Tuyển thẳng" chỉ eligibility). Additive: KHÔNG xóa
 * `SchoolCapabilities` — trường hợp 1-trường-1-phương thức hiện tại (HCMUT, UEH), giữ cả 2 song
 * song, `SchoolCapabilities` coi như tóm tắt cấp trường, `AdmissionMethodDescriptor` là chi tiết.
 */
export interface AdmissionMethodCapabilities {
  eligibility: boolean;
  scoreConversion: boolean;
  bonus: boolean;
  priority: boolean;
  exactCalculator: boolean;
}

export interface AdmissionMethodDescriptor {
  id: string;
  name: string;
  year: number;
  applicantTypes?: string[];
  capabilities: AdmissionMethodCapabilities;
}
