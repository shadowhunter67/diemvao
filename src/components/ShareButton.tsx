import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

interface ShareButtonProps {
  buildShareUrl: () => string;
}

export function ShareButton({ buildShareUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  async function handleShare() {
    const url = buildShareUrl();

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        // Một số trình duyệt/ngữ cảnh không có quyền clipboard sẽ treo promise này mãi mãi
        // thay vì reject, nên phải đua với timeout để luôn rơi được xuống fallback thủ công.
        await Promise.race([
          navigator.clipboard.writeText(url),
          new Promise((_, reject) => window.setTimeout(() => reject(new Error('clipboard timeout')), 1500)),
        ]);
        setManualUrl(null);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
        return;
      } catch {
        // rơi xuống fallback thủ công bên dưới
      }
    }

    setManualUrl(url);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {copied ? <Check size={14} aria-hidden="true" /> : <Share2 size={14} aria-hidden="true" />}
        {copied ? 'Đã copy' : 'Chia sẻ'}
      </button>

      {manualUrl && (
        <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-ink/10 bg-surface p-3 shadow-card">
          <label htmlFor="share-url-fallback" className="text-xs text-muted">
            Không tự copy được, hãy copy thủ công:
          </label>
          <input
            id="share-url-fallback"
            type="text"
            readOnly
            value={manualUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1 w-full rounded-md border border-ink/10 bg-surface-soft px-2 py-1 text-xs text-ink"
          />
        </div>
      )}
    </div>
  );
}
