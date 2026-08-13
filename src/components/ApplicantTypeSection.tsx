import { Users } from 'lucide-react';
import {
  APPLICANT_TYPE_INFO,
  HCMUT_APPLICANT_TYPES,
  SUPPORTED_APPLICANT_TYPES,
  type HcmutApplicantType,
} from '../schools/hcmut/types/applicantType';

interface ApplicantTypeSectionProps {
  value: HcmutApplicantType;
  onChange: (type: HcmutApplicantType) => void;
}

export function ApplicantTypeSection({ value, onChange }: ApplicantTypeSectionProps) {
  const isSupported = SUPPORTED_APPLICANT_TYPES.includes(value);

  return (
    <section className="rounded-card bg-surface p-6 shadow-card sm:p-8">
      <div className="flex items-center gap-2">
        <Users size={20} className="text-accent" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-ink">Bạn thuộc nhóm nào?</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        HCMUT xét tuyển tổng hợp cho nhiều nhóm thí sinh khác nhau — chọn đúng nhóm để tính điểm chính xác.
      </p>

      <div role="radiogroup" aria-label="Nhóm thí sinh" className="mt-4 flex flex-col gap-2">
        {HCMUT_APPLICANT_TYPES.map((type) => {
          const info = APPLICANT_TYPE_INFO[type];
          const selected = value === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(type)}
              className={`rounded-lg border p-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                selected ? 'border-accent/40 bg-accent/10' : 'border-ink/10 hover:bg-ink/5'
              }`}
            >
              <span className={`font-medium ${selected ? 'text-primary' : 'text-ink'}`}>{info.label}</span>
              <span className="mt-0.5 block text-xs text-muted">{info.description}</span>
            </button>
          );
        })}
      </div>

      {!isSupported && (
        <p className="mt-4 rounded-lg bg-warning/10 p-3 text-xs leading-relaxed text-warning">
          Nhóm này chưa có công thức đủ rõ từ nguồn chính thức HCMUT 2026 nên UniscoreVN chưa tính điểm được — tránh
          hiển thị kết quả sai. Xem chi tiết research tại{' '}
          <a
            href="https://github.com/shadowhunter67/uniscore/blob/main/docs/admission-research-2026.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            docs/admission-research-2026.md
          </a>
          .
        </p>
      )}
    </section>
  );
}
