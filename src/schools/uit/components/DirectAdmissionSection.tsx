import { Route } from 'lucide-react';
import { UIT_DIRECT_ADMISSION_GROUPS, UIT_DIRECT_ADMISSION_NOTES } from '../data/directAdmission';

/** Thuần thông tin — không có input/tính toán, vì đây là route tuyển sinh khác hẳn công thức combined-score. */
export function DirectAdmissionSection() {
  return (
    <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Route size={20} className="text-accent" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-ink">Tuyển thẳng (Điều 8)</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Route tuyển sinh riêng, <strong className="text-ink">không cộng điểm vào công thức xét tuyển tổng hợp</strong>
        . Nếu bạn thuộc một trong các nhóm dưới đây, đây là con đường vào UIT độc lập với điểm cộng/điểm ưu tiên ở
        trên.
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {UIT_DIRECT_ADMISSION_GROUPS.map((group, index) => (
          <li key={index} className="rounded-lg bg-surface p-3 text-sm">
            <p className="text-ink">{group.condition}</p>
            <p className="mt-1 text-xs text-muted">Áp dụng: {group.applicablePrograms}</p>
          </li>
        ))}
      </ul>

      <ul className="mt-4 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted">
        {UIT_DIRECT_ADMISSION_NOTES.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </section>
  );
}
