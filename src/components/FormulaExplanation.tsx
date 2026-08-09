import type { AdmissionConfig } from '../types/admission';

interface FormulaExplanationProps {
  config: AdmissionConfig;
}

function toPercent(weight: number): string {
  return `${Math.round(weight * 100)}%`;
}

export function FormulaExplanation({ config }: FormulaExplanationProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Cách tính</h2>

      <div className="mt-3 flex flex-col gap-3 text-sm text-slate-600">
        <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed sm:text-sm">
          ĐGNL chuẩn hóa = (Tiếng Việt + Tiếng Anh + Toán×{config.dgnl.mathMultiplier} + Tư duy khoa học) /{' '}
          {config.dgnl.maxWeightedTotal} × {config.scoreScale}
        </p>
        <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed sm:text-sm">
          THPT / Học bạ chuẩn hóa = (Toán×{config.thpt.mathMultiplier} + Môn 2 + Môn 3) / {config.thpt.mathMultiplier + 2} /{' '}
          {config.thpt.maxPerSubject} × {config.scoreScale}
        </p>
        <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed sm:text-sm">
          Điểm học lực = {toPercent(config.weights.dgnl)} ĐGNL + {toPercent(config.weights.thpt)} THPT +{' '}
          {toPercent(config.weights.transcript)} học bạ
        </p>
        <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed sm:text-sm">
          Điểm cộng = Thưởng + Xét thưởng + Khuyến khích (tối đa {config.bonus.maxTotal})
        </p>
        <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed sm:text-sm">
          Ưu tiên quy đổi = Ưu tiên thang 30 / {config.priority.scaleDivisor} × {config.priority.scaleMultiplier}, giảm dần khi
          (điểm học lực + điểm cộng) ≥ {config.priority.reductionThreshold}
        </p>
        <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed sm:text-sm">
          Điểm xét tuyển = Điểm học lực + điểm cộng + điểm ưu tiên thực nhận (tối đa {config.scoreScale})
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        Công cụ chỉ nhằm hỗ trợ tính toán. Thí sinh nên đối chiếu thông tin tuyển sinh chính thức
        của Trường Đại học Bách khoa – ĐHQG TP.HCM.
      </p>
    </section>
  );
}
