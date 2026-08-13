import type { KnowledgeGap } from './knowledgeStatus';
import type { SchoolCapabilities } from './schoolModule';

/**
 * Capability ở mức PHƯƠNG THỨC xét tuyển — chi tiết hơn `SchoolCapabilities` (school-level).
 * Một trường có thể có nhiều phương thức, mỗi phương thức capability khác nhau (vd HCMUT có thể
 * có "Xét tuyển tổng hợp" exact + "Tuyển thẳng" chỉ eligibility). Additive: KHÔNG xóa
 * `SchoolCapabilities` — trường hợp 1-trường-1-phương thức hiện tại (HCMUT, UEH), giữ cả 2 song
 * song, `SchoolCapabilities` coi như tóm tắt cấp trường, `AdmissionMethodDescriptor` là chi tiết.
 *
 * Batch 6: đây là nơi UniscoreVN nói được "trường/phương thức này hiện tính được đến đâu" —
 * `AdmissionMethodDescriptor` là truth chi tiết, `SchoolCapabilities` chỉ là summary/aggregation
 * (xem `aggregateSchoolCapabilities` bên dưới). Descriptor KHÔNG chứa công thức/implementation —
 * chỉ mô tả method tồn tại, hỗ trợ gì, và trạng thái tri thức ra sao.
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
  /** Optional — trường có 1 module duy nhất (hiện tại: mọi trường) suy được từ context đăng ký,
   * nhưng khai báo tường minh giúp descriptor tự đứng độc lập được khi dùng ngoài registry (vd
   * test, aggregation) mà không cần biết nó thuộc mảng nào. */
  schoolId?: string;
  name: string;
  year: number;
  applicantTypes?: string[];
  capabilities: AdmissionMethodCapabilities;
  /** Những gì đang CHẶN `exactCalculator` (nếu false) — machine-readable, cùng nguồn dữ liệu UI
   * dùng để hiện "chưa tính được: ...", không hard-code lại text ở component (xem
   * `schools/uel/knowledgeGaps.ts`/`schools/ueh/knowledgeGaps.ts`/`schools/uit/knowledgeGaps.ts`). */
  knowledgeGaps?: KnowledgeGap[];
}

/**
 * School-level capability CHỈ được nói mạnh hơn method-level nếu có method thật chứng minh — hàm
 * này derive `SchoolCapabilities` (phần overlap: eligibility/scoreConversion/exactCalculator) từ
 * danh sách method thật bằng OR. KHÔNG derive `admissionInfo`/`programs`/`cutoffs` (không thuộc
 * `AdmissionMethodCapabilities` — đó là capability ở mức trang/dataset, không phải phương thức
 * tính điểm) — 2 field đó vẫn khai báo tay ở `SchoolModule.capabilities`. `bonus`/`priority` cũng
 * không có mặt trong `SchoolCapabilities` (chưa có consumer school-level nào cần tới cấp độ chi
 * tiết đó) nên không derive.
 */
export function aggregateSchoolCapabilities(
  methods: AdmissionMethodDescriptor[]
): Pick<SchoolCapabilities, 'eligibility' | 'scoreConversion' | 'exactCalculator'> {
  return {
    eligibility: methods.some((m) => m.capabilities.eligibility),
    scoreConversion: methods.some((m) => m.capabilities.scoreConversion),
    exactCalculator: methods.some((m) => m.capabilities.exactCalculator),
  };
}
