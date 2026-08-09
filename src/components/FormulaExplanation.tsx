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
          Điểm học lực = {toPercent(config.weights.dgnl)} ĐGNL + {toPercent(config.weights.thpt)} THPT +{' '}
          {toPercent(config.weights.transcript)} học bạ
        </p>
        <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed sm:text-sm">
          Điểm xét tuyển = Điểm học lực + điểm cộng + điểm ưu tiên
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        Công cụ chỉ nhằm hỗ trợ tính toán. Thí sinh nên đối chiếu thông tin tuyển sinh chính thức
        của Trường Đại học Bách khoa – ĐHQG TP.HCM.
      </p>
    </section>
  );
}
