import type { summarizeApplicantProfile } from '../../core/applicantProfileSummary';

interface ComparisonOverviewProps {
  selectionCount: number;
  uniqueSchoolCount: number;
  statusCounts: {
    exact: number;
    partial: number;
    unavailable: number;
  };
  profileSummary: ReturnType<typeof summarizeApplicantProfile>;
}

function ProfileFactSummary({ profileSummary }: { profileSummary: ReturnType<typeof summarizeApplicantProfile> }) {
  const facts = [
    profileSummary.vactTotal !== undefined ? { label: 'DGNL', done: true, value: String(profileSummary.vactTotal) } : { label: 'DGNL', done: false },
    profileSummary.thptSubjectCount > 0 ? { label: 'THPT', done: true, value: `${profileSummary.thptSubjectCount} mon` } : { label: 'THPT', done: false },
    profileSummary.transcriptSubjectCount > 0 ? { label: 'Hoc ba', done: true, value: `${profileSummary.transcriptSubjectCount} mon` } : { label: 'Hoc ba', done: false },
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-2 text-xs">
      {facts.map((fact) => (
        <span key={fact.label} className="rounded-full bg-surface px-2 py-1 text-muted">
          {fact.done ? 'OK' : '--'} {fact.label}
          {fact.value ? `: ${fact.value}` : ''}
        </span>
      ))}
    </div>
  );
}

export function ComparisonOverview({ selectionCount, uniqueSchoolCount, statusCounts, profileSummary }: ComparisonOverviewProps) {
  return (
    <>
      <header className="mt-4">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">So sanh nguyen vong</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Mot ho so dung chung, moi nguyen vong di qua evaluator rieng cua truong. Diem chuan chi hien khi dung cung ngu canh, phuong thuc, nganh va thang diem.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-surface px-2 py-1 text-ink">
            {selectionCount} nguyen vong
            {uniqueSchoolCount > 0 ? ` thuoc ${uniqueSchoolCount} truong` : ''}
          </span>
          <span className="rounded-full bg-success/10 px-2 py-1 text-ink">{statusCounts.exact} tinh chinh xac</span>
          <span className="rounded-full bg-warning/10 px-2 py-1 text-ink">{statusCounts.partial} tinh mot phan</span>
          <span className="rounded-full bg-surface-soft px-2 py-1 text-ink">{statusCounts.unavailable} can them du lieu</span>
        </div>
      </header>

      <section className="mt-5 rounded-card border border-accent/20 bg-accent/5 p-4 text-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-medium text-ink">Du lieu ho so</p>
            <ProfileFactSummary profileSummary={profileSummary} />
          </div>
          <a href="#/" className="text-xs font-medium text-accent underline-offset-2 hover:underline">
            Chinh sua ho so
          </a>
        </div>
      </section>
    </>
  );
}
