import { useId, useMemo, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { BUFFER_OPTIONS } from '../lib/programs';
import type { AdmissionCutoff } from '../types/programs';
import type { HcmutProgram } from '../types/programs';

interface ProgramSectionProps {
  programs: HcmutProgram[];
  selectedProgramId: string | null;
  onSelectProgram: (id: string | null) => void;
  currentFinalScore: number | null;
  latestCutoff: AdmissionCutoff | undefined;
  gap: number | null;
  buffer: number;
  onBufferChange: (buffer: number) => void;
  effectiveTarget: number | null;
  onUseAsTarget: (score: number) => void;
  scoreScale: number;
  isPinnedForComparison: boolean;
  canAddMoreComparison: boolean;
  onToggleComparison: (programId: string) => void;
}

function gapStatusText(gap: number): string {
  if (gap > 0) return `Cao hơn ${Math.abs(gap).toFixed(2)}`;
  if (gap < 0) return `Thấp hơn ${Math.abs(gap).toFixed(2)}`;
  return 'Bằng mức tham khảo';
}

function summaryStatusText(gap: number): string {
  if (gap > 0) return `Điểm hiện tại đang cao hơn mức tham khảo gần nhất ${Math.abs(gap).toFixed(2)} điểm.`;
  if (gap < 0) return `Điểm hiện tại đang thấp hơn mức tham khảo gần nhất ${Math.abs(gap).toFixed(2)} điểm.`;
  return 'Điểm hiện tại bằng mức tham khảo gần nhất.';
}

export function ProgramSection({
  programs,
  selectedProgramId,
  onSelectProgram,
  currentFinalScore,
  latestCutoff,
  gap,
  buffer,
  onBufferChange,
  effectiveTarget,
  onUseAsTarget,
  scoreScale,
  isPinnedForComparison,
  canAddMoreComparison,
  onToggleComparison,
}: ProgramSectionProps) {
  const [search, setSearch] = useState('');
  const searchId = useId();
  const selectId = useId();
  const bufferId = useId();

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query === '') return programs;
    return programs.filter(
      (program) =>
        program.name.toLowerCase().includes(query) ||
        program.code?.toLowerCase().includes(query) ||
        program.group?.toLowerCase().includes(query)
    );
  }, [programs, search]);

  const selectedProgram = programs.find((program) => program.id === selectedProgramId) ?? null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <GraduationCap size={18} className="text-blue-600" aria-hidden="true" />
        <h2 className="text-base font-semibold text-slate-900">Ngành mục tiêu</h2>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <label htmlFor={searchId} className="text-sm font-medium text-slate-700">
            Tìm ngành
          </label>
          <input
            id={searchId}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên ngành..."
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
            Chọn ngành
          </label>
          <select
            id={selectId}
            value={selectedProgramId ?? ''}
            onChange={(e) => onSelectProgram(e.target.value === '' ? null : e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">— Chưa chọn —</option>
            {filteredPrograms.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
                {program.group ? ` (${program.group})` : ''}
              </option>
            ))}
          </select>
          {filteredPrograms.length === 0 && (
            <p className="mt-1 text-xs text-slate-400">Không tìm thấy ngành phù hợp.</p>
          )}
        </div>
      </div>

      {selectedProgram && (
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
          <dl className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Ngành</dt>
              <dd className="text-right font-medium text-slate-800">{selectedProgram.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Điểm xét tuyển hiện tại</dt>
              <dd className="font-medium text-slate-800">
                {currentFinalScore === null ? '—' : currentFinalScore.toFixed(2)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">
                Điểm chuẩn tham khảo{latestCutoff ? ` (${latestCutoff.year})` : ''}
              </dt>
              <dd className="font-medium text-slate-800">{latestCutoff ? latestCutoff.score.toFixed(2) : 'Chưa có dữ liệu'}</dd>
            </div>
            {gap !== null && (
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Chênh lệch</dt>
                <dd className="font-medium text-slate-800">
                  {gap >= 0 ? '+' : ''}
                  {gap.toFixed(2)} ({gapStatusText(gap)})
                </dd>
              </div>
            )}
          </dl>

          {gap !== null && <p className="text-xs text-slate-500">{summaryStatusText(gap)}</p>}
          {latestCutoff?.note && <p className="text-xs text-amber-700">{latestCutoff.note}</p>}

          <div className="flex flex-wrap gap-2">
            {latestCutoff && (
              <button
                type="button"
                onClick={() => onUseAsTarget(latestCutoff.score)}
                className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Dùng {latestCutoff.score.toFixed(2)} làm mục tiêu
              </button>
            )}
            <button
              type="button"
              onClick={() => onToggleComparison(selectedProgram.id)}
              disabled={!isPinnedForComparison && !canAddMoreComparison}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPinnedForComparison ? 'Bỏ khỏi so sánh' : 'Thêm vào so sánh'}
            </button>
          </div>
          {!isPinnedForComparison && !canAddMoreComparison && (
            <p className="text-xs text-amber-700">Đã so sánh tối đa 3 ngành, bỏ bớt một ngành trước khi thêm.</p>
          )}

          {latestCutoff && (
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={bufferId} className="text-sm font-medium text-slate-700">
                  Biên mục tiêu
                </label>
              </div>
              <select
                id={bufferId}
                value={buffer}
                onChange={(e) => onBufferChange(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {BUFFER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    +{option.toFixed(2)}
                  </option>
                ))}
              </select>

              {effectiveTarget !== null && (
                <dl className="mt-2 flex flex-col gap-1 rounded-lg bg-slate-50 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Điểm chuẩn tham khảo</dt>
                    <dd className="font-medium text-slate-800">{latestCutoff.score.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Biên mục tiêu</dt>
                    <dd className="font-medium text-slate-800">+{buffer.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                    <dt className="font-semibold text-slate-900">Mục tiêu mô phỏng</dt>
                    <dd className="font-semibold text-slate-900">{effectiveTarget.toFixed(2)}</dd>
                  </div>
                </dl>
              )}

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Biên mục tiêu chỉ dùng để mô phỏng; điểm chuẩn thực tế có thể thay đổi mỗi năm.
              </p>

              {effectiveTarget !== null && effectiveTarget !== latestCutoff.score && (
                <button
                  type="button"
                  onClick={() => onUseAsTarget(effectiveTarget)}
                  className="mt-2 self-start rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Dùng mục tiêu mô phỏng ({effectiveTarget.toFixed(2)}) làm mục tiêu
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        Điểm chuẩn các năm chỉ mang tính tham khảo. Mức điểm năm sau có thể thay đổi do chỉ tiêu, độ khó kỳ thi, số
        lượng thí sinh và chính sách tuyển sinh. Thang điểm tối đa {scoreScale}.
      </p>
    </section>
  );
}
