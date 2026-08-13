import { createContext, useContext } from 'react';
import type { ApplicantProfile } from './applicantProfile';
import type { VactComponents, VactValueSource } from './vactProfile';

/**
 * Batch 6, workstream X — tách khỏi `ApplicantProfileContext.tsx` để file đó chỉ còn export
 * component (`ApplicantProfileProvider`), theo đúng gợi ý oxlint `react(only-export-components)`
 * (trước đây file cũ export cả component lẫn hook `useApplicantProfile`, mất fast-refresh). File
 * này KHÔNG export component nào — chỉ context object, type, và hook — nên không bị rule đó áp.
 */
export interface ApplicantProfileContextValue {
  profile: ApplicantProfile;
  /** `updater` nhận profile hiện tại, trả về profile mới — cùng pattern functional update như
   * `setState`. Trường gọi hàm này để GHI factual data (vd `buildApplicantProfileFromHcmutForm`
   * trả về profile mới, không phải object rời để merge nông vô điều kiện — tránh field lạ bị
   * ghi đè sai bởi merge nông không kiểm soát). Dùng cho field KHÔNG có invariant xung đột (thpt/
   * transcript) — với `exams.vact`, dùng `updateVactComponents`/`updateVactTotal` bên dưới thay vì
   * gọi `updateProfile` trực tiếp, để invariant total/components luôn đi qua
   * `core/vactProfile.ts` ở một chỗ duy nhất (batch 5, workstream D). */
  updateProfile: (updater: (current: ApplicantProfile) => ApplicantProfile) => void;
  /** Ghi 1 hoặc nhiều component ĐGNL (merge nông vào components hiện có) — tự tính lại `total` nếu
   * đủ 4 phần (INVARIANT 1, `reconcileVactFromComponents`). Dùng khi user sửa từng phần thi. */
  updateVactComponents: (components: VactComponents) => void;
  /** Ghi `total` ĐGNL trực tiếp (không qua components, vd UEH). Trả về `componentsCleared` để nơi
   * gọi hiện UX rõ ràng nếu components cũ bị xóa do xung đột (workstream G/J) — KHÔNG bao giờ âm
   * thầm giữ cả total lẫn components xung đột nhau. */
  updateVactTotal: (total: number, source: Exclude<VactValueSource, 'derived-from-components'>) => { componentsCleared: boolean };
  /** Xóa toàn bộ hồ sơ điểm dùng chung (batch 6, workstream P) — KHÔNG đụng tới state/localStorage
   * riêng của từng trường (form HCMUT, mode UI...). Trường vẫn giữ nguyên input cục bộ của nó sau
   * khi gọi hàm này; chỉ `exams`/`thpt`/`transcript`/`certificates`/`priority`/`graduationYear`
   * dùng chung bị xóa. Phân biệt rõ với "Đặt lại form trường X" (chỉ xóa state riêng trường đó). */
  clearProfile: () => void;
}

export const ApplicantProfileContext = createContext<ApplicantProfileContextValue | null>(null);

export function useApplicantProfile(): ApplicantProfileContextValue {
  const context = useContext(ApplicantProfileContext);
  if (!context) {
    throw new Error('useApplicantProfile phải được gọi bên trong ApplicantProfileProvider (xem App.tsx).');
  }
  return context;
}
