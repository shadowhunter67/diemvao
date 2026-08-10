import type { AdmissionResult } from '../schools/hcmut/types/admission';
import type { HcmutProgram } from '../schools/hcmut/types/programs';

interface StickySummaryBarProps {
  result: AdmissionResult | null;
  selectedProgram: HcmutProgram | null;
  gap: number | null;
}

/**
 * Thanh tóm tắt dính đầu màn hình chỉ dùng cho mobile/tablet (< lg) — desktop đã có
 * sticky sidebar đầy đủ (DashboardHero). Cố tình rút gọn thay vì nhồi nguyên 2 card Hero
 * (~650px) vào một thanh dính: trên màn hình mobile ~800px cao, ghim cả Hero chi tiết sẽ
 * chiếm gần hết viewport, không còn chỗ xem input — phản tác dụng so với mục đích "tiện
 * theo dõi khi cuộn". Bấm vào thanh để cuộn về Hero đầy đủ ở đầu trang.
 */
export function StickySummaryBar({ result, selectedProgram, gap }: StickySummaryBarProps) {
  if (result === null) return null;

  return (
    <div className="sticky top-0 z-10 border-b border-ink/10 bg-surface/95 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2 text-left text-sm"
      >
        <span className="font-bold text-primary">
          {result.finalScore.toFixed(2)}
          <span className="ml-0.5 text-xs font-normal text-muted">/100</span>
        </span>
        {selectedProgram && gap !== null && (
          <span className="truncate text-xs text-muted">
            {selectedProgram.name} ·{' '}
            <span className={gap >= 0 ? 'text-success' : 'text-warning'}>
              {gap >= 0 ? '+' : ''}
              {gap.toFixed(2)}
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
