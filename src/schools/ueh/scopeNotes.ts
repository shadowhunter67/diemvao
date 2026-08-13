/**
 * Ranh giới phạm vi CỐ Ý của exact calculator UEH — khác `KnowledgeGap` (số liệu chính thức còn
 * thiếu). Đây là giới hạn implementation: dữ liệu Đối tượng 2 (SAT/ACT bonus tiers, ngưỡng IELTS)
 * ĐÃ có trong nguồn, nhưng công thức học bạ cho thí sinh tốt nghiệp THPT nước ngoài không theo cấu
 * trúc lớp 10/11/12 Việt Nam nên UniscoreVN chưa map được — không suy đoán.
 */
export const UEH_EXACT_CALCULATOR_SCOPE_NOTE =
  'Calculator chính xác hiện chỉ áp dụng cho Đối tượng 1 (thí sinh tốt nghiệp THPT Việt Nam). Đối tượng 2 (THPT nước ngoài) dùng cấu trúc điểm học bạ khác UniscoreVN chưa hỗ trợ.';
