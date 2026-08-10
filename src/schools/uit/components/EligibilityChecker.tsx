import { useState } from 'react';
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { uitPrograms } from '../data/programs';
import {
  checkCertificateQuality,
  checkCertificateRegistration,
  checkDgnlThreshold,
  checkThptThreshold,
  type CertificateType,
} from '../eligibility';
import { TKVM_PROGRAM_IDS } from '../data/thresholds';

const CERTIFICATE_LABELS: Record<CertificateType, string> = {
  sat: 'SAT',
  act: 'ACT',
  'a-level': 'A-Level (PUM 3 môn cao nhất, %)',
  ib: 'IB',
};

function ResultBadge({ pass, text }: { pass: boolean; text: string }) {
  return (
    <p className={`mt-2 flex items-start gap-1.5 text-sm ${pass ? 'text-success' : 'text-muted'}`}>
      {pass ? (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      ) : (
        <XCircle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
      )}
      <span>{text}</span>
    </p>
  );
}

export function EligibilityChecker() {
  const [programId, setProgramId] = useState<string>('');
  const [thptTotal, setThptTotal] = useState('');
  const [thptMath, setThptMath] = useState('');
  const [dgnlTotal, setDgnlTotal] = useState('');
  const [dgnlMath, setDgnlMath] = useState('');
  const [certType, setCertType] = useState<CertificateType>('sat');
  const [certValue, setCertValue] = useState('');

  const isTkvm = TKVM_PROGRAM_IDS.includes(programId);

  const thptResult =
    thptTotal.trim() !== '' ? checkThptThreshold(Number(thptTotal), thptMath.trim() !== '' ? Number(thptMath) : null, programId || null) : null;
  const dgnlResult =
    dgnlTotal.trim() !== '' ? checkDgnlThreshold(Number(dgnlTotal), dgnlMath.trim() !== '' ? Number(dgnlMath) : null, programId || null) : null;
  const certRegResult = certValue.trim() !== '' ? checkCertificateRegistration(certType, Number(certValue)) : null;
  const certQualityResult = certValue.trim() !== '' ? checkCertificateQuality(certType, Number(certValue)) : null;

  const overallPass = [thptResult?.pass, dgnlResult?.pass, certQualityResult?.pass].some(Boolean);
  const hasAnyInput = thptResult !== null || dgnlResult !== null || certQualityResult !== null;

  return (
    <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-ink">Kiểm tra điều kiện tham gia xét tuyển</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Chỉ cần thỏa MỘT trong các điều kiện sau (THPT, ĐGNL, hoặc chứng chỉ quốc tế) là đủ điều kiện tham gia xét
        tuyển tổng hợp.
      </p>

      <div className="mt-4">
        <label htmlFor="uit-program-select" className="text-sm font-medium text-ink">
          Ngành (để áp đúng điều kiện riêng nếu có)
        </label>
        <select
          id="uit-program-select"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          className="mt-1 h-11 w-full rounded-lg border border-ink/10 bg-surface px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        >
          <option value="">— Chưa chọn (áp ngưỡng chung) —</option>
          {uitPrograms.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-surface p-4">
          <label htmlFor="uit-thpt-total" className="text-sm font-medium text-ink">
            Điểm thi tốt nghiệp THPT (tổ hợp)
          </label>
          <input
            id="uit-thpt-total"
            type="text"
            inputMode="decimal"
            value={thptTotal}
            onChange={(e) => setThptTotal(e.target.value)}
            placeholder="0 - 30"
            className="mt-1 h-10 w-full rounded-md border border-ink/10 bg-surface-soft px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
          {isTkvm && (
            <>
              <label htmlFor="uit-thpt-math" className="mt-2 block text-xs font-medium text-ink">
                Điểm Toán (bắt buộc — ngành Thiết kế vi mạch)
              </label>
              <input
                id="uit-thpt-math"
                type="text"
                inputMode="decimal"
                value={thptMath}
                onChange={(e) => setThptMath(e.target.value)}
                placeholder="0 - 10"
                className="mt-1 h-10 w-full rounded-md border border-ink/10 bg-surface-soft px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
            </>
          )}
          {thptResult && <ResultBadge pass={thptResult.pass} text={thptResult.requiredText} />}
        </div>

        <div className="rounded-lg bg-surface p-4">
          <label htmlFor="uit-dgnl-total" className="text-sm font-medium text-ink">
            Điểm ĐGNL ĐHQG-HCM (thang 1500)
          </label>
          <input
            id="uit-dgnl-total"
            type="text"
            inputMode="decimal"
            value={dgnlTotal}
            onChange={(e) => setDgnlTotal(e.target.value)}
            placeholder="0 - 1500"
            className="mt-1 h-10 w-full rounded-md border border-ink/10 bg-surface-soft px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
          {isTkvm && (
            <>
              <label htmlFor="uit-dgnl-math" className="mt-2 block text-xs font-medium text-ink">
                Điểm Toán ĐGNL (bắt buộc — ngành Thiết kế vi mạch)
              </label>
              <input
                id="uit-dgnl-math"
                type="text"
                inputMode="decimal"
                value={dgnlMath}
                onChange={(e) => setDgnlMath(e.target.value)}
                placeholder="0 - 300"
                className="mt-1 h-10 w-full rounded-md border border-ink/10 bg-surface-soft px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
            </>
          )}
          {dgnlResult && <ResultBadge pass={dgnlResult.pass} text={dgnlResult.requiredText} />}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-surface p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="uit-cert-type" className="text-sm font-medium text-ink">
              Chứng chỉ quốc tế
            </label>
            <select
              id="uit-cert-type"
              value={certType}
              onChange={(e) => setCertType(e.target.value as CertificateType)}
              className="mt-1 h-10 rounded-md border border-ink/10 bg-surface-soft px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              {(Object.keys(CERTIFICATE_LABELS) as CertificateType[]).map((type) => (
                <option key={type} value={type}>
                  {CERTIFICATE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="uit-cert-value" className="text-sm font-medium text-ink">
              Điểm
            </label>
            <input
              id="uit-cert-value"
              type="text"
              inputMode="decimal"
              value={certValue}
              onChange={(e) => setCertValue(e.target.value)}
              className="mt-1 h-10 w-32 rounded-md border border-ink/10 bg-surface-soft px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
        </div>
        {certRegResult && (
          <div className="mt-2 flex flex-col gap-1">
            <ResultBadge pass={certRegResult.pass} text={`Đủ điều kiện đăng ký minh chứng: ${certRegResult.requiredText}`} />
            {certQualityResult && (
              <ResultBadge
                pass={certQualityResult.pass}
                text={`Đạt ngưỡng đảm bảo chất lượng đầu vào: ${certQualityResult.requiredText}`}
              />
            )}
          </div>
        )}
      </div>

      {hasAnyInput && (
        <div
          className={`mt-4 rounded-lg p-4 text-sm font-medium ${
            overallPass ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}
        >
          {overallPass
            ? 'Đủ điều kiện tham gia xét tuyển tổng hợp (thỏa ít nhất một điều kiện).'
            : 'Chưa đạt điều kiện nào ở trên — thử nhập thêm điều kiện khác hoặc kiểm tra lại số liệu.'}
        </div>
      )}
    </section>
  );
}
