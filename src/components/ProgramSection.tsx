import { useId, useMemo, useState } from 'react';
import { Check, GraduationCap, Plus } from 'lucide-react';
import { MAX_COMPARISON_PINS, getLatestComparableCutoff } from '../schools/hcmut/programs';
import type { HcmutProgram } from '../schools/hcmut/types/programs';

interface ProgramSectionProps {
  programs: HcmutProgram[];
  selectedProgramId: string | null;
  onSelectProgram: (id: string | null) => void;
  scoreScale: number;
  comparisonProgramIds: string[];
  onToggleComparison: (programId: string) => void;
}

export function ProgramSection({
  programs,
  selectedProgramId,
  onSelectProgram,
  scoreScale,
  comparisonProgramIds,
  onToggleComparison,
}: ProgramSectionProps) {
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(selectedProgramId === null);
  const searchId = useId();

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
  const canAddMoreComparison = comparisonProgramIds.length < MAX_COMPARISON_PINS;
  const latestCutoff = selectedProgram ? getLatestComparableCutoff(selectedProgram.id) : undefined;
  const showPicker = isEditing || !selectedProgram;

  return (
    <section id="program-picker" className="rounded-2xl bg-surface-soft p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <GraduationCap size={20} className="text-accent" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-ink">Chọn ngành</h2>
      </div>

      {selectedProgram && !showPicker ? (
        <div className="mt-6 flex flex-col gap-3 rounded-lg bg-surface p-4">
          <div>
            <span className="text-xs text-muted">Ngành mục tiêu</span>
            <p className="text-lg font-semibold text-ink">{selectedProgram.name}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">
              Điểm tham khảo {latestCutoff ? latestCutoff.year : ''}
            </span>
            <p className="text-sm font-medium text-ink">{latestCutoff ? latestCutoff.score.toFixed(2) : 'Chưa có dữ liệu'}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-1 w-fit rounded-md border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            Đổi ngành
          </button>
        </div>
      ) : (
      <div className="mt-6">
        <label htmlFor={searchId} className="text-sm font-medium text-ink">
          Tìm ngành
        </label>
        <input
          id={searchId}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nhập tên ngành, mã ngành hoặc nhóm..."
          className="mt-1 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 sm:h-12"
        />
        <p className="mt-2 text-xs text-muted">
          Bấm tên ngành để chọn làm mục tiêu chính; bấm nút "So sánh" trên mỗi dòng để thêm/bớt khỏi bảng so sánh
          (tối đa {MAX_COMPARISON_PINS} ngành) — có thể chọn nhiều ngành so sánh không cần đặt làm mục tiêu.
        </p>

        <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-ink/10 bg-surface">
          {filteredPrograms.length === 0 ? (
            <p className="p-3 text-sm text-muted">Không tìm thấy ngành phù hợp.</p>
          ) : (
            <ul>
              {filteredPrograms.map((program) => {
                const isSelected = program.id === selectedProgramId;
                const isPinned = comparisonProgramIds.includes(program.id);
                return (
                  <li key={program.id} className="flex items-center gap-2 px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProgram(program.id);
                        setIsEditing(false);
                      }}
                      aria-pressed={isSelected}
                      className={`flex flex-1 items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${
                        isSelected ? 'bg-accent/10 text-accent' : 'text-ink hover:bg-ink/5'
                      }`}
                    >
                      <span>
                        {program.name}
                        {program.group ? <span className="ml-2 text-xs text-muted">{program.group}</span> : null}
                      </span>
                      {isSelected && <span className="text-xs font-medium">Đang chọn</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleComparison(program.id)}
                      disabled={!isPinned && !canAddMoreComparison}
                      aria-pressed={isPinned}
                      aria-label={isPinned ? `Bỏ ${program.name} khỏi so sánh` : `Thêm ${program.name} vào so sánh`}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        isPinned
                          ? 'border-accent/30 bg-accent/10 text-accent'
                          : 'border-ink/10 text-muted hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      {isPinned ? <Check size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
                      So sánh
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>
            Đã chọn so sánh: {comparisonProgramIds.length}/{MAX_COMPARISON_PINS}
          </span>
          {selectedProgram && (
            <button type="button" onClick={() => onSelectProgram(null)} className="font-medium text-muted hover:text-ink">
              Bỏ chọn ngành mục tiêu
            </button>
          )}
        </div>
      </div>
      )}

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Điểm chuẩn các năm chỉ mang tính tham khảo. Mức điểm năm sau có thể thay đổi do chỉ tiêu, độ khó kỳ thi, số
        lượng thí sinh và chính sách tuyển sinh. Thang điểm tối đa {scoreScale}.
      </p>
    </section>
  );
}
