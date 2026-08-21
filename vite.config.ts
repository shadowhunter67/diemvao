import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Bundle 1 file duy nhất đã vượt 500kb mặc định vì mỗi trường mới thêm business logic/Page
    // riêng (kiến trúc multi-school, xem CLAUDE.md) — chưa code-split theo route, chấp nhận cảnh
    // báo bị tắt thay vì im lặng bỏ qua cảnh báo mỗi lần build. Cân nhắc dynamic import() theo
    // school khi bundle lớn hơn đáng kể.
    chunkSizeWarningLimit: 1200,
  },
})
