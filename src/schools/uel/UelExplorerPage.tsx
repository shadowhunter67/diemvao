import { useState } from 'react';
import { AlertTriangle, Award, CheckCircle2, GraduationCap, ShieldCheck, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { verificationLabel } from '../../core/trust';
import { uelPrograms } from './data/programs';
import { uelCutoffs } from './data/cutoffs';
import { uelSources } from './sources';
import { checkThptThreshold } from './eligibility';
import { UEL_PRIORITY_BY_ZONE_SCALE_100 } from './data/thresholds';
import { UEL_BONUS_CATEGORIES, UEL_BONUS_OVERALL_CAP, type UelBonusCategoryId } from './data/bonus';
import { calculateUelBonusEligibility } from './bonus';

interface UelExplorerPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * UEL Admission Explorer — cùng pattern UitInfoPage.tsx (Level A/B/C thật, Level D exact
 * calculator blocked). Research 2026-08-11, xem docs/admission-research-2026.md. Formula 3
 * thành phần (ĐGNL/THPT/học bạ) đã biết ĐẦY ĐỦ cách quy đổi (rõ hơn UIT), nhưng KHÔNG mở exact
 * calculator vì còn thiếu: bảng điểm cộng chứng chỉ ngoại ngữ chi tiết theo mức, và quy tắc giảm
 * điểm ưu tiên khi tổng điểm cao (nếu có) chưa xác nhận được nguồn — sai 1 trong 2 phần này vẫn
 * có thể ra điểm cuối sai, nên giữ nguyên tắc "đúng dữ liệu > mở đủ calculator".
 */
export function UelExplorerPage({ onChangeSchool }: UelExplorerPageProps) {
  const cutoffsByProgram = new Map(uelCutoffs.map((cutoff) => [cutoff.programId, cutoff]));

  const [thptRaw, setThptRaw] = useState('');
  const thptResult = thptRaw.trim() !== '' ? checkThptThreshold(Number(thptRaw)) : null;

  const [selectedBonus, setSelectedBonus] = useState<UelBonusCategoryId[]>([]);
  function toggleBonus(id: UelBonusCategoryId) {
    setSelectedBonus((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }
  const bonusEligibility = calculateUelBonusEligibility(selectedBonus);

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UEL', name: 'Trường Đại học Kinh tế - Luật – ĐHQG TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/uel`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Công thức đã biết (phần lớn)</h2>
          <p className="mt-2 text-sm text-muted">
            Phương thức Xét tuyển Tổng hợp {YEAR}, thang điểm 100:{' '}
            <span className="font-mono text-ink">Điểm xét tuyển = Học lực + Điểm cộng + Điểm ưu tiên</span>. Điểm học
            lực (có đủ ĐGNL+THPT): <span className="font-mono text-ink">55%×ĐGNL + 35%×THPT + 10%×Học bạ</span> — nếu
            chỉ có THPT: <span className="font-mono text-ink">90%×THPT + 10%×Học bạ</span>; nếu chỉ có ĐGNL:{' '}
            <span className="font-mono text-ink">90%×ĐGNL + 10%×Học bạ</span>.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>ĐGNL quy đổi thang 100 = điểm bài thi ĐGNL × 100/1200</li>
            <li>THPT quy đổi thang 100 = tổng 3 môn tổ hợp × 100/30</li>
            <li>
              Học bạ quy đổi thang 100 = tổng điểm trung bình 3 môn tổ hợp × 100/30, mỗi môn lấy trung bình cả năm
              lớp 10, 11, 12
            </li>
          </ul>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Uniscore chưa tính được điểm xét tuyển chính xác cho UEL</p>
            <p className="mt-1 leading-relaxed">
              3 thành phần điểm học lực đã có công thức quy đổi rõ ràng, nhưng vẫn còn thiếu để ra một điểm cuối cùng
              đáng tin cậy:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              <li>Bảng điểm cộng chứng chỉ ngoại ngữ quốc tế theo từng mức (chỉ biết khoảng 2–5/100, chưa có bảng)</li>
              <li>Quy tắc giảm điểm ưu tiên khu vực/đối tượng khi tổng điểm đạt ngưỡng cao (nếu có) — chưa xác nhận được nguồn</li>
            </ul>
            <p className="mt-2 leading-relaxed">
              Trong lúc chờ, bạn vẫn có thể kiểm tra ngưỡng đầu vào, xem mình đủ điều kiện được xét điểm cộng nhóm
              nào, tra điểm ưu tiên khu vực tham khảo, và xem điểm chuẩn/nguồn ở dưới.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Kiểm tra ngưỡng đầu vào</h2>
          </div>
          <p className="mt-1 text-sm text-muted">Tổng điểm 3 môn thi tốt nghiệp THPT theo tổ hợp xét tuyển (thang 30, chưa quy đổi).</p>
          <div className="mt-3 max-w-xs">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={30}
              value={thptRaw}
              onChange={(e) => setThptRaw(e.target.value)}
              placeholder="0 - 30"
              className="w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
          {thptResult && (
            <p className={`mt-2 flex items-start gap-1.5 text-sm ${thptResult.pass ? 'text-success' : 'text-muted'}`}>
              {thptResult.pass ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <XCircle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
              )}
              <span>{thptResult.requiredText}{thptResult.pass ? ' — đạt' : ' — chưa đạt'}</span>
            </p>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Điều kiện được xét điểm cộng</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Tổng điểm cộng theo quy định không vượt quá {UEL_BONUS_OVERALL_CAP}/100. Chứng chỉ ngoại ngữ quốc tế cũng
            có điểm cộng nhưng bảng chi tiết chưa đọc được — chưa đưa vào đây.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {UEL_BONUS_CATEGORIES.map((category) => {
              const checked = selectedBonus.includes(category.id);
              return (
                <label
                  key={category.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                    checked ? 'border-accent/40 bg-accent/10' : 'border-ink/10 bg-surface hover:bg-ink/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBonus(category.id)}
                    className="mt-0.5 size-4 shrink-0 accent-accent"
                  />
                  <span>
                    <span className="flex items-center gap-2">
                      <span className={`font-medium ${checked ? 'text-primary' : 'text-ink'}`}>{category.label}</span>
                      <span className="text-xs text-muted">tối đa {category.maxPoints}</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{category.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {bonusEligibility.eligibleCategories.length > 0 && (
            <p className="mt-3 text-xs text-muted">
              Bạn thuộc {bonusEligibility.eligibleCategories.length} nhóm có thể được xét — UniScore chưa xác định số
              điểm thực nhận.
            </p>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Điểm ưu tiên khu vực (tham khảo)</h2>
          <p className="mt-1 text-xs text-muted">
            Thang 100 — chưa xác nhận quy tắc giảm dần khi tổng điểm cao, chỉ dùng tra cứu, không cộng vào một điểm
            cuối cùng ở đây.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-lg bg-surface p-3">
              <div className="text-xs text-muted">KV1</div>
              <div className="font-medium text-ink">{UEL_PRIORITY_BY_ZONE_SCALE_100.kv1}</div>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <div className="text-xs text-muted">KV2-NT</div>
              <div className="font-medium text-ink">{UEL_PRIORITY_BY_ZONE_SCALE_100.kv2Nt}</div>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <div className="text-xs text-muted">KV2</div>
              <div className="font-medium text-ink">{UEL_PRIORITY_BY_ZONE_SCALE_100.kv2}</div>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <div className="text-xs text-muted">KV3</div>
              <div className="font-medium text-ink">{UEL_PRIORITY_BY_ZONE_SCALE_100.kv3}</div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Điểm chuẩn trúng tuyển {YEAR} (38 ngành/chuyên ngành)</h2>
          </div>
          <p className="mt-1 text-xs text-muted">Thang 100, đã bao gồm điểm cộng và điểm ưu tiên — theo đúng công bố gốc.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <caption className="sr-only">Điểm chuẩn trúng tuyển UEL {YEAR}</caption>
              <thead>
                <tr className="text-left text-xs font-medium text-muted">
                  <th scope="col" className="py-2 pr-3">
                    Ngành/chuyên ngành
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
                {uelPrograms.map((program) => {
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
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {uelSources.map((source) => (
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
