import type { AdmissionResult } from './types/admission';

/**
 * Nhãn hiển thị cho `result.dgnl` tùy `abilitySource` — dùng chung mọi nơi cần hiển thị (batch 2
 * CLAUDE.md ghi rõ tránh duplicate conditional wording nhiều nơi). `abilitySource` undefined
 * (kết quả cũ trước batch 2, hoặc test chưa set) mặc định hiểu là ĐGNL thật — đúng hành vi trước
 * khi field này tồn tại.
 */
export function getAbilityScoreLabel(result: Pick<AdmissionResult, 'abilitySource'>): string {
  return result.abilitySource === 'thpt-derived' ? 'Điểm năng lực (quy đổi từ THPT)' : 'Chuẩn hóa ĐGNL';
}

/** Nhãn ngắn gọn hơn, dùng ở nơi không có chỗ cho câu dài (vd dòng phụ dưới điểm). */
export function getAbilityScoreSourceCaption(result: Pick<AdmissionResult, 'abilitySource'>): string {
  return result.abilitySource === 'thpt-derived'
    ? 'Từ quy đổi theo phương án HCMUT 2026'
    : 'Từ ĐGNL ĐHQG-HCM 2026';
}
