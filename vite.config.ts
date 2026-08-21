import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // P1 code-splitting (batch production-readiness): 16 trường "nặng" (có Page/calculator UI
    // thật) giờ lazy-load riêng chunk qua `React.lazy` (xem `schools/index.ts`), initial bundle
    // giảm từ ~1038kB xuống ~675kB gzip ~165kB. Vẫn trên mức mặc định 500kB (index chunk gồm
    // landing page/metadata 30 trường/toàn bộ core logic dùng chung) — 700 phản ánh đúng kích
    // thước THẬT hiện tại (không phải số tùy tiện để im lặng cảnh báo), để cảnh báo vẫn nổ nếu có
    // regression thật đẩy bundle lớn hơn. `scripts/check-bundle-size.mjs` (P3) enforce ngưỡng này
    // trong CI, không chỉ dựa vào cảnh báo build.
    chunkSizeWarningLimit: 700,
  },
})
