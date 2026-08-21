import { useState } from 'react';
import { AlertTriangle, Calculator, CheckCircle2, XCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { isValidThptScore } from '../../core/thptProfile';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS, type SubjectId } from '../../core/subjects';
import { tdtuSources } from './sources';
import { tdtuAdmissionMethods } from './methods';
import { tdtuKnowledgeGaps } from './knowledgeGaps';
import { evaluateTdtuPt1Admission, evaluateTdtuPt2Admission } from './evaluate';
import { TDTU_PRIORITY_REGION_POINTS_30, TDTU_PRIORITY_CATEGORY_POINTS_30 } from './priority';

interface TdtuPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;

/** TDTU Page — batch 2026-08-21. Chỉ PT1 (Đối tượng 1.1) và PT2 (ĐGNL) — công thức đã exact. Đối
 * tượng 1.2-1.5, tổ hợp/ngưỡng riêng theo ngành CHƯA implement (`knowledgeGaps.ts`), hiển thị
 * trung thực bằng banner cảnh báo — không ẩn đi. */
export function TdtuPage({ onChangeSchool }: TdtuPageProps) {
  const { profile, updateProfile } = useApplicantProfile();
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId);
  const [mainSubjectId, setMainSubjectId] = useState<SubjectId | ''>('');

  const [transcriptDrafts, setTranscriptDrafts] = useState<Record<string, string>>({});

  function transcriptKey(subjectId: SubjectId, grade: 'grade10' | 'grade11' | 'grade12') {
    return `${subjectId}:${grade}`;
  }

  function handleThptChange(subjectId: SubjectId, value: string) {
    if (value.trim() === '') {
      updateProfile((current) => {
        const nextScores = { ...current.thpt?.scores };
        delete nextScores[subjectId];
        return { ...current, thpt: { scores: nextScores } };
      });
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !isValidThptScore(parsed)) return;
    updateProfile((current) => ({ ...current, thpt: { scores: { ...current.thpt?.scores, [subjectId]: parsed } } }));
  }

  function handleTranscriptChange(subjectId: SubjectId, grade: 'grade10' | 'grade11' | 'grade12', value: string) {
    setTranscriptDrafts((prev) => ({ ...prev, [transcriptKey(subjectId, grade)]: value }));
    if (value.trim() === '') {
      updateProfile((current) => {
        const nextGrade = { ...current.transcript?.[grade] };
        delete nextGrade[subjectId];
        return { ...current, transcript: { ...current.transcript, [grade]: nextGrade } };
      });
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !isValidThptScore(parsed)) return;
    updateProfile((current) => ({
      ...current,
      transcript: { ...current.transcript, [grade]: { ...current.transcript?.[grade], [subjectId]: parsed } },
    }));
  }

  function getTranscriptInput(subjectId: SubjectId, grade: 'grade10' | 'grade11' | 'grade12'): string {
    const key = transcriptKey(subjectId, grade);
    if (key in transcriptDrafts) return transcriptDrafts[key];
    const value = profile.transcript?.[grade]?.[subjectId];
    return value !== undefined ? String(value) : '';
  }

  const [xetThuongHsgTinhRank, setXetThuongHsgTinhRank] = useState<'' | 'nhat' | 'nhi' | 'ba'>('');
  const [hanhKiemTot, setHanhKiemTot] = useState(false);

  const region = profile.priority?.region ?? '';
  const category = profile.priority?.category ?? '';

  const pt1Evaluation = evaluateTdtuPt1Admission(profile, {
    subjectContext: combination && mainSubjectId ? { combinationId: combination.id, mainSubjectId, subjects: combination.subjects } : undefined,
    thuong: [],
    xetThuong: [
      ...(xetThuongHsgTinhRank ? [{ category: 'hsg-tinh-thanh' as const, rank: xetThuongHsgTinhRank }] : []),
      ...(hanhKiemTot ? [{ category: 'hanh-kiem-tot-3-nam' as const }] : []),
    ],
  });
  const pt1Academic = pt1Evaluation.explanation.find((s) => s.id === 'tdtu-competency');
  const pt1Bonus = pt1Evaluation.explanation.find((s) => s.id === 'tdtu-bonus');
  const pt1Priority = pt1Evaluation.explanation.find((s) => s.id === 'tdtu-priority');

  const [dgnlOverride, setDgnlOverride] = useState('');
  const profileDgnl = profile.exams?.vact?.total;
  const effectiveDgnl = dgnlOverride.trim() !== '' ? Number(dgnlOverride) : profileDgnl;
  const pt2Profile = effectiveDgnl !== undefined ? { ...profile, exams: { vact: { ...profile.exams?.vact, total: effectiveDgnl } } } : profile;
  const pt2Evaluation = evaluateTdtuPt2Admission(pt2Profile);
  const pt2Priority = pt2Evaluation.explanation.find((s) => s.id === 'tdtu-pt2-priority');

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'TDTU', name: 'Trường Đại học Tôn Đức Thắng', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/tdtu`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ</h2>
          <p className="mt-1 text-sm text-muted">{tdtuAdmissionMethods[0].name} · {tdtuAdmissionMethods[1].name}</p>
          <MethodCapabilitySummary method={tdtuAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            <span className="font-mono text-ink">PT1 = Điểm năng lực + Điểm cộng + Điểm ưu tiên</span> (thang 100, chỉ
            Đối tượng 1.1 — học sinh lớp 12 tốt nghiệp THPT 2026).{' '}
            <span className="font-mono text-ink">PT2 = Tổng điểm ĐGNL + Điểm ưu tiên</span> (thang 1200).
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Phạm vi chưa tính được</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
              {tdtuKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="calculator" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ink">PT1 — Xét tuyển tổng hợp (Đối tượng 1.1)</h2>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <div>
              <label htmlFor="tdtu-combination" className="text-xs font-medium text-ink">
                Tổ hợp 3 môn
              </label>
              <select
                id="tdtu-combination"
                value={combinationId}
                onChange={(e) => {
                  setCombinationId(e.target.value);
                  setMainSubjectId('');
                }}
                className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              >
                <option value="">Chưa chọn tổ hợp</option>
                {COMMON_SUBJECT_COMBINATIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.subjects.map((s) => SUBJECT_LABELS[s]).join(', ')}
                  </option>
                ))}
              </select>
            </div>
            {combination && (
              <div>
                <label htmlFor="tdtu-main-subject" className="text-xs font-medium text-ink">
                  Môn chính (nhân hệ số 2)
                </label>
                <select
                  id="tdtu-main-subject"
                  value={mainSubjectId}
                  onChange={(e) => setMainSubjectId(e.target.value as SubjectId)}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Chưa chọn môn chính</option>
                  {combination.subjects.map((s) => (
                    <option key={s} value={s}>
                      {SUBJECT_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <SharedProfileNotice className="mt-2" />

          {combination && (
            <div className="mt-4 overflow-x-auto rounded-xl bg-surface p-4">
              <table className="w-full min-w-[420px] text-sm text-ink">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="pb-2">Môn</th>
                    <th className="pb-2">Điểm thi TN THPT</th>
                    <th className="pb-2">Lớp 10</th>
                    <th className="pb-2">Lớp 11</th>
                    <th className="pb-2">Lớp 12</th>
                  </tr>
                </thead>
                <tbody>
                  {combination.subjects.map((subjectId) => (
                    <tr key={subjectId} className="border-t border-ink/5">
                      <td className="py-1.5 pr-2">
                        {SUBJECT_LABELS[subjectId]}
                        {subjectId === mainSubjectId ? ' (×2)' : ''}
                      </td>
                      <td className="py-1.5 pr-2">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.01}
                          value={profile.thpt?.scores?.[subjectId] ?? ''}
                          onChange={(e) => handleThptChange(subjectId, e.target.value)}
                          className="w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                        />
                      </td>
                      {(['grade10', 'grade11', 'grade12'] as const).map((grade) => (
                        <td key={grade} className="py-1.5 pr-2">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.01}
                            value={getTranscriptInput(subjectId, grade)}
                            onChange={(e) => handleTranscriptChange(subjectId, grade, e.target.value)}
                            className="w-20 rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-muted">TB 6 học kỳ ước lượng bằng trung bình 3 năm (hồ sơ chung chỉ lưu theo năm).</p>
            </div>
          )}

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm cộng (Điểm thưởng/xét thưởng)</legend>
            <label className="mt-1 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={hanhKiemTot} onChange={(e) => setHanhKiemTot(e.target.checked)} />
              Hạnh kiểm Tốt cả 3 năm THPT (+1)
            </label>
            <label htmlFor="tdtu-xet-thuong-hsg" className="mt-2 block text-xs font-medium text-ink">
              Giải HSG cấp Tỉnh/Thành (nhất +5, nhì +4, ba +3)
            </label>
            <select
              id="tdtu-xet-thuong-hsg"
              value={xetThuongHsgTinhRank}
              onChange={(e) => setXetThuongHsgTinhRank(e.target.value as '' | 'nhat' | 'nhi' | 'ba')}
              className="mt-1 w-full max-w-xs rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Không có</option>
              <option value="nhat">Giải Nhất (+5)</option>
              <option value="nhi">Giải Nhì (+4)</option>
              <option value="ba">Giải Ba (+3)</option>
            </select>
            <p className="mt-2 text-xs text-muted">Còn nhiều mục điểm thưởng/xét thưởng khác (Phụ lục 6/7) chưa đưa vào form này — dùng để ước lượng nhanh.</p>
          </fieldset>

          <fieldset className="mt-4 rounded-xl bg-surface p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Điểm ưu tiên khu vực/đối tượng</legend>
            <div className="mt-1 flex flex-wrap gap-3">
              <div>
                <label htmlFor="tdtu-priority-region" className="text-xs font-medium text-ink">
                  Khu vực
                </label>
                <select
                  id="tdtu-priority-region"
                  value={region}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, region: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(TDTU_PRIORITY_REGION_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tdtu-priority-category" className="text-xs font-medium text-ink">
                  Đối tượng ưu tiên
                </label>
                <select
                  id="tdtu-priority-category"
                  value={category}
                  onChange={(e) => updateProfile((current) => ({ ...current, priority: { ...current.priority, category: e.target.value || undefined } }))}
                  className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                >
                  <option value="">Không chọn</option>
                  {Object.entries(TDTU_PRIORITY_CATEGORY_POINTS_30).map(([code, points]) => (
                    <option key={code} value={code}>
                      {code} (+{points}/30)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SharedProfileNotice className="mt-2" />
          </fieldset>

          {pt1Academic && pt1Bonus && pt1Priority && pt1Evaluation.score && (
            <div className="mt-5 rounded-2xl bg-surface p-4">
              <p className="text-sm text-ink">
                Điểm năng lực: <strong className="text-ink">{pt1Academic.output?.toFixed(2)}</strong> / 100
              </p>
              <p className="mt-1 text-sm text-ink">
                Điểm cộng: <strong className="text-ink">{pt1Bonus.output?.toFixed(2)}</strong> / 10
              </p>
              <p className="mt-1 text-sm text-ink">
                Điểm ưu tiên: <strong className="text-ink">{pt1Priority.output?.toFixed(2)}</strong>
                {pt1Priority.formula?.startsWith('[') ? ' (đã giảm)' : ''}
              </p>
              <p className="mt-2 text-base text-ink">
                Điểm xét tuyển PT1: <strong className="text-xl text-primary">{pt1Evaluation.score.value.toFixed(2)}</strong> / 100
              </p>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-ink">
                {pt1Evaluation.eligibility?.status === 'ineligible' ? (
                  <XCircle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                ) : (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                )}
                <span>{pt1Evaluation.eligibility?.reasons.join(' ')}</span>
              </p>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">PT2 — Xét theo ĐGNL ĐHQG-HCM</h2>
          <div className="mt-3 max-w-xs">
            <label htmlFor="tdtu-dgnl" className="text-xs font-medium text-ink">
              Tổng điểm ĐGNL (thang 1200){profileDgnl !== undefined ? ' — đã có trong hồ sơ chung' : ''}
            </label>
            <input
              id="tdtu-dgnl"
              type="number"
              min={0}
              max={1200}
              value={dgnlOverride !== '' ? dgnlOverride : profileDgnl ?? ''}
              onChange={(e) => setDgnlOverride(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>

          {pt2Priority && pt2Evaluation.score && (
            <div className="mt-4 rounded-2xl bg-surface p-4">
              <p className="text-sm text-ink">
                Điểm ưu tiên: <strong className="text-ink">{pt2Priority.output?.toFixed(2)}</strong>
                {pt2Priority.formula?.startsWith('[') ? ' (đã giảm)' : ''}
              </p>
              <p className="mt-2 text-base text-ink">
                Điểm xét tuyển PT2: <strong className="text-xl text-primary">{pt2Evaluation.score.value.toFixed(2)}</strong> / 1200
              </p>
              <p className="mt-2 text-sm text-muted">{pt2Evaluation.eligibility?.reasons.join(' ')}</p>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {tdtuSources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline">
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
