import { useEffect, useState } from 'react';
import type { ApplicantProfile } from '../core/applicantProfile';
import type { ApplicantProfileContextValue } from '../core/applicantProfileContextCore';
import type { SubjectId } from '../core/subjects';
import { COMMON_SUBJECT_COMBINATIONS, SUBJECT_LABELS } from '../core/subjects';
import { ScoreInput } from './ScoreInput';

interface SharedProfileEditorProps {
  profile: ApplicantProfile;
  updateProfile: ApplicantProfileContextValue['updateProfile'];
  updateVactTotal: ApplicantProfileContextValue['updateVactTotal'];
}

/** Mã khu vực/đối tượng ưu tiên CHUẨN Bộ GD&ĐT — dùng chung nguyên trạng ở 10 trường (mỗi trường
 * tự tra bảng điểm riêng từ CÙNG bộ mã này, xem `schools/iu/priority.ts`). Không hiện số điểm
 * kèm theo ở đây vì điểm khác nhau theo từng trường — hiện số sẽ gây hiểu nhầm là dùng chung. */
const PRIORITY_REGION_OPTIONS = [
  { code: 'KV1', label: 'KV1' },
  { code: 'KV2-NT', label: 'KV2-NT' },
  { code: 'KV2', label: 'KV2' },
  { code: 'KV3', label: 'KV3' },
];

const PRIORITY_CATEGORY_OPTIONS = [
  { code: 'UT1', label: 'UT1 (đối tượng 01-03)' },
  { code: 'UT2', label: 'UT2 (đối tượng 04-06)' },
];

const CERTIFICATE_FIELDS: { key: keyof NonNullable<ApplicantProfile['certificates']>; label: string; hint: string }[] = [
  { key: 'ielts', label: 'IELTS', hint: '0 - 9' },
  { key: 'toeflIbt', label: 'TOEFL iBT', hint: '0 - 120' },
  { key: 'toeic', label: 'TOEIC', hint: '0 - 990' },
  { key: 'sat', label: 'SAT', hint: '0 - 1600' },
  { key: 'act', label: 'ACT', hint: '0 - 36' },
  { key: 'ib', label: 'IB', hint: '0 - 45' },
];

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

  function commitPreferredCombination(combinationId: string) {
    updateProfile((current) => ({ ...current, preferredCombinationId: combinationId || undefined }));
  }

  function commitPriorityRegion(region: string) {
    updateProfile((current) => ({ ...current, priority: { ...current.priority, region: region || undefined } }));
  }

  function commitPriorityCategory(category: string) {
    updateProfile((current) => ({ ...current, priority: { ...current.priority, category: category || undefined } }));
  }

  function commitCertificate(key: keyof NonNullable<ApplicantProfile['certificates']>, raw: string) {
    const value = parseScore(raw);
    updateProfile((current) => ({ ...current, certificates: { ...current.certificates, [key]: value } }));
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

      <div>
        <p className="text-xs font-medium text-ink">Tổ hợp môn</p>
        <select
          id="shared-profile-preferred-combination"
          value={profile.preferredCombinationId ?? ''}
          onChange={(e) => commitPreferredCombination(e.target.value)}
          className="mt-1.5 block h-10 rounded-lg border border-ink/10 bg-surface px-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        >
          <option value="">Không chọn</option>
          {COMMON_SUBJECT_COMBINATIONS.map((combination) => (
            <option key={combination.id} value={combination.id}>
              {combination.id} ({combination.subjects.map((subjectId) => SUBJECT_LABELS[subjectId]).join(' - ')})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted">
          Chỉ để tham khảo nhanh — không tự áp dụng cho trường nào. Nếu một trường tính điểm không khớp tổ hợp bạn chọn ở
          đây, vào trang chi tiết của trường đó (bấm "Xem hồ sơ ở tất cả trường" bên dưới rồi mở từng trường) để chọn/sửa
          lại tổ hợp riêng cho trường đó.
        </p>
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

      <div>
        <p className="text-xs font-medium text-ink">Điểm ưu tiên khu vực/đối tượng</p>
        <div className="mt-1.5 flex flex-wrap gap-3">
          <div>
            <label htmlFor="shared-profile-priority-region" className="text-xs text-muted">
              Khu vực
            </label>
            <select
              id="shared-profile-priority-region"
              value={profile.priority?.region ?? ''}
              onChange={(e) => commitPriorityRegion(e.target.value)}
              className="mt-1 block h-10 rounded-lg border border-ink/10 bg-surface px-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Không chọn</option>
              {PRIORITY_REGION_OPTIONS.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="shared-profile-priority-category" className="text-xs text-muted">
              Đối tượng ưu tiên
            </label>
            <select
              id="shared-profile-priority-category"
              value={profile.priority?.category ?? ''}
              onChange={(e) => commitPriorityCategory(e.target.value)}
              className="mt-1 block h-10 rounded-lg border border-ink/10 bg-surface px-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
              <option value="">Không chọn</option>
              {PRIORITY_CATEGORY_OPTIONS.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted">Mã chuẩn Bộ GD&ĐT — mỗi trường tự quy đổi ra điểm cộng riêng, không hiện số điểm chung ở đây.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-ink">Chứng chỉ (dùng để tính điểm thưởng/khuyến khích ở trường có hỗ trợ)</p>
        <div className="mt-1.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CERTIFICATE_FIELDS.map(({ key, label, hint }) => (
            <BufferedScoreInput
              key={key}
              id={`shared-profile-certificate-${key}`}
              label={`${label} (${hint})`}
              committedValue={profile.certificates?.[key]}
              onCommit={(raw) => commitCertificate(key, raw)}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-muted">Sửa xong bấm ra ngoài ô là tự lưu. Thêm môn THPT/học bạ mới lần đầu thì nhập ở trang trường tương ứng.</p>
    </div>
  );
}
