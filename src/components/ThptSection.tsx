import { useId, useState } from 'react';
import type { AdmissionConfig, ThptResult } from '../schools/hcmut/types/admission';
import type { ThptFormState } from '../schools/hcmut/types/form';
import type { FieldValidationResult } from '../schools/hcmut/validation';
import { ScoreInput } from './ScoreInput';
import { SectionHeader } from './SectionHeader';

interface ThptSectionProps {
  config: AdmissionConfig;
  values: ThptFormState;
  errors: Record<keyof ThptFormState, FieldValidationResult>;
  result: ThptResult;
  onChange: (key: keyof ThptFormState, value: string) => void;
}

/**
 * Bảng quy đổi chứng chỉ tiếng Anh quốc tế sang điểm môn Tiếng Anh trong thi THPT (thang 10),
 * áp dụng cho tổ hợp xét tuyển có dùng môn Tiếng Anh. Nguồn: hcmut.edu.vn/tintuc/quy-doi-chung-chi-tieng-anh
 * (Trường ĐH Bách khoa - ĐHQG-HCM, xét tuyển đại học chính quy 2026).
 * Với TOEIC, quy đổi lấy theo cặp thành phần (Nghe-Đọc / Nói-Viết) đạt mức thấp hơn nếu không
 * đồng thời đạt cùng mức, theo đúng ghi chú của bảng gốc.
 */
const ENGLISH_CERT_LEVELS = [
  { ielts: '6.0', pte: '47 - 54', toeflIbt: '60 - 78', toeflIbt2026: '3.5', toeicLR: '570 - 680', toeicSW: '310 - 329', score: 8.0 },
  { ielts: '6.5', pte: '55 - 62', toeflIbt: '79 - 93', toeflIbt2026: '4', toeicLR: '685 - 780', toeicSW: '330 - 359', score: 8.5 },
  { ielts: '7.0', pte: '63 - 70', toeflIbt: '94 - 101', toeflIbt2026: '4.5', toeicLR: '785 - 830', toeicSW: '360 - 379', score: 9.0 },
  { ielts: '7.5', pte: '71 - 78', toeflIbt: '102 - 109', toeflIbt2026: '5', toeicLR: '835 - 900', toeicSW: '380 - 389', score: 9.5 },
  { ielts: '≥ 8.0', pte: '≥ 79', toeflIbt: '≥ 110', toeflIbt2026: '5.5', toeicLR: '≥ 905', toeicSW: '≥ 390', score: 10.0 },
] as const;

type CertType = 'ielts' | 'pte' | 'toeflIbt' | 'toeflIbt2026' | 'toeic';

const CERT_TYPE_OPTIONS: { id: CertType; label: string }[] = [
  { id: 'ielts', label: 'IELTS Academic' },
  { id: 'pte', label: 'PTE Academic' },
  { id: 'toeflIbt', label: 'TOEFL iBT' },
  { id: 'toeflIbt2026', label: 'TOEFL iBT 2026' },
  { id: 'toeic', label: 'TOEIC' },
];

function EnglishCertConverter({ onFill }: { onFill: (field: 'subject2' | 'subject3', score: number) => void }) {
  const [certType, setCertType] = useState<CertType>('ielts');
  const [levelIndex, setLevelIndex] = useState('');
  const [toeicLRIndex, setToeicLRIndex] = useState('');
  const [toeicSWIndex, setToeicSWIndex] = useState('');
  const certSelectId = useId();
  const levelSelectId = useId();

  let convertedScore: number | null = null;
  if (certType === 'toeic') {
    if (toeicLRIndex !== '' && toeicSWIndex !== '') {
      const minIndex = Math.min(Number(toeicLRIndex), Number(toeicSWIndex));
      convertedScore = ENGLISH_CERT_LEVELS[minIndex].score;
    }
  } else if (levelIndex !== '') {
    convertedScore = ENGLISH_CERT_LEVELS[Number(levelIndex)].score;
  }

  return (
    <div className="mt-6 rounded-lg border border-ink/10 bg-surface-soft p-4">
      <p className="text-sm font-medium text-ink">Quy đổi chứng chỉ tiếng Anh quốc tế</p>
      <p className="mt-1 text-xs text-muted">
        Chỉ áp dụng nếu tổ hợp xét tuyển của bạn có dùng môn Tiếng Anh. Kết quả quy đổi ra điểm thi THPT
        (thang 10), điền vào ô Môn 2 hoặc Môn 3 bên trên tùy tổ hợp của bạn.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={certSelectId} className="text-sm font-medium text-ink">
            Loại chứng chỉ
          </label>
          <select
            id={certSelectId}
            value={certType}
            onChange={(e) => {
              setCertType(e.target.value as CertType);
              setLevelIndex('');
              setToeicLRIndex('');
              setToeicSWIndex('');
            }}
            className="mt-1 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          >
            {CERT_TYPE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {certType === 'toeic' ? (
          <>
            <div>
              <label className="text-sm font-medium text-ink">TOEIC Nghe &amp; Đọc</label>
              <select
                value={toeicLRIndex}
                onChange={(e) => setToeicLRIndex(e.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="">— Chọn mức —</option>
                {ENGLISH_CERT_LEVELS.map((level, index) => (
                  <option key={index} value={index}>
                    {level.toeicLR}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">TOEIC Nói &amp; Viết</label>
              <select
                value={toeicSWIndex}
                onChange={(e) => setToeicSWIndex(e.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="">— Chọn mức —</option>
                {ENGLISH_CERT_LEVELS.map((level, index) => (
                  <option key={index} value={index}>
                    {level.toeicSW}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div>
            <label htmlFor={levelSelectId} className="text-sm font-medium text-ink">
              Mức đạt
            </label>
            <select
              id={levelSelectId}
              value={levelIndex}
              onChange={(e) => setLevelIndex(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">— Chọn mức —</option>
              {ENGLISH_CERT_LEVELS.map((level, index) => (
                <option key={index} value={index}>
                  {level[certType]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface p-3">
        <span className="text-sm text-muted">
          Điểm Tiếng Anh quy đổi: <span className="font-semibold text-ink">{convertedScore?.toFixed(1) ?? '—'}</span> / 10
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={convertedScore === null}
            onClick={() => convertedScore !== null && onFill('subject2', convertedScore)}
            className="rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Điền vào Môn 2
          </button>
          <button
            type="button"
            disabled={convertedScore === null}
            onClick={() => convertedScore !== null && onFill('subject3', convertedScore)}
            className="rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Điền vào Môn 3
          </button>
        </div>
      </div>
    </div>
  );
}

export function ThptSection({ config, values, errors, result, onChange }: ThptSectionProps) {
  const maxHint = `0 - ${config.thpt.maxPerSubject}`;

  return (
    <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
      <SectionHeader index="03" title="Thi THPT" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScoreInput
          id="thpt-math"
          label={`Toán (×${config.thpt.mathMultiplier})`}
          hint={maxHint}
          value={values.math}
          error={errors.math.error}
          onChange={(v) => onChange('math', v)}
        />
        <ScoreInput
          id="thpt-subject2"
          label="Môn 2"
          hint={maxHint}
          value={values.subject2}
          error={errors.subject2.error}
          onChange={(v) => onChange('subject2', v)}
        />
        <ScoreInput
          id="thpt-subject3"
          label="Môn 3"
          hint={maxHint}
          value={values.subject3}
          error={errors.subject3.error}
          onChange={(v) => onChange('subject3', v)}
        />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-surface-soft p-4">
        <span className="text-sm text-muted">Chuẩn hóa</span>
        <span className="text-3xl font-bold text-ink">
          {result.normalizedScore.toFixed(2)}
          <span className="ml-1 text-base font-medium text-muted">/ {config.scoreScale}</span>
        </span>
      </div>

      <EnglishCertConverter onFill={(field, score) => onChange(field, String(score))} />
    </section>
  );
}
