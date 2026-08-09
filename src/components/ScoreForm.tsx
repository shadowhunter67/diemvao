import { RotateCcw } from 'lucide-react';
import type { AdmissionConfig, AdmissionResult } from '../types/admission';
import type { AdmissionFormState, BonusFormState, DgnlFormState, ThptFormState, TranscriptFormState } from '../types/form';
import type { AdmissionFormErrors } from '../lib/validation';
import { DgnlSection } from './DgnlSection';
import { ThptSection } from './ThptSection';
import { TranscriptSection } from './TranscriptSection';
import { BonusPrioritySection } from './BonusPrioritySection';

interface ScoreFormProps {
  config: AdmissionConfig;
  formState: AdmissionFormState;
  errors: AdmissionFormErrors;
  result: AdmissionResult;
  onDgnlChange: (key: keyof DgnlFormState, value: string) => void;
  onThptChange: (key: keyof ThptFormState, value: string) => void;
  onTranscriptChange: (grade: keyof TranscriptFormState, subject: keyof TranscriptFormState['grade10'], value: string) => void;
  onBonusChange: (key: keyof BonusFormState, value: string) => void;
  onPriorityChange: (value: string) => void;
  onReset: () => void;
}

export function ScoreForm({
  config,
  formState,
  errors,
  result,
  onDgnlChange,
  onThptChange,
  onTranscriptChange,
  onBonusChange,
  onPriorityChange,
  onReset,
}: ScoreFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Nhập điểm</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Đặt lại
        </button>
      </div>

      <DgnlSection
        config={config}
        values={formState.dgnl}
        errors={errors.dgnl}
        result={result.dgnl}
        onChange={onDgnlChange}
      />

      <TranscriptSection
        config={config}
        values={formState.transcript}
        errors={errors.transcript}
        result={result.transcript}
        onChange={onTranscriptChange}
      />

      <ThptSection
        config={config}
        values={formState.thpt}
        errors={errors.thpt}
        result={result.thpt}
        onChange={onThptChange}
      />

      <BonusPrioritySection
        config={config}
        bonusValues={formState.bonus}
        bonusErrors={errors.bonus}
        priorityValue={formState.priorityRaw30Scale}
        priorityError={errors.priorityRaw30Scale.error}
        onBonusChange={onBonusChange}
        onPriorityChange={onPriorityChange}
      />
    </div>
  );
}
