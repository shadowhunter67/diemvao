import { useState } from 'react';
import { Award } from 'lucide-react';
import { UIT_BONUS_CATEGORIES, UIT_BONUS_OVERALL_CAP, type UitBonusCategoryId } from '../data/bonus';
import { calculateUitBonusEligibility } from '../bonus';

export function BonusChecker() {
  const [selected, setSelected] = useState<UitBonusCategoryId[]>([]);

  function toggle(id: UitBonusCategoryId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  const eligibility = calculateUitBonusEligibility(selected);
  const eligibleCount = eligibility.eligibleCategories.length;

  return (
    <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Award size={20} className="text-accent" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-ink">Điều kiện được xét điểm cộng</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Chọn các nhóm bạn đạt điều kiện — mỗi nhóm có mức trần riêng, tổng điểm cộng theo quy định không vượt quá{' '}
        {UIT_BONUS_OVERALL_CAP}/100.
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

      <div className="mt-4 rounded-lg bg-surface p-4">
        {eligibleCount === 0 ? (
          <p className="text-sm text-muted">Chưa chọn nhóm nào.</p>
        ) : (
          <>
            <p className="text-sm text-ink">
              Bạn thuộc <strong>{eligibleCount}</strong> nhóm có thể được xét điểm cộng.
            </p>
            <p className="mt-1 text-sm text-muted">
              Tổng điểm cộng theo quy định không vượt quá <strong className="text-ink">{eligibility.overallCap}/100</strong>.
            </p>
            <p className="mt-2 text-xs text-muted">
              UniscoreVN chưa có đủ bảng chính thức để xác định số điểm thực nhận — mức trần từng nhóm chỉ là giới hạn
              trên, không phải điểm cộng đảm bảo.
            </p>
          </>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Kết quả trên chỉ phản ánh điều kiện được xét, dựa trên bảng công bố chính thức 2026 — vẫn cần nộp minh chứng
        đúng hạn để hội đồng xét thật.
      </p>
    </section>
  );
}
