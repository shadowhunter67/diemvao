/**
 * Ngưỡng đầu vào HIU 2026 (Đại học Quốc tế Hồng Bàng). Nhóm ngành enum ổn định, không so khớp
 * substring tên ngành — cùng pattern `HubProgramGroup`/`CtuProgramGroup`/`TdmuProgramGroup`. Danh
 * mục ngành đầy đủ → nhóm chưa import (`hiu-program-catalog-not-imported`); caller tự chọn group.
 *
 * - `standard`: phần lớn ngành (bao gồm Kỹ thuật Y sinh, Công nghệ thẩm mỹ, Dinh dưỡng, Y tế công
 *   cộng — nguồn xác nhận các ngành này vẫn dùng ngưỡng chung, không thuộc nhóm cấp phép hành nghề).
 * - `healthLicenseOrLaw`: Luật, Luật Kinh tế, Y khoa, Y học cổ truyền, Răng Hàm Mặt, Dược học, Kỹ
 *   thuật xét nghiệm y học, Kỹ thuật hình ảnh y học, Kỹ thuật phục hồi chức năng, Kỹ thuật Y sinh
 *   (bản danh sách gốc), Điều dưỡng, Hộ sinh — ngưỡng thi TN THPT của nhóm này do Bộ GD&ĐT quy
 *   định, KHÔNG có số cụ thể trong nguồn (`hiu-health-license-law-threshold-not-found`).
 * - `medicineDentistryLaw`/`traditionalMedicinePharmacy`: dùng riêng cho ngưỡng ĐGNL ĐHQG-HCM (nhóm
 *   phân loại khác với `healthLicenseOrLaw` — nguồn phân 3 mức 650/700/675, không phải 2 mức).
 */
export type HiuThptExamGroup = 'standard' | 'healthLicenseOrLaw';
export type HiuVactGroup = 'standard' | 'medicineDentistryLaw' | 'traditionalMedicinePharmacy';

const THPT_GROUP_LABELS: Record<HiuThptExamGroup, string> = {
  standard: 'phần lớn ngành (bao gồm Kỹ thuật Y sinh, Công nghệ thẩm mỹ, Dinh dưỡng, Y tế công cộng)',
  healthLicenseOrLaw: 'nhóm pháp luật (Luật, Luật Kinh tế) và nhóm sức khỏe có cấp phép hành nghề (Y khoa, Y học cổ truyền, Răng Hàm Mặt, Dược học, Kỹ thuật xét nghiệm y học, Kỹ thuật hình ảnh y học, Kỹ thuật phục hồi chức năng, Điều dưỡng, Hộ sinh)',
};

const VACT_GROUP_LABELS: Record<HiuVactGroup, string> = {
  standard: 'phần lớn ngành',
  medicineDentistryLaw: 'Y khoa, Răng - Hàm - Mặt, Luật, Luật Kinh tế',
  traditionalMedicinePharmacy: 'Y học cổ truyền, Dược học',
};

export const HIU_THPT_EXAM_STANDARD_THRESHOLD_30 = 15;
export const HIU_VACT_THRESHOLD_1200: Record<HiuVactGroup, number> = {
  standard: 650,
  medicineDentistryLaw: 700,
  traditionalMedicinePharmacy: 675,
};

export interface HiuEligibilityResult {
  /** `undefined` = chưa đủ thông tin để kết luận (nhóm chưa có ngưỡng công bố). */
  pass: boolean | undefined;
  requiredText: string;
}

/** Phương thức thi TN THPT — chỉ nhóm `standard` có ngưỡng cụ thể (15/30). Nhóm
 * `healthLicenseOrLaw` trả `undefined` (ngưỡng do Bộ GD&ĐT quy định, chưa có số trong nguồn). */
export function checkHiuThptExamThreshold(totalScore30: number, group: HiuThptExamGroup): HiuEligibilityResult {
  if (group === 'healthLicenseOrLaw') {
    return {
      pass: undefined,
      requiredText: `Ngưỡng đầu vào cho ${THPT_GROUP_LABELS.healthLicenseOrLaw} áp dụng theo quy định riêng của Bộ Giáo dục và Đào tạo — nguồn HIU không nêu con số cụ thể, chưa kiểm tra được.`,
    };
  }
  return {
    pass: totalScore30 >= HIU_THPT_EXAM_STANDARD_THRESHOLD_30,
    requiredText: `Tổng điểm 3 môn thi TN THPT theo tổ hợp xét tuyển ≥ ${HIU_THPT_EXAM_STANDARD_THRESHOLD_30} (thang 30) — áp dụng ${THPT_GROUP_LABELS.standard}.`,
  };
}

/** Phương thức ĐGNL ĐHQG-HCM — điểm thô thang 1200, khớp trực tiếp
 * `ApplicantProfile.exams.vact.total`. Cả 3 nhóm đều có ngưỡng công bố. */
export function checkHiuVactThreshold(vactTotal1200: number, group: HiuVactGroup): HiuEligibilityResult {
  const threshold = HIU_VACT_THRESHOLD_1200[group];
  return {
    pass: vactTotal1200 >= threshold,
    requiredText: `Điểm thi ĐGNL ĐHQG-HCM ≥ ${threshold} (thang 1200) — áp dụng ${VACT_GROUP_LABELS[group]}.`,
  };
}

export { THPT_GROUP_LABELS as HIU_THPT_EXAM_GROUP_LABELS, VACT_GROUP_LABELS as HIU_VACT_GROUP_LABELS };
