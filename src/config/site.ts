/**
 * Batch 7 — rebrand Uniscore → UniScoreVN. Single source of truth cho brand: mọi UI (`Header`/
 * `Footer`/`LandingPage`/index.html`) đọc từ đây.
 *
 * `githubUrl`/`issuesUrl` — repo GitHub đã đổi tên `shadowhunter67/uniscore` → `shadowhunter67/uniscorevn`
 * (2026-08-18, đồng bộ với brand `uniscorevn` của package.json/canonical domain — trước đó tên repo
 * cố tình giữ nguyên vì việc đổi tên là external action ngoài phạm vi code, xem CLAUDE.md Batch 7;
 * nay đã thực hiện theo yêu cầu). `slug`/`canonicalUrl`: production domain canonical vẫn là
 * `uniscorevn.vercel.app` — domain cũ `diemvao.vercel.app` (Phase 13) redirect 307 sang domain mới,
 * chỉ còn là legacy reference trong docs.
 */
export const siteConfig = {
  name: 'UniScoreVN',
  slug: 'uniscorevn',
  canonicalUrl: 'https://uniscorevn.vercel.app',
  tagline: 'Tính & mô phỏng điểm xét tuyển',
  description:
    'UniScoreVN giúp tính, so sánh và mô phỏng điểm xét tuyển tại các trường đại học, học viện và cao đẳng Việt Nam theo dữ liệu tuyển sinh chính thức.',
  githubUrl: 'https://github.com/shadowhunter67/uniscorevn',
  issuesUrl: 'https://github.com/shadowhunter67/uniscorevn/issues',
};
