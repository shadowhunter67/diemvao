import { AlertTriangle, GraduationCap } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { verificationLabel } from '../../core/trust';
import { uitPrograms } from './data/programs';
import { uitCutoffs } from './data/cutoffs';
import { uitSources } from './sources';
import { EligibilityChecker } from './components/EligibilityChecker';
import { BonusChecker } from './components/BonusChecker';
import { DirectAdmissionSection } from './components/DirectAdmissionSection';

interface UitInfoPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * UIT Admission Explorer — Level A (thông tin) + B (điểm chuẩn) + C (admission eligibility checker
 * dùng bảng ngưỡng chính xác đã xác minh; bonus checker chỉ báo eligibility + mức trần, KHÔNG
 * suy ra awarded points — xem `bonus.ts`) đều đã có thật. Level D (exact final score) vẫn
 * blocked — thiếu công thức bách phân vị THPT↔ĐGNL, cách tính học bạ, quy đổi SAT/ACT/IB/A-Level
 * — không suy đoán, xem khối cảnh báo trong JSX. Component con: EligibilityChecker, BonusChecker,
 * DirectAdmissionSection (schools/uit/components/) — đều pure-data-driven, không hard-code UI text
 * cho số liệu (đọc từ data/*.ts để nguồn/wording đồng nhất khi cần sửa).
 */
export function UitInfoPage({ onChangeSchool }: UitInfoPageProps) {
  const finalCutoffs = uitCutoffs.filter((cutoff) => (cutoff.status ?? 'final') === 'final');
  const cutoffsByProgram = new Map(finalCutoffs.map((cutoff) => [cutoff.programId, cutoff]));

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UIT', name: 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/uit`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Công thức đã biết (một phần)</h2>
          <p className="mt-2 text-sm text-muted">
            Phương thức Xét tuyển Tổng hợp {YEAR}, thang điểm 100:{' '}
            <span className="font-mono text-ink">47,5%×THPT + 47,5%×ĐGNL + 5%×Học bạ + Điểm cộng + Điểm ưu tiên</span>
            . Trong đó <span className="font-mono text-ink">THPT = Max(THPT thi, THPT quy đổi từ ĐGNL, THPT từ chứng
            chỉ quốc tế)</span> và tương tự cho ĐGNL — quy đổi giữa THPT và ĐGNL theo "phương pháp bách phân vị".
            Điểm cộng tối đa <strong className="text-ink">10/100</strong>.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Uniscore chưa tính được điểm xét tuyển chính xác cho UIT</p>
            <p className="mt-1 leading-relaxed">
              Trọng số tổng và bảng điểm cộng đã xác minh (dùng được ở dưới), nhưng cách quy đổi bách phân vị và một
              số thành phần vẫn chưa có nguồn dạng text đọc được (chỉ tồn tại dạng ảnh/PDF) — cụ thể còn thiếu:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              <li>Công thức/bảng quy đổi bách phân vị giữa THPT và ĐGNL</li>
              <li>Cách tính điểm Học bạ</li>
              <li>Cách quy đổi SAT/ACT sang thành phần ĐGNL</li>
              <li>Cách quy đổi IB/A-Level sang thành phần THPT</li>
            </ul>
            <p className="mt-2 leading-relaxed">
              Đang chờ nguồn chính thức đọc được trực tiếp — không suy đoán công thức để tránh hiển thị kết quả sai.
              Trong lúc chờ, bạn vẫn có thể kiểm tra điều kiện tham gia xét tuyển, xem mình đủ điều kiện được xét
              điểm cộng nhóm nào, và xem điểm chuẩn/tuyển thẳng ở dưới.
            </p>
          </div>
        </section>

        <EligibilityChecker />

        <BonusChecker />

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">Điểm chuẩn trúng tuyển {YEAR} (19 ngành)</h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            Thang 100, đã bao gồm điểm cộng và điểm ưu tiên — theo đúng công bố gốc.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <caption className="sr-only">Điểm chuẩn trúng tuyển UIT {YEAR}</caption>
              <thead>
                <tr className="text-left text-xs font-medium text-muted">
                  <th scope="col" className="py-2 pr-3">
                    Ngành
                  </th>
                  <th scope="col" className="py-2 pr-3">
                    Mã ngành
                  </th>
                  <th scope="col" className="py-2">
                    Điểm chuẩn
                  </th>
                </tr>
              </thead>
              <tbody>
                {uitPrograms.map((program) => {
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

        <DirectAdmissionSection />

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {uitSources.map((source) => (
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
                <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-muted">
                  {verificationLabel(source.verification)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <Footer />
      </div>
    </div>
  );
}
