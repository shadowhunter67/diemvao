import { useState } from 'react';
import { AlertTriangle, ArrowRightLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { verificationLabel } from '../../core/trust';
import { uehPrograms } from './data/programs';
import { uehCutoffs } from './data/cutoffs';
import { uehSources } from './sources';
import { convertDgnlToThpt } from './dgnlConversion';
import { checkUehThreshold } from './eligibility';

interface UehExplorerPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * UEH Admission Explorer — research 2026-08-11 (xem docs/admission-research-2026.md). Khác UIT/
 * UEL: có bảng quy đổi ĐGNL→THPT ĐẦY ĐỦ (12 khoảng, verified, không phải ảnh) nên implement luôn
 * `convertDgnlToThpt` như một tool thật (scoreConversion capability). Vẫn KHÔNG có exact
 * calculator: bước quy đổi cuối cùng từ (điểm thi thang 30 + học bạ) sang điểm xét thang 100
 * không đủ rõ trong nguồn đã đọc, và bảng điểm cộng/ưu tiên chưa xác nhận — sai 1 trong 2 vẫn ra
 * điểm cuối sai.
 */
export function UehExplorerPage({ onChangeSchool }: UehExplorerPageProps) {
  const ksaPrograms = uehPrograms.filter((p) => p.campus === 'hcmc');
  const ksvPrograms = uehPrograms.filter((p) => p.campus === 'mekong');
  const cutoffsByProgram = new Map(uehCutoffs.map((c) => [c.programId, c]));

  const [dgnlInput, setDgnlInput] = useState('');
  const dgnlResult = dgnlInput.trim() !== '' ? convertDgnlToThpt(Number(dgnlInput)) : undefined;

  const [thresholdInput, setThresholdInput] = useState('');
  const [campus, setCampus] = useState<'hcmc' | 'mekong'>('hcmc');
  const thresholdResult = thresholdInput.trim() !== '' ? checkUehThreshold(Number(thresholdInput), campus) : null;

  function renderCutoffTable(programs: typeof ksaPrograms, caption: string) {
    return (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="text-left text-xs font-medium text-muted">
              <th scope="col" className="py-2 pr-3">
                Ngành/chương trình
              </th>
              <th scope="col" className="py-2 pr-3">
                Mã
              </th>
              <th scope="col" className="py-2">
                Điểm chuẩn
              </th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => {
              const cutoff = cutoffsByProgram.get(program.id);
              return (
                <tr key={program.id} className="border-t border-ink/5">
                  <td className="py-2.5 pr-3 text-ink">{program.name}</td>
                  <td className="py-2.5 pr-3 text-muted">{program.code}</td>
                  <td className="py-2.5 font-medium text-ink">
                    {cutoff ? cutoff.score.toFixed(2) : <span className="font-normal text-muted">Chưa công bố</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UEH', name: 'Trường Đại học Kinh tế TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/ueh`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Công thức đã biết (phần lớn)</h2>
          <p className="mt-2 text-sm text-muted">
            Phương thức Xét tuyển tích hợp {YEAR}, thang điểm 100:{' '}
            <span className="font-mono text-ink">Điểm xét = 60%×Điểm thi (quy đổi) + 40%×Điểm học bạ (quy đổi)</span>.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>
              Điểm thi: nếu dùng ĐGNL-HCM hoặc V-SAT thì quy đổi sang thang điểm thi tốt nghiệp THPT (thang 30) theo
              bảng 12 khoảng chính thức — xem công cụ quy đổi bên dưới.
            </li>
            <li>
              Điểm học bạ ={' '}
              <span className="font-mono text-ink">(ĐTB lớp 10×1 + ĐTB lớp 11×2 + ĐTB lớp 12×3) / 6</span>.
            </li>
          </ul>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Uniscore chưa tính được điểm xét tuyển chính xác cho UEH</p>
            <p className="mt-1 leading-relaxed">
              Bảng quy đổi ĐGNL/V-SAT và công thức học bạ đã rõ, nhưng vẫn còn thiếu:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              <li>Bước quy đổi cuối cùng từ (điểm thi thang 30 + học bạ) sang điểm xét thang 100 — nguồn chưa nêu rõ hệ số cụ thể</li>
              <li>Bảng điểm cộng/điểm ưu tiên chính thức (mới thấy ví dụ minh họa, chưa phải bảng đầy đủ)</li>
            </ul>
            <p className="mt-2 leading-relaxed">
              Trong lúc chờ, bạn có thể dùng công cụ quy đổi ĐGNL→THPT bên dưới (đã verified), kiểm tra ngưỡng đầu
              vào, và xem điểm chuẩn 2026.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Quy đổi điểm ĐGNL-HCM → thang THPT</h2>
          </div>
          <p className="mt-1 text-sm text-muted">Thang ĐGNL 450–1200. Áp dụng đúng bảng 12 khoảng UEH công bố.</p>
          <div className="mt-3 max-w-xs">
            <input
              type="number"
              inputMode="decimal"
              min={450}
              max={1200}
              value={dgnlInput}
              onChange={(e) => setDgnlInput(e.target.value)}
              placeholder="450 - 1200"
              className="w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
          {dgnlResult !== undefined && (
            <p className="mt-2 text-sm text-ink">
              {dgnlResult === null ? (
                <span className="text-muted">Ngoài khoảng bảng công bố (450–1200).</span>
              ) : (
                <>
                  Điểm THPT tương đương:{' '}
                  <strong className="text-primary">{dgnlResult.toFixed(2)}</strong> / 30
                </>
              )}
            </p>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Kiểm tra ngưỡng đầu vào</h2>
          </div>
          <p className="mt-1 text-sm text-muted">Điểm xét tuyển thang 100 (chưa gồm ưu tiên/điểm cộng), theo cơ sở đào tạo.</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="max-w-xs">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                placeholder="0 - 100"
                className="w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
            </div>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value as 'hcmc' | 'mekong')}
              className="rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="hcmc">TP.HCM (KSA)</option>
              <option value="mekong">UEH Mekong – Vĩnh Long (KSV)</option>
            </select>
          </div>
          {thresholdResult && (
            <p className={`mt-2 text-sm ${thresholdResult.pass ? 'text-success' : 'text-muted'}`}>
              {thresholdResult.requiredText} — {thresholdResult.pass ? 'đạt' : 'chưa đạt'}
            </p>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Điểm chuẩn trúng tuyển {YEAR} — TP.HCM (KSA, {ksaPrograms.length} chương trình)</h2>
          </div>
          {renderCutoffTable(ksaPrograms, `Điểm chuẩn UEH KSA ${YEAR}`)}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Điểm chuẩn trúng tuyển {YEAR} — UEH Mekong (KSV, {ksvPrograms.length} chương trình)</h2>
          {renderCutoffTable(ksvPrograms, `Điểm chuẩn UEH KSV ${YEAR}`)}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {uehSources.map((source) => (
              <li key={source.id}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline-offset-2 hover:underline"
                >
                  {source.title}
                </a>
                <span className="text-muted"> — {source.publisher} </span>
                <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-muted">{verificationLabel(source.verification)}</span>
              </li>
            ))}
          </ul>
        </section>

        <Footer />
      </div>
    </div>
  );
}
