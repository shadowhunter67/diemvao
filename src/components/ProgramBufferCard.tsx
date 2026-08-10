import { useId } from 'react';
import { BUFFER_OPTIONS } from '../schools/hcmut/programs';
import type { AdmissionCutoff, HcmutProgram } from '../schools/hcmut/types/programs';

interface ProgramBufferCardProps {
  selectedProgram: HcmutProgram | null;
  latestCutoff: AdmissionCutoff | undefined;
  buffer: number;
  onBufferChange: (buffer: number) => void;
  effectiveTarget: number | null;
  onUseAsTarget: (score: number) => void;
}

export function ProgramBufferCard({
  selectedProgram,
  latestCutoff,
  buffer,
  onBufferChange,
  effectiveTarget,
  onUseAsTarget,
}: ProgramBufferCardProps) {
  const bufferId = useId();

  if (!selectedProgram || !latestCutoff) return null;

  return (
    <section className="rounded-2xl bg-surface-soft p-6 sm:p-8">
      <label htmlFor={bufferId} className="text-sm font-medium text-ink">
        Biên mục tiêu
      </label>
      <select
        id={bufferId}
        value={buffer}
        onChange={(e) => onBufferChange(Number(e.target.value))}
        className="mt-2 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
      >
        {BUFFER_OPTIONS.map((option) => (
          <option key={option} value={option}>
            +{option.toFixed(2)}
          </option>
        ))}
      </select>

      {effectiveTarget !== null && (
        <dl className="mt-3 flex flex-col gap-1.5 rounded-lg bg-surface p-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Điểm chuẩn tham khảo</dt>
            <dd className="font-medium text-ink">{latestCutoff.score.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Biên mục tiêu</dt>
            <dd className="font-medium text-ink">+{buffer.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-ink/10 pt-1.5">
            <dt className="font-semibold text-ink">Mục tiêu mô phỏng</dt>
            <dd className="font-semibold text-ink">{effectiveTarget.toFixed(2)}</dd>
          </div>
        </dl>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Biên mục tiêu chỉ dùng để mô phỏng; điểm chuẩn thực tế có thể thay đổi mỗi năm.
      </p>

      {effectiveTarget !== null && effectiveTarget !== latestCutoff.score && (
        <button
          type="button"
          onClick={() => onUseAsTarget(effectiveTarget)}
          className="mt-2 self-start rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          Dùng mục tiêu mô phỏng ({effectiveTarget.toFixed(2)}) làm mục tiêu
        </button>
      )}
    </section>
  );
}
