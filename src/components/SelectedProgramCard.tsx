import { GraduationCap } from 'lucide-react';
import type { AdmissionCutoff, HcmutProgram } from '../schools/hcmut/types/programs';

interface SelectedProgramCardProps {
  selectedProgram: HcmutProgram | null;
  latestCutoff: AdmissionCutoff | undefined;
  gap: number | null;
  currentFinalScore: number | null;
  onUseAsTarget: (score: number) => void;
}

function gapStatusText(gap: number): string {
  if (gap > 0) return `Cao hơn mức tham khảo ${Math.abs(gap).toFixed(2)} điểm`;
  if (gap < 0) return `Thấp hơn mức tham khảo ${Math.abs(gap).toFixed(2)} điểm`;
  return 'Bằng mức tham khảo';
}

export function SelectedProgramCard({
  selectedProgram,
  latestCutoff,
  gap,
  currentFinalScore,
  onUseAsTarget,
}: SelectedProgramCardProps) {
  return (
    <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
      <div className="flex items-center gap-2">
        <GraduationCap size={18} className="text-accent" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Ngành mục tiêu</span>
      </div>

      {!selectedProgram ? (
        <div className="mt-4 flex min-h-[140px] flex-col justify-center gap-3">
          <p className="text-lg font-semibold text-ink">Chọn ngành mục tiêu</p>
          <a
            href="#program-picker"
            className="inline-flex w-fit items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            Chọn ngành
          </a>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-ink">{selectedProgram.name}</h3>

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Điểm tham khảo{latestCutoff ? ` (${latestCutoff.year})` : ''}</dt>
              <dd className="font-medium text-ink">{latestCutoff ? latestCutoff.score.toFixed(2) : 'Chưa có dữ liệu'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Điểm hiện tại</dt>
              <dd className="font-medium text-ink">{currentFinalScore === null ? '—' : currentFinalScore.toFixed(2)}</dd>
            </div>
            {gap !== null && (
              <div className="flex items-center justify-between border-t border-ink/10 pt-2">
                <dt className="font-semibold text-ink">Chênh lệch</dt>
                <dd
                  className={`font-semibold ${gap >= 0 ? 'text-success' : 'text-warning'}`}
                >
                  {gap >= 0 ? '+' : ''}
                  {gap.toFixed(2)}
                </dd>
              </div>
            )}
          </dl>

          {gap !== null && <p className="text-sm text-muted">{gapStatusText(gap)}</p>}
          {latestCutoff?.note && <p className="text-xs text-warning">{latestCutoff.note}</p>}

          <div className="flex flex-wrap gap-2">
            {latestCutoff && (
              <button
                type="button"
                onClick={() => onUseAsTarget(latestCutoff.score)}
                className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                Dùng {latestCutoff.score.toFixed(2)} làm mục tiêu
              </button>
            )}
            <a
              href="#program-picker"
              className="rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-soft"
            >
              Đổi ngành
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
