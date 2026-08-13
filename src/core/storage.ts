/** Key localStorage namespace theo school, tránh collision khi có nhiều trường.
 * Batch 7 — namespace đổi `uniscore:` → `uniscorevn:` theo rebrand Uniscore → UniscoreVN. Key cũ
 * `uniscore:<schoolId>:<domain>:v<version>` (Phase 15) được coi là một đời legacy nữa trong chain
 * `readWithMigration` ở từng school page (vd `HcmutCalculatorPage.tsx`), KHÔNG sửa hàm này để tự
 * đọc key cũ — giữ đúng nguyên tắc "school page tự khai chain legacy của mình". */
export function getSchoolStorageKey(schoolId: string, domain: string, version: number): string {
  return `uniscorevn:${schoolId}:${domain}:v${version}`;
}

/**
 * Đọc giá trị từ localStorage với migration one-time từ các key đời trước.
 * new key có & parse hợp lệ → dùng luôn.
 * new key không có, thử từng legacyKey theo thứ tự → parse hợp lệ đầu tiên → ghi sang newKey, dùng.
 * Không cái nào hợp lệ → null (caller tự fallback default). Không bao giờ throw.
 */
export function readWithMigration<T>(
  newKey: string,
  legacyKeys: readonly string[],
  parse: (raw: string) => T | null
): T | null {
  const direct = localStorage.getItem(newKey);
  if (direct !== null) {
    return parse(direct);
  }

  for (const legacyKey of legacyKeys) {
    const raw = localStorage.getItem(legacyKey);
    if (raw === null) continue;

    const parsed = parse(raw);
    if (parsed !== null) {
      localStorage.setItem(newKey, raw);
      return parsed;
    }
  }

  return null;
}
