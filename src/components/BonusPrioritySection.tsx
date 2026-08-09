import type { AdmissionConfig } from '../types/admission';
import type { BonusFormState } from '../types/form';
import type { FieldValidationResult } from '../lib/validation';
import { ScoreInput } from './ScoreInput';

interface BonusPrioritySectionProps {
  config: AdmissionConfig;
  bonusValues: BonusFormState;
  bonusErrors: Record<keyof BonusFormState, FieldValidationResult>;
  priorityValue: string;
  priorityError: string | null;
  onBonusChange: (key: keyof BonusFormState, value: string) => void;
  onPriorityChange: (value: string) => void;
}

export function BonusPrioritySection({
  config,
  bonusValues,
  bonusErrors,
  priorityValue,
  priorityError,
  onBonusChange,
  onPriorityChange,
}: BonusPrioritySectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Ưu tiên & Điểm cộng</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScoreInput
          id="bonus-reward"
          label="Điểm thưởng"
          value={bonusValues.reward}
          error={bonusErrors.reward.error}
          onChange={(v) => onBonusChange('reward', v)}
        />
        <ScoreInput
          id="bonus-consideration"
          label="Điểm xét thưởng"
          value={bonusValues.considerationReward}
          error={bonusErrors.considerationReward.error}
          onChange={(v) => onBonusChange('considerationReward', v)}
        />
        <ScoreInput
          id="bonus-encouragement"
          label="Điểm khuyến khích"
          value={bonusValues.encouragement}
          error={bonusErrors.encouragement.error}
          onChange={(v) => onBonusChange('encouragement', v)}
        />
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <ScoreInput
          id="priority-raw30"
          label="Điểm ưu tiên khu vực/đối tượng theo thang 30"
          hint={`0 - ${config.priority.maxRaw30Scale}`}
          value={priorityValue}
          error={priorityError}
          onChange={onPriorityChange}
        />
      </div>
    </section>
  );
}
