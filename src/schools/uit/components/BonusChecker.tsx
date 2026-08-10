import { useState } from 'react';
import { Award } from 'lucide-react';
import { UIT_BONUS_CATEGORIES, UIT_BONUS_OVERALL_CAP, type UitBonusCategoryId } from '../data/bonus';
import { calculateUitBonus } from '../bonus';

export function BonusChecker() {
  const [selected, setSelected] = useState<UitBonusCategoryId[]>([]);

  function toggle(id: UitBonusCategoryId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  const total = calculateUitBonus(selected);

  return (
    <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Award size={20} className="text-accent" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-ink">Điểm cộng của bạn</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Chọn các nhóm bạn đạt điều kiện — điểm cộng chính xác theo bảng công bố, tổng tối đa {UIT_BONUS_OVERALL_CAP}
        /100.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {UIT_BONUS_CATEGORIES.map((category) => {
          const checked = selected.includes(category.id);
          return (
            <label
              key={category.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                checked ? 'border-accent/40 bg-accent/10' : 'border-ink/10 bg-surface hover:bg-ink/5'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(category.id)}
                className="mt-0.5 size-4 shrink-0 accent-accent"
              />
              <span>
                <span className="flex items-center gap-2">
                  <span className={`font-medium ${checked ? 'text-primary' : 'text-ink'}`}>{category.label}</span>
                  <span className="text-xs text-muted">tối đa {category.maxPoints}</span>
                </span>
                <span className="mt-0.5 block text-xs text-muted">{category.description}</span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-surface p-4">
        <span className="text-sm text-muted">Điểm cộng ước tính</span>
        <span className="text-2xl font-bold text-primary">
          {total.toFixed(0)} / {UIT_BONUS_OVERALL_CAP}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Kết quả dựa trên bảng điểm cộng công bố chính thức 2026 — vẫn cần nộp minh chứng đúng hạn để được xét thật.
      </p>
    </section>
  );
}
