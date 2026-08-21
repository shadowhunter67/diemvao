import { useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { createApplicantProfileStore } from './applicantProfileStore';
import { loadApplicantProfile } from './applicantProfileStorage';
import { ApplicantProfileContext, type ApplicantProfileContextValue } from './applicantProfileContextCore';

/**
 * Đặt ở App.tsx (mount 1 lần, sống suốt phiên SPA — không unmount khi chuyển route giữa các
 * trường) — nên state ở đây KHÔNG bị mất khi user rời `/hcmut` sang `/ueh` (khác hẳn state cục bộ
 * trong `HcmutCalculatorPage`, vốn unmount/mất khi đổi route). Persist qua localStorage để refresh
 * trang cũng không mất factual profile.
 *
 * Logic thật nằm trong `applicantProfileStore.ts` (thuần JS, không phụ thuộc React, không còn race
 * condition ref/state — xem docstring ở đó). Component này chỉ wire store đó vào React qua
 * `useSyncExternalStore` — API chuẩn của React cho state ngoài React cần đọc đồng bộ + subscribe.
 */
export function ApplicantProfileProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createApplicantProfileStore> | undefined>(undefined);
  if (storeRef.current === undefined) {
    storeRef.current = createApplicantProfileStore(loadApplicantProfile());
  }
  const store = storeRef.current;

  const profile = useSyncExternalStore(store.subscribe, store.getProfile);

  const value = useMemo<ApplicantProfileContextValue>(
    () => ({
      profile,
      updateProfile: store.updateProfile,
      updateVactComponents: store.updateVactComponents,
      updateVactTotal: store.updateVactTotal,
      clearProfile: store.clearProfile,
    }),
    [profile, store]
  );

  return <ApplicantProfileContext.Provider value={value}>{children}</ApplicantProfileContext.Provider>;
}
