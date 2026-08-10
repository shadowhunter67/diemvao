import type { AdmissionConfig, TranscriptResult } from '../schools/hcmut/types/admission';
import type { TranscriptFormState, TranscriptYearFormState } from '../schools/hcmut/types/form';
import type { FieldValidationResult } from '../schools/hcmut/validation';
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
}

const grades: { key: GradeKey; label: string }[] = [
  { key: 'grade10', label: 'Lớp 10' },
  { key: 'grade11', label: 'Lớp 11' },
  { key: 'grade12', label: 'Lớp 12' },
];

export function TranscriptSection({ config, values, errors, result, onChange }: TranscriptSectionProps) {
  const subjects: { key: SubjectKey; label: string }[] = [
    { key: 'math', label: `Toán (×${config.transcript.mathMultiplier})` },
    { key: 'subject2', label: 'Môn 2' },
    { key: 'subject3', label: 'Môn 3' },
  ];
  const maxHint = `0 - ${config.transcript.maxPerSubject}`;

  return (
    <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
      <SectionHeader index="02" title="Học bạ" subtitle={`${maxHint} mỗi môn, mỗi năm`} />

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
