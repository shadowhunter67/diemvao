import { useId } from 'react';
import type { AdmissionConfig, TranscriptResult } from '../schools/hcmut/types/admission';
import type { TranscriptFormState, TranscriptYearFormState } from '../schools/hcmut/types/form';
import type { HcmutSubjectContext } from '../schools/hcmut/types/subjectContext';
import type { FieldValidationResult } from '../schools/hcmut/validation';
import { SELECTABLE_SUBJECT_IDS, SUBJECT_LABELS, type SubjectId } from '../core/subjects';
import { ScoreInput } from './ScoreInput';
import { SectionHeader } from './SectionHeader';

type GradeKey = keyof TranscriptFormState;
type SubjectKey = keyof TranscriptYearFormState;

interface TranscriptSectionProps {
  config: AdmissionConfig;
  values: TranscriptFormState;
  errors: Record<GradeKey, Record<SubjectKey, FieldValidationResult>>;
  result: TranscriptResult;
  onChange: (grade: GradeKey, subject: SubjectKey, value: string) => void;
  subjectContext: HcmutSubjectContext;
  onSubjectContextChange: (patch: Partial<HcmutSubjectContext>) => void;
}

const grades: { key: GradeKey; label: string }[] = [
  { key: 'grade10', label: 'Lớp 10' },
  { key: 'grade11', label: 'Lớp 11' },
  { key: 'grade12', label: 'Lớp 12' },
];

/** Dropdown chọn môn thật cho "Môn 2"/"Môn 3" — dùng chung cho cả Học bạ lẫn Thi THPT (cùng tổ
 * hợp), nên chỉ đặt UI chọn một lần ở đây (Học bạ luôn hiện trước Thi THPT trong bố cục hiện
 * tại). Optional — không chọn vẫn tính điểm bình thường, chỉ cần khi build ApplicantProfile. */
function SubjectIdentityPicker({
  subjectContext,
  onSubjectContextChange,
}: {
  subjectContext: HcmutSubjectContext;
  onSubjectContextChange: (patch: Partial<HcmutSubjectContext>) => void;
}) {
  const subject2Id = useId();
  const subject3Id = useId();

  return (
    <div className="mt-4 rounded-lg border border-ink/10 bg-surface-soft p-3">
      <p className="text-xs text-muted">
        Cho UniscoreVN biết "Môn 2"/"Môn 3" của bạn là môn gì (áp dụng cho cả Học bạ và Thi THPT bên dưới) — không bắt
        buộc để tính điểm, chỉ cần nếu bạn muốn lưu hồ sơ điểm dùng chung cho nhiều trường.
      </p>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={subject2Id} className="text-xs font-medium text-ink">
            Môn 2 là môn gì?
          </label>
          <select
            id={subject2Id}
            value={subjectContext.subject2 ?? ''}
            onChange={(e) => onSubjectContextChange({ subject2: (e.target.value || null) as SubjectId | null })}
            className="mt-1 h-9 w-full rounded-md border border-ink/10 bg-surface px-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
          >
            <option value="">— Chưa chọn —</option>
            {SELECTABLE_SUBJECT_IDS.map((id) => (
              <option key={id} value={id}>
                {SUBJECT_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={subject3Id} className="text-xs font-medium text-ink">
            Môn 3 là môn gì?
          </label>
          <select
            id={subject3Id}
            value={subjectContext.subject3 ?? ''}
            onChange={(e) => onSubjectContextChange({ subject3: (e.target.value || null) as SubjectId | null })}
            className="mt-1 h-9 w-full rounded-md border border-ink/10 bg-surface px-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
          >
            <option value="">— Chưa chọn —</option>
            {SELECTABLE_SUBJECT_IDS.map((id) => (
              <option key={id} value={id}>
                {SUBJECT_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export function TranscriptSection({
  config,
  values,
  errors,
  result,
  onChange,
  subjectContext,
  onSubjectContextChange,
}: TranscriptSectionProps) {
  const subject2Label = subjectContext.subject2 ? `Môn 2 (${SUBJECT_LABELS[subjectContext.subject2]})` : 'Môn 2';
  const subject3Label = subjectContext.subject3 ? `Môn 3 (${SUBJECT_LABELS[subjectContext.subject3]})` : 'Môn 3';
  const subjects: { key: SubjectKey; label: string }[] = [
    { key: 'math', label: `Toán (×${config.transcript.mathMultiplier})` },
    { key: 'subject2', label: subject2Label },
    { key: 'subject3', label: subject3Label },
  ];
  const maxHint = `0 - ${config.transcript.maxPerSubject}`;

  return (
    <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
      <SectionHeader index="02" title="Học bạ" subtitle={`${maxHint} mỗi môn, mỗi năm`} />
      <SubjectIdentityPicker subjectContext={subjectContext} onSubjectContextChange={onSubjectContextChange} />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[420px] border-separate border-spacing-x-3 border-spacing-y-3">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-muted" />
              {grades.map((grade) => (
                <th key={grade.key} className="text-center text-xs font-medium text-muted">
                  {grade.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.key}>
                <th scope="row" className="whitespace-nowrap pr-2 text-left text-sm font-medium text-ink">
                  {subject.label}
                </th>
                {grades.map((grade) => {
                  const fieldValidation = errors[grade.key][subject.key];
                  return (
                    <td key={grade.key}>
                      <ScoreInput
                        id={`transcript-${grade.key}-${subject.key}`}
                        label={`${subject.label} ${grade.label}`}
                        value={values[grade.key][subject.key]}
                        error={fieldValidation.error}
                        onChange={(v) => onChange(grade.key, subject.key, v)}
                        compact
                        hideLabel
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-lg bg-surface-soft p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Trung bình có trọng số</span>
          <span className="font-medium text-ink">{result.weightedAverage.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Chuẩn hóa</span>
          <span className="font-medium text-ink">{result.normalizedScore.toFixed(2)} / {config.scoreScale}</span>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Nếu bạn thay đổi môn học trong tổ hợp giữa lớp 10, 11 và 12, kết quả thực tế có thể được HCMUT
        xử lý theo quy định riêng.
      </p>
    </section>
  );
}
