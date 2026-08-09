import { useState } from 'react';
import { X } from 'lucide-react';
import { calculateGap, getLatestComparableCutoff, getProgramById } from '../lib/programs';
import type { AdmissionCutoff, HcmutProgram } from '../types/programs';

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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Lịch sử điểm chuẩn &amp; so sánh ngành</h2>

      {selectedProgram ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-700">{selectedProgram.name}</h3>
          {historicalCutoffs.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">Chưa có dữ liệu điểm chuẩn xác minh cho ngành này.</p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <caption className="sr-only">Lịch sử điểm chuẩn ngành {selectedProgram.name}</caption>
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
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
                      <tr key={cutoff.year} className="border-b border-slate-100 last:border-0">
                        <td className="py-2 pr-3 text-slate-700">{cutoff.year}</td>
                        <td className="py-2 pr-3 font-medium text-slate-800">{cutoff.score.toFixed(2)}</td>
                        <td className="py-2 pr-3 text-slate-700">
                          {currentFinalScore === null ? '—' : currentFinalScore.toFixed(2)}
                        </td>
                        <td className="py-2 text-slate-700">{gap === null ? '—' : gapLabel(gap)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {historicalCutoffs.some((c) => c.note) && (
                <ul className="mt-2 flex flex-col gap-1 text-xs text-amber-700">
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
        <p className="mt-4 text-sm text-slate-400">Chọn một ngành ở mục "Ngành mục tiêu" để xem lịch sử điểm chuẩn.</p>
      )}

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-700">So sánh ngành đã chọn ({comparisonRows.length}/3)</h3>
          {comparisonRows.length > 1 && (
            <label className="flex items-center gap-2 text-xs text-slate-500">
              Sắp xếp
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
          <p className="mt-2 text-sm text-slate-400">
            Chưa pin ngành nào. Bấm "Thêm vào so sánh" ở mục Ngành mục tiêu để so sánh tối đa 3 ngành.
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <caption className="sr-only">Bảng so sánh điểm chuẩn các ngành đã pin</caption>
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
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
                    <tr key={program.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 pr-3 text-slate-800">
                        {program.name}
                        {program.group ? <span className="block text-xs text-slate-400">{program.group}</span> : null}
                      </td>
                      <td className="py-2 pr-3 font-medium text-slate-800">
                        {cutoff ? `${cutoff.score.toFixed(2)} (${cutoff.year})` : 'Chưa có dữ liệu'}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">{gap === null ? '—' : gapLabel(gap)}</td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => onRemoveComparison(program.id)}
                          aria-label={`Bỏ ${program.name} khỏi so sánh`}
                          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
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

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        Điểm chuẩn các năm chỉ mang tính tham khảo. Mức điểm năm sau có thể thay đổi do chỉ tiêu, độ khó kỳ thi, số
        lượng thí sinh và chính sách tuyển sinh.
      </p>
    </section>
  );
}
