/**
 * Key query string của share link HCMUT đời cũ (trước khi có routing path-based) — xem
 * `schools/hcmut/urlState.ts` (FORM_FIELD_SPECS) là nguồn thật, hardcode lại đây (không import,
 * App shell không được biết gì bên trong 1 school) vì đây là tập key legacy đã đóng băng, không
 * đổi theo thời gian.
 */
const LEGACY_HCMUT_SHARE_PARAM_KEYS = new Set([
  'dg_v',
  'dg_e',
  'dg_m',
  'dg_s',
  'th_m',
  'th_2',
  'th_3',
  'bn_r',
  'bn_c',
  'bn_k',
  'pr',
]);

/**
 * "/" -> null (landing). "/<id>" -> id. Ngoại lệ: "/" + có ít nhất 1 query key thuộc share link
 * cũ (từ trước khi có routing path-based, luôn là HCMUT) -> coi như "/hcmut" để không phá link cũ.
 * KHÔNG dùng "có query string bất kỳ" (bug thật: mobile in-app browser — Zalo/Messenger/Facebook —
 * hay tự thêm tracking param như `fbclid`/`utm_source` khi mở link, khiến "/" luôn bị redirect
 * nhầm sang HCMUT trên di động dù không phải share link cũ).
 */
export function resolveSchoolId(
  pathname: string,
  search: string = typeof window !== 'undefined' ? window.location.search : ''
): string | null {
  const segment = pathname.replace(/^\/+/, '').split('/')[0];
  if (segment !== '') return segment;
  if (search) {
    const params = new URLSearchParams(search);
    for (const key of params.keys()) {
      if (LEGACY_HCMUT_SHARE_PARAM_KEYS.has(key)) return 'hcmut';
    }
  }
  return null;
}
