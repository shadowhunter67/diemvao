import type { RuleEvidence } from '../core/evidence';
import type { AdmissionSource } from '../core/sourceRegistry';
import { enrichRuleEvidenceFromRegistry, resolveRuleEvidenceSources } from '../core/sourceRegistry';
import { formatSourceDate, lifecycleStatusLabel, sourceTypeLabel } from '../core/sourcePresentation';
import { verificationLabel } from '../core/trust';
import { allAdmissionSources } from '../schools/sourceRegistry';

interface EvidenceLinksProps {
  evidence?: RuleEvidence[];
  sources?: readonly AdmissionSource[];
}

/**
 * Hiển thị evidence (`RuleEvidence[]`) dưới dạng thân thiện — KHÔNG expose enum kỹ thuật thô
 * (`exact-verified`, `official-source-available`...) ra UI chính, chỉ dùng `verificationLabel()`
 * đã có sẵn (đã là câu tiếng Việt dễ hiểu). Nếu có `sourceUrl` thì link mở tab mới; nếu chỉ có
 * `sourceTitle`/`location` thì hiện text thuần, không tạo link giả.
 */
export function EvidenceLinks({ evidence, sources = allAdmissionSources }: EvidenceLinksProps) {
  if (!evidence || evidence.length === 0) return null;
  const resolvedEvidence = resolveRuleEvidenceSources(evidence, sources).map((item) =>
    enrichRuleEvidenceFromRegistry(item.evidence, item.source)
  );

  return (
    <ul className="mt-1.5 flex flex-col gap-1">
      {resolvedEvidence.map((item, index) => (
        <li key={`${item.sourceId}-${index}`} className="text-xs text-muted">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:underline"
              >
                {item.sourceTitle ?? item.sourceId}
              </a>
            ) : (
              <span className="text-ink/80">{item.sourceTitle ?? item.location ?? item.sourceId}</span>
            )}
            <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">
              {verificationLabel(item.verification)}
            </span>
            {lifecycleStatusLabel(item.lifecycle?.status) && (
              <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                {lifecycleStatusLabel(item.lifecycle?.status)}
              </span>
            )}
          </div>
          <EvidenceMetadata item={item} />
          {item.note && <p className="mt-0.5 text-[11px] text-muted/80">{item.note}</p>}
          {item.lifecycle?.status === 'superseded' && (
            <p className="mt-0.5 text-[11px] text-danger">
              Nguồn này đã được thay thế và không còn được dùng cho kết quả hiện tại.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function EvidenceMetadata({ item }: { item: RuleEvidence }) {
  const sourceType = sourceTypeLabel(item.sourceType);
  const publishedAt = formatSourceDate(item.publishedAt ?? item.lifecycle?.publishedAt);
  const lastReviewedAt = formatSourceDate(item.lastReviewedAt ?? item.lifecycle?.lastReviewedAt);
  const rows = [
    sourceType ? `Nguồn: ${sourceType}` : undefined,
    publishedAt ? `Công bố: ${publishedAt}` : undefined,
    lastReviewedAt ? `UniScoreVN kiểm tra lần cuối: ${lastReviewedAt}` : undefined,
  ].filter(Boolean);

  if (rows.length === 0) return null;

  return <p className="mt-0.5 text-[11px] text-muted/80">{rows.join(' · ')}</p>;
}
