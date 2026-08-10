import { useState } from 'react';
import { X } from 'lucide-react';
import { MAX_COMPARISON_PINS, calculateGap, getLatestComparableCutoff, getProgramById } from '../schools/hcmut/programs';
import type { AdmissionCutoff, HcmutProgram } from '../schools/hcmut/types/programs';

type SortOption = 'score-desc' | 'score-asc' | 'name-asc';

const SORT_LABELS: Record<SortOption, string> = {
  'score-desc': 'Điểm chuẩn cao → thấp',
  'score-asc': 'Điểm chuẩn thấp → cao',
  'name-asc': 'Tên A → Z',
};

interface ProgramHistoryCompareProps {
  selectedProgram: HcmutProgram | null;
  historicalCutoffs: AdmissionCutoff[];
  currentFinalScore: number | null;
  comparisonProgramIds: string[];
  onRemoveComparison: (programId: string) => void;
}

function gapLabel(gap: number): string {
  if (gap > 0) return `Cao hơn ${gap.toFixed(2)}`;
  if (gap < 0) return `Thấp hơn ${Math.abs(gap).toFixed(2)}`;
  return 'Bằng';
}

export function ProgramHistoryCompare({
  selectedProgram,
  historicalCutoffs,
  currentFinalScore,
  comparisonProgramIds,
  onRemoveComparison,
}: ProgramHistoryCompareProps) {
  const [sort, setSort] = useState<SortOption>('score-desc');

  const comparisonRows = comparisonProgramIds
    .map((id) => {
      const program = getProgramById(id);
      const cutoff = getLatestComparableCutoff(id);
      if (!program) return null;
      return { program, cutoff };
    })
    .filter((row): row is { program: HcmutProgram; cutoff: AdmissionCutoff | undefined } => row !== null)
    .sort((a, b) => {
      if (sort === 'name-asc') return a.program.name.localeCompare(b.program.name, 'vi');
      const scoreA = a.cutoff?.score ?? -Infinity;
      const scoreB = b.cutoff?.score ?? -Infinity;
      return sort === 'score-desc' ? scoreB - scoreA : scoreA - scoreB;
    });

  return (
    <section id="history-section" className="rounded-2xl bg-surface-soft p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-ink">Lịch sử điểm chuẩn &amp; so sánh ngành</h2>

      {selectedProgram ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink">{selectedProgram.name}</h3>
          {historicalCutoffs.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Chưa có dữ liệu điểm chuẩn xác minh cho ngành này.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <caption className="sr-only">Lịch sử điểm chuẩn ngành {selectedProgram.name}</caption>
                <thead>
                  <tr className="text-left text-xs font-medium text-muted">
                    <th scope="col" className="py-2 pr-3">
                      Năm
                    </th>
                    <th scope="col" className="py-2 pr-3">
                      Điểm chuẩn
                    </th>
                    <th scope="col" className="py-2 pr-3">
                      Điểm của bạn
                    </th>
                    <th scope="col" className="py-2">
                      Chênh lệch
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historicalCutoffs.map((cutoff) => {
                    const gap = currentFinalScore !== null ? calculateGap(currentFinalScore, cutoff.score) : null;
                    return (
                      <tr key={cutoff.year} className="border-t border-ink/5">
                        <td className="py-2.5 pr-3">
                          <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink">
                            {cutoff.year}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 font-medium text-ink">{cutoff.score.toFixed(2)}</td>
                        <td className="py-2.5 pr-3 text-ink">
                          {currentFinalScore === null ? '—' : currentFinalScore.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-ink">{gap === null ? '—' : gapLabel(gap)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {historicalCutoffs.some((c) => c.note) && (
                <ul className="mt-2 flex flex-col gap-1 text-xs text-warning">
                  {historicalCutoffs
                    .filter((c) => c.note)
                    .map((c) => (
                      <li key={c.year}>
                        {c.year}: {c.note}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Chọn một ngành ở mục "Chọn ngành" để xem lịch sử điểm chuẩn.</p>
      )}

      <div className="mt-8 border-t border-ink/10 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">
            So sánh ngành đã chọn ({comparisonRows.length}/{MAX_COMPARISON_PINS})
          </h3>
          {comparisonRows.length > 1 && (
            <label className="flex items-center gap-2 text-xs text-muted">
              Sắp xếp
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="rounded-md border border-ink/10 bg-surface px-2 py-1 text-xs text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <option key={option} value={option}>
                    {SORT_LABELS[option]}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {comparisonRows.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Chưa pin ngành nào. Bấm "Thêm vào so sánh" ở mục Chọn ngành để so sánh tối đa {MAX_COMPARISON_PINS} ngành.
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <caption className="sr-only">Bảng so sánh điểm chuẩn các ngành đã pin</caption>
              <thead>
                <tr className="text-left text-xs font-medium text-muted">
                  <th scope="col" className="py-2 pr-3">
                    Ngành
                  </th>
                  <th scope="col" className="py-2 pr-3">
                    Điểm chuẩn gần nhất
                  </th>
                  <th scope="col" className="py-2 pr-3">
                    Chênh lệch
                  </th>
                  <th scope="col" className="py-2">
                    <span className="sr-only">Bỏ khỏi so sánh</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(({ program, cutoff }) => {
                  const gap =
                    cutoff && currentFinalScore !== null ? calculateGap(currentFinalScore, cutoff.score) : null;
                  return (
                    <tr key={program.id} className="border-t border-ink/5">
                      <td className="py-2.5 pr-3 text-ink">
                        {program.name}
                        {program.group ? <span className="block text-xs text-muted">{program.group}</span> : null}
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-ink">
                        {cutoff ? `${cutoff.score.toFixed(2)} (${cutoff.year})` : 'Chưa có dữ liệu'}
                      </td>
                      <td className="py-2.5 pr-3 text-ink">{gap === null ? '—' : gapLabel(gap)}</td>
                      <td className="py-2.5">
                        <button
                          type="button"
                          onClick={() => onRemoveComparison(program.id)}
                          aria-label={`Bỏ ${program.name} khỏi so sánh`}
                          className="rounded-md p-1 text-muted transition hover:bg-ink/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
                        >
                          <X size={14} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Điểm chuẩn các năm chỉ mang tính tham khảo. Mức điểm năm sau có thể thay đổi do chỉ tiêu, độ khó kỳ thi, số
        lượng thí sinh và chính sách tuyển sinh.
      </p>
    </section>
  );
}
