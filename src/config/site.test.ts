import { describe, expect, it } from 'vitest';
import { siteConfig } from './site';

/** Batch 7 — rebrand Uniscore → UniScoreVN. `siteConfig` là single source of truth cho brand text
 * hiển thị (Header/Footer/LandingPage/index.html đều đọc từ đây). */
describe('siteConfig (Batch 7 rebrand)', () => {
  it('brand name is UniScoreVN with public-facing casing', () => {
    expect(siteConfig.name).toBe('UniScoreVN');
  });

  it('slug is uniscorevn', () => {
    expect(siteConfig.slug).toBe('uniscorevn');
  });

  it('canonicalUrl points to the new production domain', () => {
    expect(siteConfig.canonicalUrl).toBe('https://uniscorevn.vercel.app');
  });

  it('description mentions the new brand, not the old one', () => {
    expect(siteConfig.description).toContain('UniScoreVN');
    expect(siteConfig.description.startsWith('Uniscore ')).toBe(false);
  });

  it('githubUrl/issuesUrl vẫn trỏ repo GitHub thật hiện có (chưa đổi tên repo, out of scope batch này)', () => {
    expect(siteConfig.githubUrl).toBe('https://github.com/shadowhunter67/uniscorevn');
    expect(siteConfig.issuesUrl).toBe('https://github.com/shadowhunter67/uniscorevn/issues');
  });
});
