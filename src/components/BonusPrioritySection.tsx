import { useId, useState } from 'react';
import type { AdmissionConfig, BonusResult, PriorityResult } from '../schools/hcmut/types/admission';
import type { BonusFormState } from '../schools/hcmut/types/form';
import type { FieldValidationResult } from '../schools/hcmut/validation';
import { ScoreInput } from './ScoreInput';
import { SectionHeader } from './SectionHeader';

interface BonusPrioritySectionProps {
  config: AdmissionConfig;
  bonusValues: BonusFormState;
  bonusErrors: Record<keyof BonusFormState, FieldValidationResult>;
  priorityValue: string;
  priorityError: string | null;
  bonusResult: BonusResult;
  priorityResult: PriorityResult;
  onBonusChange: (key: keyof BonusFormState, value: string) => void;
  onPriorityChange: (value: string) => void;
}

/**
 * Mức cộng điểm ưu tiên khu vực/đối tượng theo thang điểm 30, quy định chung của Bộ GD&ĐT
 * (áp dụng cho mọi trường, không riêng HCMUT). Tổng tối đa 0.75 + 2.0 = 2.75, khớp đúng
 * config.priority.maxRaw30Scale — chỉ dùng để gợi ý điền nhanh, người dùng vẫn có thể sửa tay.
 */
const AREA_OPTIONS = [
  { id: '', label: '— Chọn khu vực —', points: null as number | null },
  { id: 'kv3', label: 'Khu vực 3 (KV3)', points: 0 },
  { id: 'kv2', label: 'Khu vực 2 (KV2)', points: 0.25 },
  { id: 'kv2nt', label: 'Khu vực 2 - Nông thôn (KV2-NT)', points: 0.5 },
  { id: 'kv1', label: 'Khu vực 1 (KV1)', points: 0.75 },
];

const PRIORITY_GROUP_OPTIONS = [
  { id: '', label: '— Chọn đối tượng —', points: null as number | null },
  { id: 'none', label: 'Không thuộc diện ưu tiên', points: 0 },
  { id: 'ut2', label: 'Nhóm ưu tiên 2 (đối tượng 05, 06, 07)', points: 1 },
  { id: 'ut1', label: 'Nhóm ưu tiên 1 (đối tượng 01–04)', points: 2 },
];

export function BonusPrioritySection({
  config,
  bonusValues,
  bonusErrors,
  priorityValue,
  priorityError,
  bonusResult,
  priorityResult,
  onBonusChange,
  onPriorityChange,
}: BonusPrioritySectionProps) {
  const [areaId, setAreaId] = useState('');
  const [groupId, setGroupId] = useState('');
  const areaSelectId = useId();
  const groupSelectId = useId();

  function applySelection(nextAreaId: string, nextGroupId: string) {
    const area = AREA_OPTIONS.find((option) => option.id === nextAreaId);
    const group = PRIORITY_GROUP_OPTIONS.find((option) => option.id === nextGroupId);
    if (area?.points === null || group?.points === null || area === undefined || group === undefined) return;
    onPriorityChange(String(area.points + group.points));
  }

  return (
    <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
      <SectionHeader index="04" title="Ưu tiên & Điểm cộng" />

      <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-ink">Điểm cộng</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
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
          <div className="flex items-center justify-between rounded-lg bg-surface-soft p-4 text-sm">
            <span className="text-muted">Điểm cộng nhận</span>
            <span className="font-semibold text-ink">
              {bonusResult.received.toFixed(2)} / {config.bonus.maxTotal}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-ink">Ưu tiên</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={areaSelectId} className="text-sm font-medium text-ink">
                Khu vực
              </label>
              <select
                id={areaSelectId}
                value={areaId}
                onChange={(e) => {
                  setAreaId(e.target.value);
                  applySelection(e.target.value, groupId);
                }}
                className="mt-1 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 sm:h-12"
              >
                {AREA_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                    {option.points !== null ? ` (+${option.points})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={groupSelectId} className="text-sm font-medium text-ink">
                Đối tượng ưu tiên
              </label>
              <select
                id={groupSelectId}
                value={groupId}
                onChange={(e) => {
                  setGroupId(e.target.value);
                  applySelection(areaId, e.target.value);
                }}
                className="mt-1 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 sm:h-12"
              >
                {PRIORITY_GROUP_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                    {option.points !== null ? ` (+${option.points})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-muted">
            Chọn khu vực + đối tượng để tự động điền, hoặc nhập tay bên dưới nếu bạn đã biết điểm ưu tiên của mình.
          </p>

          <ScoreInput
            id="priority-raw30"
            label="Điểm ưu tiên khu vực/đối tượng theo thang 30"
            hint={`0 - ${config.priority.maxRaw30Scale}`}
            value={priorityValue}
            error={priorityError}
            onChange={onPriorityChange}
          />
          <div className="flex items-center justify-between rounded-lg bg-surface-soft p-4 text-sm">
            <span className="text-muted">Ưu tiên thực nhận</span>
            <span className="font-semibold text-ink">{priorityResult.received.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
