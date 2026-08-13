import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ApplicantProfile } from './applicantProfile';
import { clearStoredApplicantProfile, loadApplicantProfile, saveApplicantProfile } from './applicantProfileStorage';
import { reconcileVactFromComponents, reconcileVactFromTotal } from './vactProfile';
import { ApplicantProfileContext, type ApplicantProfileContextValue } from './applicantProfileContextCore';

/**
 * Đặt ở App.tsx (mount 1 lần, sống suốt phiên SPA — không unmount khi chuyển route giữa các
 * trường) — nên state ở đây KHÔNG bị mất khi user rời `/hcmut` sang `/ueh` (khác hẳn state cục bộ
 * trong `HcmutCalculatorPage`, vốn unmount/mất khi đổi route). Persist qua localStorage để refresh
 * trang cũng không mất factual profile.
 */
export function ApplicantProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ApplicantProfile>(loadApplicantProfile);

  useEffect(() => {
    saveApplicantProfile(profile);
  }, [profile]);

  // Giữ bản mới nhất của `profile` để `updateVactTotal` đọc SYNCHRONOUSLY (cần trả về
  // `componentsCleared` ngay cho caller — không thể chờ vào bên trong `setProfile` updater vì
  // updater không đảm bảo chạy đồng bộ trước khi hàm gọi nó return, xem batch 5 workstream D).
  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // Ổn định qua mọi lần render (không phụ thuộc `profile`) — nếu không, mỗi lần profile đổi sẽ
  // tạo ra một `updateProfile` mới, và effect nào có `updateProfile` trong dependency array (vd
  // HcmutCalculatorPage ghi profile mỗi khi form đổi) sẽ refire vô hạn dù input thật không đổi.
  const updateProfile = useCallback<ApplicantProfileContextValue['updateProfile']>((updater) => {
    setProfile((current) => updater(current));
  }, []);

  const updateVactComponents = useCallback<ApplicantProfileContextValue['updateVactComponents']>((components) => {
    setProfile((current) => ({
      ...current,
      exams: { ...current.exams, vact: reconcileVactFromComponents(current.exams?.vact, components) },
    }));
  }, []);

  const updateVactTotal = useCallback<ApplicantProfileContextValue['updateVactTotal']>((total, source) => {
    const { profile: nextVact, componentsCleared } = reconcileVactFromTotal(profileRef.current.exams?.vact, total, source);
    setProfile((current) => ({ ...current, exams: { ...current.exams, vact: nextVact } }));
    return { componentsCleared };
  }, []);

  const clearProfile = useCallback<ApplicantProfileContextValue['clearProfile']>(() => {
    // Batch 7 — xóa tường minh cả key hiện tại lẫn legacy (tombstone, xem
    // `applicantProfileStorage.ts`) TRƯỚC khi set state rỗng — effect `saveApplicantProfile(profile)`
    // bên dưới vẫn sẽ ghi lại `{}` vào key hiện tại ngay sau đó (không phải bug, chỉ là idempotent),
    // nhưng legacy key phải mất hẳn để không "sống lại" ở lần đọc kế tiếp.
    clearStoredApplicantProfile();
    setProfile({});
  }, []);

  const value = useMemo<ApplicantProfileContextValue>(
    () => ({ profile, updateProfile, updateVactComponents, updateVactTotal, clearProfile }),
    [profile, updateProfile, updateVactComponents, updateVactTotal, clearProfile]
  );

  return <ApplicantProfileContext.Provider value={value}>{children}</ApplicantProfileContext.Provider>;
}
