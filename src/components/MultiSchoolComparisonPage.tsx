import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useApplicantProfile } from '../core/applicantProfileContextCore';
import { summarizeApplicantProfile } from '../core/applicantProfileSummary';
import { COMMON_SUBJECT_COMBINATIONS } from '../core/subjects';
import { evaluateComparisonSelections } from '../compare/evaluateApplicantAcrossSchools';
import { getEvaluationDisplayStatus } from '../compare/evaluationDisplay';
import {
  addComparisonSelection,
  COMPARE_SELECTION_HARD_LIMIT,
  COMPARE_SELECTION_SOFT_LIMIT,
  isDuplicateComparisonSelection,
  loadStoredComparisonSelections,
  moveComparisonSelection,
  parseComparisonSelectionsFromUrl,
  removeComparisonSelection,
  saveStoredComparisonSelections,
  updateComparisonSelection,
  type ComparisonSelection,
} from '../compare/comparisonSelection';
import {
  getCapabilityLabel,
  getProgramCatalogEntry,
  getUniversityCatalogEntry,
  searchProgramCatalog,
  searchUniversityCatalog,
  universityCatalog,
  type ProgramCatalogEntry,
  type UniversityCatalogEntry,
} from '../compare/universityCatalog';
import { ComparisonEntryCard } from './compare/ComparisonEntryCard';
import { ComparisonOverview } from './compare/ComparisonOverview';
import type { ProgramOption } from './compare/types';

interface MultiSchoolComparisonPageProps {
  onBackHome: () => void;
  onOpenSchool: (schoolId: string) => void;
}

interface PickerDraft {
  schoolId: string;
  programId: string;
  combinationId: string;
  hcmutReward: string;
  hcmutConsiderationReward: string;
  hcmutEncouragement: string;
  hcmutPriority: string;
  hasUsshBonusAchievement: boolean;
}

const EMPTY_DRAFT: PickerDraft = {
  schoolId: '',
  programId: '',
  combinationId: '',
  hcmutReward: '0',
  hcmutConsiderationReward: '0',
  hcmutEncouragement: '0',
  hcmutPriority: '0',
  hasUsshBonusAchievement: false,
};

const SCHOOLS_REQUIRING_COMBINATION = new Set(['hcmut', 'uel', 'hcmus', 'ussh', 'uhs', 'iu', 'agu', 'hcmue']);

function loadInitialSelections(): ComparisonSelection[] {
  if (typeof window === 'undefined') return [];
  const sharedSelections = parseComparisonSelectionsFromUrl(new URLSearchParams(window.location.search).get('s'));
  return sharedSelections.length > 0 ? sharedSelections : loadStoredComparisonSelections();
}

function parseNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toProgramOption(program: ProgramCatalogEntry | undefined): ProgramOption | undefined {
  return program
    ? {
        id: program.programId,
        code: program.code,
        name: program.name,
        campus: program.campus,
      }
    : undefined;
}

function selectionToDraft(selection: ComparisonSelection): PickerDraft {
  return {
    ...EMPTY_DRAFT,
    schoolId: selection.schoolId,
    programId: selection.programId ?? '',
    combinationId: selection.context?.combinationId ?? '',
    hcmutReward: String(selection.context?.hcmutBonus?.reward ?? 0),
    hcmutConsiderationReward: String(selection.context?.hcmutBonus?.considerationReward ?? 0),
    hcmutEncouragement: String(selection.context?.hcmutBonus?.encouragement ?? 0),
    hcmutPriority: String(selection.context?.hcmutBonus?.priorityRaw30Scale ?? 0),
    hasUsshBonusAchievement: selection.context?.hasUsshBonusAchievement === true,
  };
}

function buildSelectionFromDraft(draft: PickerDraft): Omit<ComparisonSelection, 'id'> | undefined {
  if (!draft.schoolId || !draft.programId) return undefined;
  if (SCHOOLS_REQUIRING_COMBINATION.has(draft.schoolId) && !draft.combinationId) return undefined;

  const context: ComparisonSelection['context'] = {};
  if (draft.combinationId) context.combinationId = draft.combinationId;
  if (draft.schoolId === 'ussh') context.hasUsshBonusAchievement = draft.hasUsshBonusAchievement;
  if (draft.schoolId === 'hcmut') {
    const reward = parseNumber(draft.hcmutReward);
    const considerationReward = parseNumber(draft.hcmutConsiderationReward);
    const encouragement = parseNumber(draft.hcmutEncouragement);
    const priorityRaw30Scale = parseNumber(draft.hcmutPriority);
    if ([reward, considerationReward, encouragement, priorityRaw30Scale].some((value) => value === undefined)) return undefined;
    context.hcmutBonus = {
      reward: reward ?? 0,
      considerationReward: considerationReward ?? 0,
      encouragement: encouragement ?? 0,
      priorityRaw30Scale: priorityRaw30Scale ?? 0,
    };
  }

  return {
    schoolId: draft.schoolId,
    programId: draft.programId,
    context: Object.keys(context).length > 0 ? context : undefined,
  };
}

function CapabilityBadge({ school }: { school: UniversityCatalogEntry }) {
  const tone =
    school.capability === 'exact'
      ? 'bg-success/10 text-ink'
      : school.capability === 'partial'
        ? 'bg-warning/10 text-ink'
        : 'bg-surface-soft text-muted';
  return <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${tone}`}>{getCapabilityLabel(school.capability, school.schoolId)}</span>;
}

function ComparePicker({
  selections,
  editingSelectionId,
  draft,
  onDraftChange,
  onClose,
  onSubmit,
}: {
  selections: readonly ComparisonSelection[];
  editingSelectionId?: string;
  draft: PickerDraft;
  onDraftChange: (draft: PickerDraft) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [schoolQuery, setSchoolQuery] = useState('');
  const [programQuery, setProgramQuery] = useState('');
  const selectedSchool = getUniversityCatalogEntry(draft.schoolId);
  const selectedProgram = getProgramCatalogEntry(draft.schoolId, draft.programId);
  const candidate = buildSelectionFromDraft(draft);
  const duplicate = candidate ? isDuplicateComparisonSelection(selections, candidate, editingSelectionId) : false;
  const canSubmit = candidate !== undefined && !duplicate;
  const schools = searchUniversityCatalog(schoolQuery).slice(0, 30);
  const programs = selectedSchool ? searchProgramCatalog(programQuery, selectedSchool.programs).slice(0, 80) : [];
  const dialogRef = useFocusTrap<HTMLDivElement>(onClose);

  function selectSchool(schoolId: string) {
    onDraftChange({ ...EMPTY_DRAFT, schoolId });
    setProgramQuery('');
  }

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-ink/30 px-4 py-6 outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-picker-title"
    >
      <div className="mx-auto flex max-h-full max-w-5xl flex-col overflow-hidden rounded-card bg-surface shadow-card">
        <div className="flex items-start justify-between border-b border-ink/10 p-4">
          <div>
            <h2 id="compare-picker-title" className="text-lg font-semibold text-ink">
              {editingSelectionId ? 'Đổi nguyện vọng' : 'Thêm trường/ngành'}
            </h2>
            <p className="text-xs text-muted">Chọn trường, ngành và ngữ cảnh riêng của trường. Hồ sơ cá nhân không nằm trong lựa chọn này.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-ink/10 p-2 text-muted hover:text-ink" aria-label="Đóng">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="grid flex-1 overflow-hidden md:grid-cols-[0.9fr_1.1fr]">
          <section className="overflow-y-auto border-b border-ink/10 p-4 md:border-b-0 md:border-r">
            <label className="text-xs font-medium text-ink" htmlFor="school-search">
              Chọn trường
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-ink/10 bg-surface px-3 py-2">
              <Search size={14} className="text-muted" aria-hidden="true" />
              <input
                id="school-search"
                value={schoolQuery}
                onChange={(event) => setSchoolQuery(event.target.value)}
                placeholder="hcmut, bách khoa, nhân văn..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <div className="mt-3 space-y-2">
              {schools.map((school) => (
                <button
                  key={school.schoolId}
                  type="button"
                  onClick={() => selectSchool(school.schoolId)}
                  className={`w-full rounded-md border p-3 text-left hover:border-accent/50 ${draft.schoolId === school.schoolId ? 'border-accent bg-accent/5' : 'border-ink/10'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink">{school.shortName}</span>
                    <CapabilityBadge school={school} />
                  </div>
                  <p className="mt-1 text-xs text-muted">{school.fullName}</p>
                  <p className="mt-1 text-[11px] text-muted">{school.programs.length} ngành có dữ liệu</p>
                </button>
              ))}
            </div>
          </section>

          <section className="overflow-y-auto p-4">
            {selectedSchool ? (
              <>
                <label className="text-xs font-medium text-ink" htmlFor="program-search">
                  Chọn ngành
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-ink/10 bg-surface px-3 py-2">
                  <Search size={14} className="text-muted" aria-hidden="true" />
                  <input
                    id="program-search"
                    value={programQuery}
                    onChange={(event) => setProgramQuery(event.target.value)}
                    placeholder="7480101, khoa học máy tính, báo chí..."
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
                <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-md border border-ink/10 p-2">
                  {programs.map((program) => (
                    <button
                      key={`${selectedSchool.schoolId}-${program.programId}`}
                      type="button"
                      onClick={() => onDraftChange({ ...draft, programId: program.programId })}
                      className={`w-full rounded-md p-2 text-left text-sm hover:bg-surface-soft ${draft.programId === program.programId ? 'bg-accent/10 text-ink' : 'text-muted'}`}
                    >
                      <span className="font-medium text-ink">{program.code ? `${program.code} - ` : ''}</span>
                      {program.name}
                      {program.campus ? <span className="text-xs"> ({program.campus})</span> : null}
                    </button>
                  ))}
                </div>

                {SCHOOLS_REQUIRING_COMBINATION.has(draft.schoolId) && (
                  <label className="mt-4 block text-xs font-medium text-ink">
                    Tổ hợp
                    <select
                      value={draft.combinationId}
                      onChange={(event) => onDraftChange({ ...draft, combinationId: event.target.value })}
                      className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm"
                    >
                      <option value="">Chưa chọn</option>
                      {COMMON_SUBJECT_COMBINATIONS.map((combination) => (
                        <option key={combination.id} value={combination.id}>
                          {combination.id}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {draft.schoolId === 'hcmut' && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {[
                      ['Điểm ưu tiên thang 30', 'hcmutPriority'],
                      ['Thưởng', 'hcmutReward'],
                      ['Xét thưởng', 'hcmutConsiderationReward'],
                      ['Khuyến khích', 'hcmutEncouragement'],
                    ].map(([label, key]) => (
                      <label key={key} className="text-xs font-medium text-ink">
                        {label}
                        <input
                          value={draft[key as keyof PickerDraft] as string}
                          onChange={(event) => onDraftChange({ ...draft, [key]: event.target.value })}
                          type="number"
                          inputMode="decimal"
                          className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm"
                        />
                      </label>
                    ))}
                  </div>
                )}

                {draft.schoolId === 'ussh' && (
                  <label className="mt-4 flex items-center gap-2 text-xs font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={draft.hasUsshBonusAchievement}
                      onChange={(event) => onDraftChange({ ...draft, hasUsshBonusAchievement: event.target.checked })}
                    />
                    Thí sinh có thành tích cộng điểm USSH
                  </label>
                )}

                <div className="mt-5 rounded-md bg-surface-soft p-3 text-xs text-muted">
                  {selectedProgram ? (
                    <p>
                      Đang chọn: <span className="font-medium text-ink">{selectedSchool.shortName}</span> - {selectedProgram.code ? `${selectedProgram.code} ` : ''}
                      {selectedProgram.name}
                    </p>
                  ) : (
                    <p>Chọn một ngành để tiếp tục.</p>
                  )}
                  {duplicate && <p className="mt-1 text-danger">Nguyện vọng này đã có trong danh sách.</p>}
                </div>
              </>
            ) : (
              <div className="rounded-md bg-surface-soft p-4 text-sm text-muted">Chọn trường trước, rồi chọn ngành từ registry thật của trường.</div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-2 border-t border-ink/10 p-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-md border border-ink/10 px-4 py-2 text-sm font-medium text-muted hover:text-ink">
            Hủy
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {editingSelectionId ? 'Lưu thay đổi' : 'Thêm vào so sánh'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MultiSchoolComparisonPage({ onBackHome, onOpenSchool }: MultiSchoolComparisonPageProps) {
  const { profile } = useApplicantProfile();
  const profileSummary = summarizeApplicantProfile(profile);
  const [selections, setSelections] = useState<ComparisonSelection[]>(loadInitialSelections);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingSelectionId, setEditingSelectionId] = useState<string | undefined>();
  const [draft, setDraft] = useState<PickerDraft>(EMPTY_DRAFT);

  useEffect(() => {
    saveStoredComparisonSelections(selections);
  }, [selections]);

  const summaries = useMemo(() => evaluateComparisonSelections(profile, selections), [profile, selections]);
  const statusCounts = useMemo(
    () =>
      summaries.reduce(
        (counts, summary) => {
          counts[getEvaluationDisplayStatus(summary.evaluation.confidence)] += 1;
          return counts;
        },
        { exact: 0, partial: 0, unavailable: 0 }
      ),
    [summaries]
  );
  const uniqueSchoolCount = useMemo(() => new Set(selections.map((selection) => selection.schoolId)).size, [selections]);

  function openAddPicker() {
    setEditingSelectionId(undefined);
    setDraft(EMPTY_DRAFT);
    setPickerOpen(true);
  }

  function openEditPicker(selection: ComparisonSelection) {
    setEditingSelectionId(selection.id);
    setDraft(selectionToDraft(selection));
    setPickerOpen(true);
  }

  function submitPicker() {
    const nextSelection = buildSelectionFromDraft(draft);
    if (!nextSelection) return;
    setSelections((current) =>
      editingSelectionId
        ? updateComparisonSelection(current, editingSelectionId, nextSelection)
        : addComparisonSelection(current, nextSelection, `cmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
    );
    setPickerOpen(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div inert={pickerOpen || undefined} aria-hidden={pickerOpen || undefined}>
      <button type="button" onClick={onBackHome} className="text-xs font-medium text-accent underline-offset-2 hover:underline">
        Về trang chủ
      </button>

      <ComparisonOverview
        selectionCount={selections.length}
        uniqueSchoolCount={uniqueSchoolCount}
        statusCounts={statusCounts}
        profileSummary={profileSummary}
        onEditProfile={onBackHome}
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={openAddPicker}
          disabled={selections.length >= COMPARE_SELECTION_HARD_LIMIT}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} aria-hidden="true" />
          Thêm trường/ngành
        </button>
        {selections.length > COMPARE_SELECTION_SOFT_LIMIT && (
          <p className="text-xs text-muted">Bạn đang so sánh nhiều nguyện vọng. Nên giữ khoảng 3-6 để dễ đọc.</p>
        )}
      </div>

      {selections.length === 0 ? (
        <section className="mt-6 rounded-card border border-dashed border-ink/20 bg-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-ink">So sánh nguyện vọng</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">Chọn trường và ngành bạn muốn so sánh. Dữ liệu hồ sơ chỉ cần nhập một lần.</p>
          <button type="button" onClick={openAddPicker} className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
            <Plus size={16} aria-hidden="true" />
            Thêm trường/ngành
          </button>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
            {universityCatalog
              .filter((school) => school.capability === 'exact' || school.capability === 'partial')
              .slice(0, 6)
              .map((school) => (
                <button
                  key={school.schoolId}
                  type="button"
                  onClick={() => {
                    setEditingSelectionId(undefined);
                    setDraft({ ...EMPTY_DRAFT, schoolId: school.schoolId });
                    setPickerOpen(true);
                  }}
                  className="rounded-full border border-ink/10 px-3 py-1 text-muted"
                >
                  {school.shortName}
                </button>
              ))}
          </div>
        </section>
      ) : (
        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          {summaries.map((summary, index) => {
            const selection = selections.find((item) => item.id === summary.selectionId);
            const program = toProgramOption(getProgramCatalogEntry(summary.schoolId, selection?.programId));
            return (
              <ComparisonEntryCard
                key={summary.selectionId ?? `${summary.schoolId}-${index}`}
                summary={summary}
                program={program}
                combinationId={selection?.context?.combinationId}
                canMoveUp={index > 0}
                canMoveDown={index < selections.length - 1}
                onEdit={() => selection && openEditPicker(selection)}
                onRemove={() => selection && setSelections((current) => removeComparisonSelection(current, selection.id))}
                onMoveUp={() => selection && setSelections((current) => moveComparisonSelection(current, selection.id, 'up'))}
                onMoveDown={() => selection && setSelections((current) => moveComparisonSelection(current, selection.id, 'down'))}
                onOpenSchool={onOpenSchool}
              />
            );
          })}
        </section>
      )}
      </div>

      {pickerOpen && (
        <ComparePicker
          selections={selections}
          editingSelectionId={editingSelectionId}
          draft={draft}
          onDraftChange={setDraft}
          onClose={() => setPickerOpen(false)}
          onSubmit={submitPicker}
        />
      )}
    </div>
  );
}
