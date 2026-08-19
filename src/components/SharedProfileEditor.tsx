import { useEffect, useState } from 'react';
import type { ApplicantProfile } from '../core/applicantProfile';
import type { ApplicantProfileContextValue } from '../core/applicantProfileContextCore';
import type { SubjectId } from '../core/subjects';
import { SUBJECT_LABELS } from '../core/subjects';
import { ScoreInput } from './ScoreInput';

interface SharedProfileEditorProps {
  profile: ApplicantProfile;
  updateProfile: ApplicantProfileContextValue['updateProfile'];
  updateVactTotal: ApplicantProfileContextValue['updateVactTotal'];
}

function parseScore(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === '') return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : undefined;
}

/**
 * Ô nhập giữ string cục bộ trong lúc gõ, chỉ commit ra ngoài (parse + gọi `onCommit`) khi blur —
 * tránh việc `value` bị format lại (mất dấu chấm thập phân dở dang) sau mỗi keystroke do
 * `committedValue` từ profile dội ngược vào input đang gõ.
 */
function BufferedScoreInput({
  id,
  label,
  hideLabel,
  committedValue,
  onCommit,
}: {
  id: string;
  label: string;
  hideLabel?: boolean;
  committedValue: number | undefined;
  onCommit: (raw: string) => void;
}) {
  const [raw, setRaw] = useState(() => committedValue?.toString() ?? '');

  useEffect(() => {
    setRaw(committedValue?.toString() ?? '');
  }, [committedValue]);

  return (
    <ScoreInput
      id={id}
      label={label}
      hideLabel={hideLabel}
      value={raw}
      error={null}
      onChange={setRaw}
      onBlur={() => onCommit(raw)}
      compact
    />
  );
}

/**
 * Sửa trực tiếp các giá trị hồ sơ điểm dùng chung ĐÃ CÓ (ĐGNL tổng, từng môn THPT/học bạ đã
 * nhập) — không phải nơi thêm môn mới lần đầu (vẫn làm qua form riêng từng trường, vì mỗi trường
 * cần ngữ cảnh riêng như tổ hợp môn).
 */
export function SharedProfileEditor({ profile, updateProfile, updateVactTotal }: SharedProfileEditorProps) {
  const [componentsClearedNotice, setComponentsClearedNotice] = useState(false);

  function commitVactTotal(raw: string) {
    const value = parseScore(raw);
    if (value === undefined) return;
    const { componentsCleared } = updateVactTotal(value, 'user-total-input');
    setComponentsClearedNotice(componentsCleared);
  }

  function commitThptScore(subjectId: SubjectId, raw: string) {
    const value = parseScore(raw);
    updateProfile((current) => ({
      ...current,
      thpt: { scores: { ...current.thpt?.scores, [subjectId]: value } },
    }));
  }

  function commitTranscriptScore(year: 'grade10' | 'grade11' | 'grade12', subjectId: SubjectId, raw: string) {
    const value = parseScore(raw);
    updateProfile((current) => ({
      ...current,
      transcript: { ...current.transcript, [year]: { ...current.transcript?.[year], [subjectId]: value } },
    }));
  }

  const thptEntries = Object.entries(profile.thpt?.scores ?? {}).filter(
    (entry): entry is [SubjectId, number] => entry[1] !== undefined
  );

  const transcriptSubjectIds = new Set<SubjectId>();
  for (const year of [profile.transcript?.grade10, profile.transcript?.grade11, profile.transcript?.grade12]) {
    if (!year) continue;
    for (const [subjectId, value] of Object.entries(year)) {
      if (value !== undefined) transcriptSubjectIds.add(subjectId as SubjectId);
    }
  }

  return (
    <div className="mt-2 space-y-4 text-sm">
      <div>
        <p className="text-xs font-medium text-ink">ĐGNL (tổng điểm)</p>
        <div className="mt-1.5 max-w-[180px]">
          <BufferedScoreInput
            id="shared-profile-vact-total"
            label="Tổng điểm ĐGNL"
            hideLabel
            committedValue={profile.exams?.vact?.total}
            onCommit={commitVactTotal}
          />
        </div>
        {componentsClearedNotice && (
          <p className="mt-1 text-xs text-warning">
            4 điểm thành phần ĐGNL (nếu đã nhập ở HCMUT) đã bị xóa vì không còn khớp tổng mới — nhập lại ở trang HCMUT nếu cần.
          </p>
        )}
      </div>

      {thptEntries.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink">Điểm THPT</p>
          <div className="mt-1.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {thptEntries.map(([subjectId, score]) => (
              <BufferedScoreInput
                key={subjectId}
                id={`shared-profile-thpt-${subjectId}`}
                label={SUBJECT_LABELS[subjectId]}
                committedValue={score}
                onCommit={(raw) => commitThptScore(subjectId, raw)}
              />
            ))}
          </div>
        </div>
      )}

      {transcriptSubjectIds.size > 0 && (
        <div>
          <p className="text-xs font-medium text-ink">Học bạ</p>
          <div className="mt-1.5 space-y-2">
            {[...transcriptSubjectIds].map((subjectId) => (
              <div key={subjectId} className="grid grid-cols-4 items-center gap-2">
                <span className="text-xs text-muted">{SUBJECT_LABELS[subjectId]}</span>
                {(['grade10', 'grade11', 'grade12'] as const).map((year) => (
                  <BufferedScoreInput
                    key={year}
                    id={`shared-profile-transcript-${year}-${subjectId}`}
                    label={year === 'grade10' ? 'Lớp 10' : year === 'grade11' ? 'Lớp 11' : 'Lớp 12'}
                    hideLabel
                    committedValue={profile.transcript?.[year]?.[subjectId]}
                    onCommit={(raw) => commitTranscriptScore(year, subjectId, raw)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted">
        Sửa xong bấm ra ngoài ô là tự lưu. Thêm môn/dữ liệu mới lần đầu thì nhập ở trang trường tương ứng.
      </p>
    </div>
  );
}
