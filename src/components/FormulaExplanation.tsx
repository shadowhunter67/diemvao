import { Fragment } from 'react';
import { ArrowDown, Plus } from 'lucide-react';
import type { AdmissionConfig } from '../schools/hcmut/types/admission';

interface FormulaExplanationProps {
  config: AdmissionConfig;
}

function toPercent(weight: number): string {
  return `${Math.round(weight * 100)}%`;
}

interface TopNodeProps {
  title: string;
  badge: string;
  caption?: string;
  chips: string[];
  denominatorParts: string[];
  scoreScale: number;
}

function TopFormulaNode({ title, badge, caption, chips, denominatorParts, scoreScale }: TopNodeProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-ink/10 bg-surface p-4 text-center">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-ink">{title}</span>
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">{badge}</span>
      </div>

      {caption && <p className="text-xs text-muted">{caption}</p>}

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {chips.map((chip, index) => (
          <Fragment key={chip}>
            {index > 0 && <Plus size={12} className="text-muted" aria-hidden="true" />}
            <span className="rounded-md bg-ink/5 px-2 py-1 text-xs font-medium text-ink">{chip}</span>
          </Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted">
        <div className="flex flex-col items-center">
          <span>Tổng</span>
          <span className="my-0.5 h-px w-12 bg-ink/20" />
          <span>{denominatorParts.join(' × ')}</span>
        </div>
        <span>× {scoreScale}</span>
      </div>
    </div>
  );
}

interface NodeProps {
  title: string;
  badge?: string;
  formula: string;
  tone?: 'default' | 'accent' | 'final';
}

function FormulaNode({ title, badge, formula, tone = 'default' }: NodeProps) {
  const toneClass =
    tone === 'final'
      ? 'border-primary/20 bg-primary text-white'
      : tone === 'accent'
        ? 'border-accent/25 bg-accent/10 text-primary'
        : 'border-ink/10 bg-surface text-ink';

  return (
    <div className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center ${toneClass}`}>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${tone === 'final' ? 'text-white' : 'text-ink'}`}>{title}</span>
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              tone === 'final' ? 'bg-white/20 text-white' : 'bg-accent/15 text-accent'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <p className={`font-mono text-xs leading-relaxed ${tone === 'final' ? 'text-white/85' : 'text-muted'}`}>
        {formula}
      </p>
    </div>
  );
}

function Connector({ label }: { label?: 'plus' }) {
  return (
    <div className="flex items-center justify-center py-0.5 text-muted">
      {label === 'plus' ? <Plus size={16} aria-hidden="true" /> : <ArrowDown size={18} aria-hidden="true" />}
    </div>
  );
}

export function FormulaExplanation({ config }: FormulaExplanationProps) {
  return (
    <details id="formula-section" className="group rounded-2xl bg-surface-soft p-6 sm:p-8">
      <summary className="cursor-pointer list-none text-lg font-semibold text-ink marker:content-none">
        <span className="inline-flex items-center gap-2">
          Xem công thức tính
          <span className="text-muted transition-transform group-open:rotate-180">▾</span>
        </span>
      </summary>

      <div className="mt-6 flex flex-col items-stretch gap-1">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TopFormulaNode
            title="ĐGNL"
            badge={toPercent(config.weights.dgnl)}
            chips={['Tiếng Việt', 'Tiếng Anh', `Toán×${config.dgnl.mathMultiplier}`, 'Tư duy khoa học']}
            denominatorParts={[`${config.dgnl.maxWeightedTotal}`]}
            scoreScale={config.scoreScale}
          />
          <TopFormulaNode
            title="THPT"
            badge={toPercent(config.weights.thpt)}
            chips={[`Toán×${config.thpt.mathMultiplier}`, 'Môn 2', 'Môn 3']}
            denominatorParts={[`${config.thpt.mathMultiplier + 2}`, `${config.thpt.maxPerSubject}`]}
            scoreScale={config.scoreScale}
          />
          <TopFormulaNode
            title="Học bạ"
            badge={toPercent(config.weights.transcript)}
            caption="Mỗi năm (lớp 10, 11, 12):"
            chips={[`Toán×${config.transcript.mathMultiplier}`, 'Môn 2', 'Môn 3']}
            denominatorParts={[
              `${config.transcript.mathMultiplier + 2}`,
              '3 năm',
              `${config.transcript.maxPerSubject}`,
            ]}
            scoreScale={config.scoreScale}
          />
        </div>

        <Connector />

        <FormulaNode
          tone="accent"
          title="Điểm học lực"
          formula={`${toPercent(config.weights.dgnl)} ĐGNL + ${toPercent(config.weights.thpt)} THPT + ${toPercent(config.weights.transcript)} học bạ`}
        />

        <Connector />

        <div className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[1fr_auto_1fr]">
          <FormulaNode
            title="Điểm cộng"
            formula={`Thưởng + Xét thưởng + Khuyến khích (tối đa ${config.bonus.maxTotal})`}
          />
          <Connector label="plus" />
          <FormulaNode
            title="Ưu tiên thực nhận"
            formula={`Ưu tiên thang 30 / ${config.priority.scaleDivisor} × ${config.priority.scaleMultiplier}, giảm dần khi tổng ≥ ${config.priority.reductionThreshold}`}
          />
        </div>

        <Connector />

        <FormulaNode tone="final" title="Điểm xét tuyển" formula={`Điểm học lực + điểm cộng + ưu tiên (tối đa ${config.scoreScale})`} />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Công cụ chỉ nhằm hỗ trợ tính toán. Thí sinh nên đối chiếu thông tin tuyển sinh chính thức
        của Trường Đại học Bách khoa – ĐHQG TP.HCM.
      </p>
    </details>
  );
}
