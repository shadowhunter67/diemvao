import type { RuleEvidence } from '../core/evidence';
import { verificationLabel } from '../core/trust';

interface EvidenceLinksProps {
  evidence?: RuleEvidence[];
}

/**
 * Hiển thị evidence (`RuleEvidence[]`) dưới dạng thân thiện — KHÔNG expose enum kỹ thuật thô
 * (`exact-verified`, `official-source-available`...) ra UI chính, chỉ dùng `verificationLabel()`
 * đã có sẵn (đã là câu tiếng Việt dễ hiểu). Nếu có `sourceUrl` thì link mở tab mới; nếu chỉ có
 * `sourceTitle`/`location` thì hiện text thuần, không tạo link giả.
 */
export function EvidenceLinks({ evidence }: EvidenceLinksProps) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <ul className="mt-1.5 flex flex-col gap-1">
      {evidence.map((item, index) => (
        <li key={`${item.sourceId}-${index}`} className="text-xs text-muted">
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
          <span className="ml-1.5 rounded-full bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">
            {verificationLabel(item.verification)}
          </span>
          {item.note && <p className="mt-0.5 text-[11px] text-muted/80">{item.note}</p>}
        </li>
      ))}
    </ul>
  );
}
