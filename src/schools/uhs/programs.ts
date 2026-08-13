export interface UhsProgram {
  id: string;
  name: string;
  combinations: readonly string[];
  hasSpecificThreshold: boolean;
}

/** Nguồn `uhs-info-2026`. Ngưỡng ≥20/30 hoặc từng môn ≥8.5/10 CHỈ nêu rõ cho Y khoa/Dược — 3
 * ngành còn lại chưa có số cụ thể trong nguồn đã đọc (xem `knowledgeGaps.ts`). */
export const UHS_PROGRAMS: UhsProgram[] = [
  { id: 'medicine', name: 'Y khoa', combinations: ['B00', 'A02'], hasSpecificThreshold: true },
  { id: 'pharmacy', name: 'Dược học', combinations: ['B00', 'A00', 'A02'], hasSpecificThreshold: true },
  { id: 'dentistry', name: 'Răng Hàm Mặt', combinations: ['B00', 'A00', 'A02'], hasSpecificThreshold: false },
  { id: 'traditional-medicine', name: 'Y học cổ truyền', combinations: ['B00', 'A00', 'A02'], hasSpecificThreshold: false },
  { id: 'nursing', name: 'Điều dưỡng', combinations: ['B00', 'A00', 'A02'], hasSpecificThreshold: false },
];
