import type { AdmissionConfig, DgnlResult } from '../schools/hcmut/types/admission';
import type { DgnlFormState } from '../schools/hcmut/types/form';
import type { FieldValidationResult } from '../schools/hcmut/validation';
import type { HcmutApplicantType } from '../schools/hcmut/types/applicantType';
import { ScoreInput } from './ScoreInput';
import { SectionHeader } from './SectionHeader';

export type DgnlInputMode = 'detail' | 'total';

interface DgnlSectionProps {
  config: AdmissionConfig;
  values: DgnlFormState;
  errors: Record<keyof DgnlFormState, FieldValidationResult>;
  result: DgnlResult;
  onChange: (key: keyof DgnlFormState, value: string) => void;
  mode: DgnlInputMode;
  onModeChange: (mode: DgnlInputMode) => void;
  totalValue: string;
  totalError: string | null;
  onTotalChange: (value: string) => void;
  applicantType: HcmutApplicantType;
}

export function DgnlSection({
  config,
  values,
  errors,
  result,
  onChange,
  mode,
  onModeChange,
  totalValue,
  totalError,
  onTotalChange,
  applicantType,
}: DgnlSectionProps) {
  const maxHint = `0 - ${config.dgnl.maxPerComponent}`;
  const weightedPercent = Math.min(100, Math.max(0, (result.weightedScore / config.dgnl.maxWeightedTotal) * 100));

  if (applicantType === 'no-dgnl') {
    return (
      <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
        <SectionHeader index="01" title="Điểm năng lực" />
        <p className="mt-3 text-sm text-muted">
          Bạn không có ĐGNL nên điểm năng lực được HCMUT quy đổi từ điểm thi THPT: <strong>Điểm năng lực = Điểm
          THPT quy đổi × 0,75</strong> (Đối tượng 2.2, Đề án tuyển sinh HCMUT 2026). Giá trị dưới đây tự động cập
          nhật theo mục "Thi THPT" bên dưới — không cần nhập lại.
        </p>
        <div className="mt-6 flex flex-col gap-3 rounded-lg bg-surface-soft p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Điểm năng lực (quy đổi)</span>
            <span className="font-medium text-ink">{result.normalizedScore.toFixed(2)} / {config.scoreScale}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${Math.min(100, Math.max(0, (result.normalizedScore / config.scoreScale) * 100))}%` }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader index="01" title="Đánh giá năng lực" />

        <div role="group" aria-label="Cách nhập điểm ĐGNL" className="inline-flex rounded-lg bg-surface-soft p-1 text-xs">
          <button
            type="button"
            onClick={() => onModeChange('detail')}
            aria-pressed={mode === 'detail'}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              mode === 'detail' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            Nhập chi tiết
          </button>
          <button
            type="button"
            onClick={() => onModeChange('total')}
            aria-pressed={mode === 'total'}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              mode === 'total' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            Nhập tổng điểm
          </button>
        </div>
      </div>

      {mode === 'detail' ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ScoreInput
            id="dgnl-vietnamese"
            label="Tiếng Việt"
            hint={maxHint}
            value={values.vietnamese}
            error={errors.vietnamese.error}
            onChange={(v) => onChange('vietnamese', v)}
          />
          <ScoreInput
            id="dgnl-english"
            label="Tiếng Anh"
            hint={maxHint}
            value={values.english}
            error={errors.english.error}
            onChange={(v) => onChange('english', v)}
          />
          <ScoreInput
            id="dgnl-math"
            label={`Toán (×${config.dgnl.mathMultiplier})`}
            hint={maxHint}
            value={values.math}
            error={errors.math.error}
            onChange={(v) => onChange('math', v)}
          />
          <ScoreInput
            id="dgnl-scientific-thinking"
            label="Tư duy khoa học"
            hint={maxHint}
            value={values.scientificThinking}
            error={errors.scientificThinking.error}
            onChange={(v) => onChange('scientificThinking', v)}
          />
        </div>
      ) : (
        <div className="mt-6">
          <ScoreInput
            id="dgnl-total"
            label="Tổng điểm ĐGNL sau hệ số"
            hint={`0 - ${config.dgnl.maxWeightedTotal}`}
            value={totalValue}
            error={totalError}
            onChange={onTotalChange}
          />
          <p className="mt-2 text-xs text-muted">
            Nhập đúng số "Tổng điểm sau hệ số" trên phiếu kết quả ĐGNL ĐHQG-HCM (ví dụ 950/1500), không cần tách theo
            từng phần thi.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 rounded-lg bg-surface-soft p-4 text-sm">
        {mode === 'detail' && (
          <div className="flex items-center justify-between">
            <span className="text-muted">Tổng sau hệ số</span>
            <span className="font-medium text-ink">
              {result.weightedScore.toFixed(2)} / {config.dgnl.maxWeightedTotal}
            </span>
          </div>
        )}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div className="h-full rounded-full bg-accent" style={{ width: `${weightedPercent}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Chuẩn hóa</span>
          <span className="font-medium text-ink">{result.normalizedScore.toFixed(2)} / {config.scoreScale}</span>
        </div>
      </div>
    </section>
  );
}
