import { AlertTriangle, GraduationCap } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { verificationLabel } from '../../core/trust';
import { uitPrograms } from './data/programs';
import { uitCutoffs } from './data/cutoffs';
import { uitSources } from './sources';

interface UitInfoPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/**
 * UIT chưa có calculator thật — công thức đã biết (trọng số tổng) nhưng thiếu cách chuẩn hóa
 * chi tiết từng thành phần (nguồn chỉ tồn tại dạng ảnh/PDF không đọc được), nên trang này CHỈ
 * hiển thị thông tin/dữ liệu thật đã xác minh, KHÔNG dựng calculator giả đoán công thức.
 */
export function UitInfoPage({ onChangeSchool }: UitInfoPageProps) {
  const cutoffsByProgram = new Map(uitCutoffs.map((cutoff) => [cutoff.programId, cutoff]));

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
            Phương thức Xét tuyển Tổng hợp {YEAR}, thang điểm 100: <strong className="text-ink">THPT 47,5%</strong> +{' '}
            <strong className="text-ink">ĐGNL ĐHQG-HCM 47,5%</strong> + <strong className="text-ink">Học bạ 5%</strong>.
            Điểm cộng (huy chương Olympic/giải quốc gia) tối đa <strong className="text-ink">10/100</strong>.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Uniscore chưa hỗ trợ tính điểm cho UIT</p>
            <p className="mt-1 leading-relaxed">
              Trọng số tổng (THPT/ĐGNL/Học bạ) đã xác minh, nhưng cách quy đổi chi tiết từng thành phần chưa có nguồn
              dạng text đọc được (chỉ tồn tại dạng ảnh/PDF trên trang UIT) — cụ thể còn thiếu:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              <li>Cách chuẩn hóa điểm THPT (có hệ số môn hay không)</li>
              <li>Cách quy đổi điểm ĐGNL (thang 1500) về thành phần trong công thức</li>
              <li>Cách tính điểm Học bạ</li>
              <li>Công thức cho nhóm không có ĐGNL (chỉ biết pathway này tồn tại, chưa có công thức)</li>
              <li>Bảng điểm ưu tiên khu vực/đối tượng riêng của UIT (nếu có)</li>
            </ul>
            <p className="mt-2 leading-relaxed">
              Đang bổ sung khi tìm được nguồn chính thức đọc được trực tiếp — không suy đoán công thức để tránh hiển
              thị kết quả sai.
            </p>
          </div>
        </section>

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
                      <td className="py-2.5 font-medium text-ink">{cutoff ? cutoff.score.toFixed(2) : '—'}</td>
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
