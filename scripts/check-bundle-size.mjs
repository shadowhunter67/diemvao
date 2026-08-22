#!/usr/bin/env node
/**
 * Performance budget đơn giản (P3, production-readiness batch) — chặn regression bundle initial
 * phình trở lại sau khi code-splitting theo school (xem `src/schools/index.ts`). Không phải hệ
 * thống phức tạp: đọc `dist/index.html` để tìm đúng file JS entry (chunk initial browser TẢI
 * NGAY, không phải các chunk lazy theo trường), so kích thước raw (chưa gzip, khớp cách Vite tự
 * báo trong output build) với ngưỡng cố định bên dưới.
 *
 * Ngưỡng chọn: initial bundle đo được NGAY SAU khi hoàn thành P1 code-splitting là ~675kB (xem
 * git log batch "P1: code splitting theo school qua React.lazy") — 750kB cho margin ~10% cho thay
 * đổi nhỏ hợp lý (thêm 1-2 trường không-Page/mở rộng core logic dùng chung), không chọn cao tùy
 * tiện để "cho qua". Nếu bundle initial thật sự cần vượt ngưỡng này (vd core logic dùng chung phình
 * đáng kể), sửa THRESHOLD_BYTES ở đây kèm giải thích rõ trong commit message — không âm thầm nới.
 */
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// After lazy-loading /compare, the initial bundle is ~386kB; keep a 650kB budget to catch regressions.
const THRESHOLD_BYTES = 650 * 1024;

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectRoot, 'dist');
const indexHtmlPath = join(distDir, 'index.html');

let indexHtml;
try {
  indexHtml = readFileSync(indexHtmlPath, 'utf8');
} catch {
  console.error(`[check-bundle-size] Không đọc được ${indexHtmlPath} — chạy "npm run build" trước.`);
  process.exit(1);
}

const scriptMatch = indexHtml.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/);
if (!scriptMatch) {
  console.error('[check-bundle-size] Không tìm thấy <script type="module" src="..."> trong dist/index.html — cấu trúc build đã đổi?');
  process.exit(1);
}

const entryRelativePath = scriptMatch[1].replace(/^\//, '');
const entryPath = join(distDir, entryRelativePath);
const entrySize = statSync(entryPath).size;

const assetsDir = join(distDir, 'assets');
const lazyChunkFiles = readdirSync(assetsDir).filter((file) => file.endsWith('.js') && join('assets', file) !== entryRelativePath);
const lazyChunkTotal = lazyChunkFiles.reduce((sum, file) => sum + statSync(join(assetsDir, file)).size, 0);

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}kB`;
}

console.log(`[check-bundle-size] Initial entry: ${entryRelativePath} — ${formatKb(entrySize)} (ngưỡng ${formatKb(THRESHOLD_BYTES)})`);
console.log(`[check-bundle-size] ${lazyChunkFiles.length} lazy chunk khác, tổng ${formatKb(lazyChunkTotal)} — KHÔNG tính vào ngưỡng (chỉ tải khi user mở đúng route).`);

if (entrySize > THRESHOLD_BYTES) {
  console.error(
    `[check-bundle-size] FAIL — initial bundle ${formatKb(entrySize)} vượt ngưỡng ${formatKb(THRESHOLD_BYTES)}. Xem docstring đầu file này trước khi nới ngưỡng.`
  );
  process.exit(1);
}

console.log('[check-bundle-size] OK.');
