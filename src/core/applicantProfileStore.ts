import type { ApplicantProfile } from './applicantProfile';
import { clearStoredApplicantProfile, saveApplicantProfile } from './applicantProfileStorage';
import { reconcileVactFromComponents, reconcileVactFromTotal } from './vactProfile';
import type { VactComponents, VactValueSource } from './vactProfile';

/**
 * Store thuần JS, KHÔNG phụ thuộc React — `profile` là 1 biến closure, nguồn sự thật DUY NHẤT,
 * luôn được cập nhật ĐỒNG BỘ ngay tại lệnh gọi `updateProfile`/`updateVactComponents`/
 * `updateVactTotal`/`clearProfile`. Trước batch này, `ApplicantProfileContext.tsx` giữ 2 nguồn sự
 * thật song song (`useState` + `profileRef`, đồng bộ qua 1 `useEffect` chạy SAU commit) — nếu
 * `updateVactComponents` rồi `updateVactTotal` được gọi liên tiếp trong cùng tick/event (trước khi
 * effect đồng bộ ref kịp chạy), `updateVactTotal` đọc `profileRef.current` trên snapshot CŨ, reconcile
 * sai. Tách logic ra khỏi React hoàn toàn giải quyết triệt để lớp bug này (không còn ref/state nào
 * để lệch pha) — đồng thời cho phép unit test store này KHÔNG cần render React component nào (repo
 * hiện chưa có jsdom/@testing-library/react).
 *
 * `ApplicantProfileContext.tsx` wire store này vào React qua `useSyncExternalStore` (API chuẩn của
 * React cho state ngoài React cần đọc đồng bộ + subscribe reactive — đúng bài toán ở đây, không
 * phải over-engineering).
 */
export interface ApplicantProfileStore {
  getProfile: () => ApplicantProfile;
  subscribe: (listener: () => void) => () => void;
  updateProfile: (updater: (current: ApplicantProfile) => ApplicantProfile) => void;
  updateVactComponents: (components: VactComponents) => void;
  updateVactTotal: (
    total: number,
    source: Exclude<VactValueSource, 'derived-from-components'>
  ) => { componentsCleared: boolean };
  clearProfile: () => void;
}

export function createApplicantProfileStore(initial: ApplicantProfile): ApplicantProfileStore {
  let profile = initial;
  const listeners = new Set<() => void>();

  function commit(next: ApplicantProfile): void {
    profile = next;
    saveApplicantProfile(next);
    for (const listener of listeners) listener();
  }

  return {
    getProfile: () => profile,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    updateProfile(updater) {
      commit(updater(profile));
    },

    updateVactComponents(components) {
      commit({
        ...profile,
        exams: { ...profile.exams, vact: reconcileVactFromComponents(profile.exams?.vact, components) },
      });
    },

    updateVactTotal(total, source) {
      const { profile: nextVact, componentsCleared } = reconcileVactFromTotal(profile.exams?.vact, total, source);
      commit({ ...profile, exams: { ...profile.exams, vact: nextVact } });
      return { componentsCleared };
    },

    clearProfile() {
      // Xóa tường minh cả key hiện tại lẫn legacy (tombstone, xem `applicantProfileStorage.ts`)
      // TRƯỚC khi commit state rỗng — `commit({})` gọi `saveApplicantProfile({})` ngay sau đó vẫn
      // ghi lại `{}` vào key hiện tại (idempotent, không phải bug), nhưng legacy key phải mất hẳn
      // để không "sống lại" ở lần đọc kế tiếp.
      clearStoredApplicantProfile();
      commit({});
    },
  };
}
