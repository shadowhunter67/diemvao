import { hcmueProgramThresholds } from './data/programs';

export function HcmuePage({ onChangeSchool }: { onChangeSchool: () => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <button type="button" onClick={onChangeSchool} className="text-xs font-medium text-accent underline-offset-2 hover:underline">
        Ve trang chu
      </button>
      <header className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">HCMUE 2026</p>
        <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Truong Dai hoc Su pham TP.HCM</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          UniscoreVN hien chi ho tro kiem tra nguong dau vao THPT 2026 cho 47 nganh tai tru so chinh TP.HCM. Nguong dau vao khong phai diem trung tuyen va khong duoc hien thi nhu diem chuan.
        </p>
      </header>

      <section className="mt-5 rounded-card border border-ink/10 bg-surface p-4">
        <h2 className="text-base font-semibold text-ink">Pham vi ho tro</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-md bg-success/10 p-3">
            <p className="font-medium text-ink">Co the lam</p>
            <p className="mt-1 text-xs text-muted">Kiem tra tong diem THPT theo to hop so voi nguong dau vao nganh da chon.</p>
          </div>
          <div className="rounded-md bg-warning/10 p-3">
            <p className="font-medium text-ink">Chua lam</p>
            <p className="mt-1 text-xs text-muted">Chua tinh diem trung tuyen cuoi, chua so voi diem chuan 2026.</p>
          </div>
          <div className="rounded-md bg-surface-soft p-3">
            <p className="font-medium text-ink">Dung o dau</p>
            <p className="mt-1 text-xs text-muted">Mo trang So sanh, them HCMUE, chon nganh va to hop.</p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-card border border-ink/10 bg-surface p-4">
        <h2 className="text-base font-semibold text-ink">Nganh da co nguong dau vao</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {hcmueProgramThresholds.map((program) => (
            <div key={program.id} className="rounded-md border border-ink/10 p-3 text-xs">
              <p className="font-semibold text-ink">
                {program.code} - {program.name}
              </p>
              <p className="mt-1 text-muted">THPT: {program.thptThreshold30.toFixed(2)} / 30</p>
              <p className="text-muted">Hoc ba + DGNLCB: {program.dgnlcbThreshold30.toFixed(2)} / 30</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
