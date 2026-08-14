import { useState } from 'react';
import { AlertTriangle, Award, Calculator, ShieldCheck } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MethodCapabilitySummary } from '../../components/MethodCapabilitySummary';
import { SharedProfileNotice } from '../../components/SharedProfileNotice';
import { verificationLabel } from '../../core/trust';
import { useApplicantProfile } from '../../core/applicantProfileContextCore';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS, type SubjectId } from '../../core/subjects';
import { isValidThptScore } from '../../core/thptProfile';
import { uhsSources } from './sources';
import { UHS_PROGRAMS } from './programs';
import { uhsKnowledgeGaps } from './knowledgeGaps';
import { uhsAdmissionMethods } from './methods';
import { evaluateUhsAdmission } from './evaluate';
import type { UhsAcademicPerformanceLevel } from './eligibility';
import type { UhsForeignCertificateType } from './bonus';

interface UhsPageProps {
  onChangeSchool: () => void;
}

const YEAR = 2026;
const GRADES = ['grade10', 'grade11', 'grade12'] as const;
type Grade = (typeof GRADES)[number];
const GRADE_LABELS: Record<Grade, string> = { grade10: 'Lớp 10', grade11: 'Lớp 11', grade12: 'Lớp 12' };

function numberOrUndefined(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function UhsPage({ onChangeSchool }: UhsPageProps) {
  const { profile, updateProfile, updateVactTotal } = useApplicantProfile();
  const [programId, setProgramId] = useState('');
  const program = UHS_PROGRAMS.find((p) => p.id === programId);
  const [combinationId, setCombinationId] = useState('');
  const combination = COMMON_SUBJECT_COMBINATIONS.find((c) => c.id === combinationId && program?.combinations.includes(c.id));
  const [grade12Performance, setGrade12Performance] = useState<UhsAcademicPerformanceLevel | ''>('');
  const [graduationScore, setGraduationScore] = useState('');
  const [dgnlInput, setDgnlInput] = useState(profile.exams?.vact?.total !== undefined ? String(profile.exams.vact.total) : '');
  const [certificateType, setCertificateType] = useState<UhsForeignCertificateType>('ielts');
  const [certificateScore, setCertificateScore] = useState('');
  const [toeicLr, setToeicLr] = useState('');
  const [toeicSw, setToeicSw] = useState('');
  const [vstepLevel, setVstepLevel] = useState('');
  const [certificateValid, setCertificateValid] = useState(false);
  const [satScore, setSatScore] = useState(profile.certificates?.sat !== undefined ? String(profile.certificates.sat) : '');
  const [satValid, setSatValid] = useState(false);
  const [preferredSchool, setPreferredSchool] = useState(false);
  const [preferredPerformance, setPreferredPerformance] = useState(false);
  const [preferredAverage, setPreferredAverage] = useState('');
  const [priority100, setPriority100] = useState('');

  function updateThpt(subjectId: SubjectId, value: string) {
    const parsed = numberOrUndefined(value);
    updateProfile((current) => {
      const scores = { ...current.thpt?.scores };
      if (parsed === undefined || !isValidThptScore(parsed)) delete scores[subjectId];
      else scores[subjectId] = parsed;
      return { ...current, thpt: { scores } };
    });
  }

  function updateTranscript(grade: Grade, subjectId: SubjectId, value: string) {
    const parsed = numberOrUndefined(value);
    updateProfile((current) => {
      const nextGrade = { ...current.transcript?.[grade] };
      if (parsed === undefined || !isValidThptScore(parsed)) delete nextGrade[subjectId];
      else nextGrade[subjectId] = parsed;
      return { ...current, transcript: { ...current.transcript, [grade]: nextGrade } };
    });
  }

  const evaluation = evaluateUhsAdmission(profile, {
    selectedProgramId: programId || undefined,
    subjectContext: combination ? { combinationId: combination.id, subjects: combination.subjects } : undefined,
    grade12Performance: grade12Performance || undefined,
    graduationScore10: numberOrUndefined(graduationScore),
    priority100: numberOrUndefined(priority100),
    bonus: {
      foreignCertificate:
        certificateType === 'toeic'
          ? { type: 'toeic', toeicListeningReading: numberOrUndefined(toeicLr), toeicSpeakingWriting: numberOrUndefined(toeicSw), issuedWithinTwoYears: certificateValid }
          : certificateType === 'vstep'
            ? { type: 'vstep', vstepLevel: numberOrUndefined(vstepLevel), issuedWithinTwoYears: certificateValid }
            : { type: certificateType, score: numberOrUndefined(certificateScore), issuedWithinTwoYears: certificateValid },
      satScore: numberOrUndefined(satScore),
      satIssuedWithinTwoYears: satValid,
      preferredSchool: {
        studiedAtLeastTwoYears: preferredSchool,
        threeYearPerformanceGoodOrBetter: preferredPerformance,
        averageAcademicScore10: numberOrUndefined(preferredAverage),
      },
    },
  });

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <Header
          school={{ shortName: 'UHS', name: 'Trường Đại học Khoa học Sức khỏe - ĐHQG TP.HCM', year: YEAR }}
          buildShareUrl={() => `${window.location.origin}/uhs`}
          onChangeSchool={onChangeSchool}
        />

        <section className="mt-5 rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Phương thức đang hỗ trợ: {uhsAdmissionMethods[0].name}</h2>
          <MethodCapabilitySummary method={uhsAdmissionMethods[0]} />
          <p className="mt-4 text-sm text-muted">
            UHS tính theo thang 100: w1×THPT + w2×ĐGNL + 20%×HB + điểm cộng + điểm ưu tiên. Vì w1/w2 mới công bố dạng khoảng, trang này chỉ hiển thị các thành phần đã tính được.
          </p>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-card border border-warning/30 bg-warning/10 p-6 text-sm text-warning sm:p-8">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">UHS vẫn chưa exact</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {uhsKnowledgeGaps.map((gap) => (
                <li key={gap.id}>{gap.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="programs" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-ink">Ngành và điều kiện đầu vào</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-ink">
              Ngành/chương trình
              <select value={programId} onChange={(e) => { setProgramId(e.target.value); setCombinationId(''); }} className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm">
                <option value="">Chưa chọn ngành</option>
                {UHS_PROGRAMS.map((p) => (
                  <option key={p.id} value={p.id}>{p.code} - {p.name} ({p.quota2026})</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-ink">
              Tổ hợp xét tuyển
              <select value={combinationId} onChange={(e) => setCombinationId(e.target.value)} className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm">
                <option value="">Chưa chọn tổ hợp</option>
                {program?.combinations.map((id) => {
                  const c = COMMON_SUBJECT_COMBINATIONS.find((x) => x.id === id);
                  return <option key={id} value={id}>{id}{c ? ` - ${c.subjects.map((s) => SUBJECT_LABELS[s]).join(', ')}` : ''}</option>;
                })}
              </select>
            </label>
            <label className="text-xs font-medium text-ink">
              Học lực lớp 12
              <select value={grade12Performance} onChange={(e) => setGrade12Performance(e.target.value as UhsAcademicPerformanceLevel | '')} className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm">
                <option value="">Chưa chọn</option>
                <option value="dat">Đạt/Trung bình</option>
                <option value="kha">Khá</option>
                <option value="tot">Tốt/Giỏi</option>
              </select>
            </label>
            <label className="text-xs font-medium text-ink">
              Điểm xét tốt nghiệp THPT
              <input value={graduationScore} onChange={(e) => setGraduationScore(e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" />
            </label>
          </div>
        </section>

        <section id="components" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-ink">THPT, ĐGNL và học bạ</h2>
          </div>
          {combination ? (
            <div className="mt-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {combination.subjects.map((subjectId) => (
                  <label key={subjectId} className="text-xs font-medium text-ink">
                    THPT {SUBJECT_LABELS[subjectId]}
                    <input value={profile.thpt?.scores?.[subjectId] ?? ''} onChange={(e) => updateThpt(subjectId, e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" />
                  </label>
                ))}
              </div>
              <SharedProfileNotice className="mt-2" />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[420px] border-separate border-spacing-1 text-xs">
                  <thead><tr><th className="text-left text-muted">Môn</th>{GRADES.map((g) => <th key={g} className="text-left text-muted">{GRADE_LABELS[g]}</th>)}</tr></thead>
                  <tbody>
                    {combination.subjects.map((subjectId) => (
                      <tr key={subjectId}>
                        <td className="font-medium text-ink">{SUBJECT_LABELS[subjectId]}</td>
                        {GRADES.map((grade) => (
                          <td key={grade}><input value={profile.transcript?.[grade]?.[subjectId] ?? ''} onChange={(e) => updateTranscript(grade, subjectId, e.target.value)} type="number" className="w-full rounded-md border border-ink/10 bg-surface px-2 py-1.5 text-sm" /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : <p className="mt-4 text-xs text-muted">Chọn ngành và tổ hợp để nhập điểm.</p>}
          <label className="mt-5 block max-w-xs text-xs font-medium text-ink">
            Điểm ĐGNL ĐHQG-HCM (1200)
            <input value={dgnlInput} onChange={(e) => { setDgnlInput(e.target.value); const parsed = numberOrUndefined(e.target.value); if (parsed !== undefined) updateVactTotal(parsed, 'user-total-input'); }} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" />
          </label>
        </section>

        <section id="bonus" className="mt-5 scroll-mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-ink">Điểm cộng</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-ink">Loại chứng chỉ
              <select value={certificateType} onChange={(e) => setCertificateType(e.target.value as UhsForeignCertificateType)} className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm">
                <option value="ielts">IELTS</option><option value="toeflIbt">TOEFL iBT</option><option value="toeflItp">TOEFL ITP</option><option value="toeic">TOEIC</option><option value="vstep">VSTEP</option>
              </select>
            </label>
            {certificateType === 'toeic' ? (
              <>
                <label className="text-xs font-medium text-ink">TOEIC L/R<input value={toeicLr} onChange={(e) => setToeicLr(e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" /></label>
                <label className="text-xs font-medium text-ink">TOEIC S/W<input value={toeicSw} onChange={(e) => setToeicSw(e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" /></label>
              </>
            ) : certificateType === 'vstep' ? (
              <label className="text-xs font-medium text-ink">Bậc VSTEP<input value={vstepLevel} onChange={(e) => setVstepLevel(e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" /></label>
            ) : (
              <label className="text-xs font-medium text-ink">Điểm chứng chỉ<input value={certificateScore} onChange={(e) => setCertificateScore(e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" /></label>
            )}
            <label className="flex items-center gap-2 text-xs font-medium text-ink"><input type="checkbox" checked={certificateValid} onChange={(e) => setCertificateValid(e.target.checked)} />Còn hạn theo quy định không quá 02 năm</label>
            <label className="text-xs font-medium text-ink">SAT<input value={satScore} onChange={(e) => setSatScore(e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" /></label>
            <label className="flex items-center gap-2 text-xs font-medium text-ink"><input type="checkbox" checked={satValid} onChange={(e) => setSatValid(e.target.checked)} />SAT còn hạn không quá 02 năm</label>
            <label className="flex items-center gap-2 text-xs font-medium text-ink"><input type="checkbox" checked={preferredSchool} onChange={(e) => setPreferredSchool(e.target.checked)} />Học tối thiểu 02 năm tại trường ưu tiên</label>
            <label className="flex items-center gap-2 text-xs font-medium text-ink"><input type="checkbox" checked={preferredPerformance} onChange={(e) => setPreferredPerformance(e.target.checked)} />Học lực 03 năm từ Tốt trở lên</label>
            <label className="text-xs font-medium text-ink">Điểm TB học tập 3 năm<input value={preferredAverage} onChange={(e) => setPreferredAverage(e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" /></label>
            <label className="text-xs font-medium text-ink">Điểm ưu tiên thang 100<input value={priority100} onChange={(e) => setPriority100(e.target.value)} type="number" className="mt-1 w-full rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm" /></label>
          </div>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Các thành phần đã tính được</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {evaluation.explanation.map((step) => (
              <li key={step.id}><span className="font-medium text-ink">{step.label}</span>{step.output !== undefined && `: ${step.output.toFixed(2)}${step.scale !== undefined ? ` / ${step.scale}` : ''}`}{step.description && <p className="text-xs">{step.description}</p>}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Chưa thể ra điểm xét tuyển cuối vì trường chưa công bố giá trị w1/w2 cố định.</p>
        </section>

        <section className="mt-5 rounded-2xl bg-surface-soft p-6 sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Nguồn dữ liệu</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {uhsSources.map((source) => (
              <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline">{source.title}</a><span className="text-muted"> - {source.publisher} </span><span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-muted">{verificationLabel(source.verification)}</span></li>
            ))}
          </ul>
        </section>

        <Footer />
      </div>
    </div>
  );
}
