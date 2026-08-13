import type { CalculationStep } from '../core/calculationStep';
import { EvidenceLinks } from './EvidenceLinks';

interface FormulaExplanationProps {
  steps: CalculationStep[];
}

/**
 * Renderer THUẦN — không hard-code công thức tuyển sinh (percentages, ngưỡng, hệ số...). Toàn bộ
 * label/formula/output/evidence đọc từ `CalculationStep[]` do domain layer sinh ra
 * (`schools/hcmut/evaluate.ts`). Nếu công thức đổi (đổi năm, đổi trọng số), sửa ở evaluate.ts —
 * component này không cần đụng tới.
 */
export function FormulaExplanation({ steps }: FormulaExplanationProps) {
  return (
    <details id="formula-section" className="group rounded-2xl bg-surface-soft p-6 sm:p-8">
      <summary className="cursor-pointer list-none text-lg font-semibold text-ink marker:content-none">
        <span className="inline-flex items-center gap-2">
          Xem cách tính
          <span className="text-muted transition-transform group-open:rotate-180">▾</span>
        </span>
      </summary>

      {steps.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Nhập điểm để xem cách tính từng bước.</p>
      ) : (
      <ol className="mt-6 flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step.id} className="rounded-lg border border-ink/10 bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-muted">{index + 1}.</span>
                <span className="text-sm font-semibold text-ink">{step.label}</span>
              </div>
              {step.output !== undefined && (
                <span className="shrink-0 text-sm font-semibold text-primary">
                  {step.output.toFixed(2)}
                  {step.scale !== undefined && <span className="ml-0.5 text-xs font-normal text-muted">/ {step.scale}</span>}
                </span>
              )}
            </div>

            {step.formula && <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted">{step.formula}</p>}
            {step.description && <p className="mt-1 text-xs text-muted">{step.description}</p>}

            {step.evidence && step.evidence.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-medium text-accent">Nguồn</summary>
                <EvidenceLinks evidence={step.evidence} />
              </details>
            )}
          </li>
        ))}
      </ol>
      )}

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Công cụ chỉ nhằm hỗ trợ tính toán. Thí sinh nên đối chiếu thông tin tuyển sinh chính thức
        của Trường Đại học Bách khoa – ĐHQG TP.HCM.
      </p>
    </details>
  );
}
