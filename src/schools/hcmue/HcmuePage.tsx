import { hcmueProgramThresholds } from './data/programs';

export function HcmuePage({ onChangeSchool }: { onChangeSchool: () => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <button type="button" onClick={onChangeSchool} className="text-xs font-medium text-accent underline-offset-2 hover:underline">
        Về trang chủ
      </button>
      <header className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">HCMUE 2026</p>
        <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Trường Đại học Sư phạm TP.HCM</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          UniscoreVN hiện chỉ hỗ trợ kiểm tra ngưỡng đầu vào THPT 2026 cho 47 ngành tại trụ sở chính TP.HCM. Ngưỡng đầu vào không phải điểm trúng tuyển và không được hiển thị như điểm chuẩn.
        </p>
      </header>

      <section className="mt-5 rounded-card border border-ink/10 bg-surface p-4">
        <h2 className="text-base font-semibold text-ink">Phạm vi hỗ trợ</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-md bg-success/10 p-3">
            <p className="font-medium text-ink">Có thể làm</p>
            <p className="mt-1 text-xs text-muted">Kiểm tra tổng điểm THPT theo tổ hợp so với ngưỡng đầu vào ngành đã chọn.</p>
          </div>
          <div className="rounded-md bg-warning/10 p-3">
            <p className="font-medium text-ink">Chưa làm</p>
            <p className="mt-1 text-xs text-muted">Chưa tính điểm trúng tuyển cuối, chưa so với điểm chuẩn 2026.</p>
          </div>
          <div className="rounded-md bg-surface-soft p-3">
            <p className="font-medium text-ink">Dùng ở đâu</p>
            <p className="mt-1 text-xs text-muted">Mở trang So sánh, thêm HCMUE, chọn ngành và tổ hợp.</p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-card border border-ink/10 bg-surface p-4">
        <h2 className="text-base font-semibold text-ink">Ngành đã có ngưỡng đầu vào</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {hcmueProgramThresholds.map((program) => (
            <div key={program.id} className="rounded-md border border-ink/10 p-3 text-xs">
              <p className="font-semibold text-ink">
                {program.code} - {program.name}
              </p>
              <p className="mt-1 text-muted">
                THPT: {program.thptThreshold30 !== undefined ? `${program.thptThreshold30.toFixed(2)} / 30` : 'Chưa công bố'}
              </p>
              <p className="text-muted">
                Học bạ + DGNLCB: {program.dgnlcbThreshold30 !== undefined ? `${program.dgnlcbThreshold30.toFixed(2)} / 30` : 'Chưa công bố'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
