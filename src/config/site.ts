/**
 * Batch 7 — rebrand Uniscore → UniscoreVN. Single source of truth cho brand: mọi UI (`Header`/
 * `Footer`/`LandingPage`/`index.html`) đọc từ đây, KHÔNG hard-code "UniscoreVN" rải rác.
 *
 * `githubUrl`/`issuesUrl` CỐ TÌNH giữ nguyên `shadowhunter67/uniscore` — repo GitHub chưa đổi tên
 * (đó là external action ngoài phạm vi code, xem CLAUDE.md Batch 7). `slug`/`canonicalUrl` mới:
 * production domain canonical giờ là `uniscorevn.vercel.app` — domain cũ `diemvao.vercel.app` (Phase
 * 13) redirect 307 sang domain mới, chỉ còn là legacy reference trong docs.
 */
export const siteConfig = {
  name: 'UniscoreVN',
  slug: 'uniscorevn',
  canonicalUrl: 'https://uniscorevn.vercel.app',
  tagline: 'Tính & mô phỏng điểm xét tuyển đại học',
  description:
    'UniscoreVN giúp tính, đối chiếu và khám phá điểm xét tuyển đại học theo công thức tuyển sinh của từng trường, kèm điểm chuẩn và nguồn dữ liệu.',
  githubUrl: 'https://github.com/shadowhunter67/uniscore',
  issuesUrl: 'https://github.com/shadowhunter67/uniscore/issues',
};
