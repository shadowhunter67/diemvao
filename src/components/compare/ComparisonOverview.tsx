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
    profileSummary.thptSubjectCount > 0 ? { label: 'THPT', done: true, value: `${profileSummary.thptSubjectCount} môn` } : { label: 'THPT', done: false },
    profileSummary.transcriptSubjectCount > 0 ? { label: 'Học bạ', done: true, value: `${profileSummary.transcriptSubjectCount} môn` } : { label: 'Học bạ', done: false },
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
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">So sánh nguyện vọng</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Một hồ sơ dùng chung, mỗi nguyện vọng đi qua evaluator riêng của trường. Điểm chuẩn chỉ hiện khi dùng cùng ngữ cảnh, phương thức, ngành và thang điểm.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-surface px-2 py-1 text-ink">
            {selectionCount} nguyện vọng
            {uniqueSchoolCount > 0 ? ` thuộc ${uniqueSchoolCount} trường` : ''}
          </span>
          <span className="rounded-full bg-success/10 px-2 py-1 text-ink">{statusCounts.exact} tính chính xác</span>
          <span className="rounded-full bg-warning/10 px-2 py-1 text-ink">{statusCounts.partial} tính một phần</span>
          <span className="rounded-full bg-surface-soft px-2 py-1 text-ink">{statusCounts.unavailable} cần thêm dữ liệu</span>
        </div>
      </header>

      <section className="mt-5 rounded-card border border-accent/20 bg-accent/5 p-4 text-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-medium text-ink">Dữ liệu hồ sơ</p>
            <ProfileFactSummary profileSummary={profileSummary} />
          </div>
          <a href="#/" className="text-xs font-medium text-accent underline-offset-2 hover:underline">
            Chỉnh sửa hồ sơ
          </a>
        </div>
      </section>
    </>
  );
}
