import type { AdmissionConfig, TranscriptResult } from '../types/admission';
import type { TranscriptFormState, TranscriptYearFormState } from '../types/form';
import type { FieldValidationResult } from '../lib/validation';
import { ScoreInput } from './ScoreInput';

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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Điểm học bạ</h2>
      <p className="mt-1 text-xs text-slate-400">{maxHint} mỗi môn, mỗi năm</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-separate border-spacing-x-2 border-spacing-y-3">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-slate-500" />
              {grades.map((grade) => (
                <th key={grade.key} className="text-center text-xs font-medium text-slate-500">
                  {grade.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.key}>
                <th scope="row" className="whitespace-nowrap pr-2 text-left text-sm font-medium text-slate-700">
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

      <dl className="mt-2 flex flex-col gap-1 rounded-lg bg-slate-50 p-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Trung bình có trọng số</dt>
          <dd className="font-medium text-slate-800">{result.weightedAverage.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Chuẩn hóa</dt>
          <dd className="font-medium text-slate-800">{result.normalizedScore.toFixed(2)} / {config.scoreScale}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        Nếu bạn thay đổi môn học trong tổ hợp giữa lớp 10, 11 và 12, kết quả thực tế có thể được HCMUT
        xử lý theo quy định riêng.
      </p>
    </section>
  );
}
