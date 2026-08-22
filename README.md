# UniscoreVN

Công cụ tính & so sánh điểm xét tuyển đại học Việt Nam — nhập điểm một lần, xem kết quả ở nhiều trường cùng lúc.

**[uniscorevn.vercel.app](https://uniscorevn.vercel.app)** · [GitHub](https://github.com/shadowhunter67/uniscorevn) · [Báo lỗi & góp ý](https://github.com/shadowhunter67/uniscorevn/issues)

> UniscoreVN là công cụ độc lập, không thuộc Bộ GD&ĐT hay bất kỳ cơ sở đào tạo nào. Kết quả chỉ mang tính tham khảo; người dùng phải đối chiếu đề án và thông báo tuyển sinh chính thức.

## Giới thiệu

UniscoreVN là công cụ tính, so sánh và mô phỏng điểm xét tuyển đại học Việt Nam — chạy hoàn toàn trên trình duyệt, không backend, không cần đăng nhập.

Mỗi công thức được triển khai theo quy định tuyển sinh của từng cơ sở đào tạo và gắn nguồn chính thức. Trường hoặc phương thức chưa đủ dữ liệu sẽ được đánh dấu chưa hỗ trợ thay vì ước đoán.

## Tính năng

- Tính điểm xét tuyển realtime từ điểm ĐGNL, THPT, học bạ, điểm cộng, điểm ưu tiên
- So sánh cùng một hồ sơ trên nhiều trường qua [`/compare`](https://uniscorevn.vercel.app/compare)
- Quy đổi chứng chỉ ngoại ngữ quốc tế (IELTS/TOEFL/TOEIC...) sang điểm thi THPT
- Đặt mục tiêu điểm số, tính ngược ĐGNL cần đạt; mô phỏng kịch bản điểm giả định
- So sánh với điểm chuẩn tham khảo nhiều ngành, nhiều năm
- Nhập điểm một lần, dùng lại cho nhiều trường; chia sẻ kết quả qua URL, không cần tài khoản
- Tự lưu điểm đã nhập trên trình duyệt (không gửi lên server)

## Phạm vi và độ phủ

UniscoreVN tập trung vào các cơ sở có tuyển sinh trình độ đại học tại Việt Nam mà người dùng cần tính, so sánh hoặc mô phỏng điểm xét tuyển. Cao đẳng nghề và trung cấp không nằm trong phạm vi chính. Các đơn vị tuyển sinh cao đẳng Giáo dục Mầm non/cao đẳng sư phạm có thể được quản lý như một nhóm riêng khi có nguồn chính thức đủ rõ.

Snapshot hiện tại được tính từ `schoolRegistry` bằng `npm run stats:coverage`:

| KPI | Số lượng |
|---|---:|
| Mục trong catalog/search/compare | 238 |
| Cơ sở được tính vào KPI tuyển sinh độc lập | 228 |
| Đơn vị nội bộ/không tính vào KPI cơ sở | 10 |
| Có dữ liệu tuyển sinh hoặc capability cao hơn | 35 |
| Chỉ kiểm tra điều kiện/ngưỡng | 18 |
| Có calculator một phần | 3 |
| Calculator đã xác minh | 14 |
| Chỉ có trong catalog | 203 |

Con số `238` là độ phủ danh mục/search/compare, không phải 100% calculator. Một số mục trong catalog là school/faculty nội bộ của hệ thống đại học lớn; các mục này vẫn có thể giữ cho navigation hoặc mapping chương trình, nhưng không làm tăng KPI "cơ sở đào tạo tuyển sinh độc lập".

Nguồn mẫu số 238 hiện là số liệu tổng hợp thứ cấp tính đến 09/2025 ([nguồn](https://veci.edu.vn/nam-2025-ca-nuoc-co-238-co-so-giao-duc-dai-hoc-gan-1-200-co-so-giao-duc-nghe-nghiep/)); cần tiếp tục đối chiếu với cổng tuyển sinh Bộ GD&ĐT và website chính thức của từng cơ sở khi nâng từ catalog-only lên calculator.

## Trạng thái hỗ trợ

| Trường | Trạng thái |
|---|---|
| HCMUT, UEH, UEL, HCMUS, USSH, IU, TDTU, HUFLIT, UMP, UFM, IUH, FTU, HUTECH, HCMULAW | ✅ Calculator đã xác minh trong phạm vi đã công bố |
| UHS, HCMUTE, NEU | 🟡 Calculator một phần hoặc quy đổi/logic hỗ trợ, chưa đủ toàn bộ phương thức |
| UIT, AGU, HCMUE, VLU, PTIT, HUB, HUIT, NTTU, HSU, UEF, CTU, TDMU, HIU, OU, SGU, HNUE, VinhUni, UTC | 🟡 Kiểm tra điều kiện/ngưỡng, chưa có calculator chính xác |
| GDU, STU, PNTU, BDU, LHU, NLU, UAH, UTH, VAA, HCMUNRE, CTUMP, CTUET, NCTU, TDU, TVU, DThU, TGU, VNKGU, BLU, DNU, BVU, MKU, TTU, DLA, PVU | ⚪ Có trong roster miền Nam, chưa đủ nguồn chính thức để tính |
| VNU-UET, VNU-UEB, VNU-HUS, VNU-USSH, VNU-ULIS, VNU-UED, VNU-UMP, VJU, VNU-LS, VNU-HSB, VNU-IS, HUST, TMU, HUCE, HUMG, HOU, HANU, HaUI, AOF, BAV, VNUA, DAV, AJC, HLU, HMU, HUP, TLU, VNUF, TLU-HN, FPTU, HUBT, DNU-HN, Phenikaa, TNU, DHP, VMU, HPMU, HDU, HTU, HALOU, TQU, HVU, HueU, HUSC, HCE, HUL, HUAF, HUED, HUMP, HUFL, HAT, UDN, DUT, DUE-UDN, UED-UDN, UFLS-UDN, UTE-UDN, VKU, DTU, UDA, NTU, DLU, QNU, TTN, QNamU, QBU, PDU, PYU, UKH, MUCE, BMTU, DUMTP, PCTU, YDLU, UPT | ⚪ Có trong roster toàn quốc, chưa đủ nguồn chính thức để tính |
| VNU-SIS, TNUS, TUEBA, TNUT, TUAF, TNUE, TUMP, TNU-IS, TNUFL, SoICT, SMS-HUST, SME-HUST, SCLS, SEEE, SEM-HUST, NEU-CoB, NCEPA, NCT-NEU, NAEM, UAD, NUAE, HUPES, HCMUPES, VGU, HPU2, VNAM, VNAD, HUC, VNUFA, SKDA, HCMCONS, SKDAHCM, HCMUFA, USH, VHS, HAM, UPES1, DSU, UTT, HAU, HNMU, HCA, UHD, NAUE, VMU-Vinh, HLUV, TBU, TUCST, CMCU, UTM, HDIU, HBU, NTU-HN, FBU, ThanhDo, VinUni, DHV, UMT, BHU, EAUT, CVAUni, LTVUni, TVUni, KBU, MDU, VTTU, EIU, AIU, QTU, TBDU, PXU, FUV, RMITVN, BUV, APD, NAPA, GASS, USTH, VWA, VYA, TUU, HUNRE, ULSA, MPA, MAL, MSA, ACTVN, MTA, AADAA, VMMU, NDA, OCP, TQT, SIGO, AOC, CCO, PSA, PPA, FPFU, PSU-CAND, PPU-CAND, BGA, VNA-Navy | ⚪ Có trong roster 238, chưa đủ nguồn chính thức để tính |

"Chính xác" nghĩa là công thức, ngưỡng, điểm cộng và điểm ưu tiên đều có nguồn chính thức xác minh trong phạm vi đã công bố — một số trường chỉ chính xác trong phạm vi cụ thể (ví dụ thí sinh không có thành tích cộng điểm). Nhóm roster catalog đã được nối vào registry/search/compare ở trạng thái `formula-incomplete`; UniscoreVN sẽ không kết luận đủ điều kiện hoặc tính điểm cho các trường này cho đến khi có nguồn chính thức. Chi tiết từng trường, nguồn dữ liệu, và giới hạn hiện tại xem [docs/admission-research-2026.md](docs/admission-research-2026.md).

## Bắt đầu

```bash
npm install
npm run dev        # dev server
npm run test       # chạy test
npm run lint       # lint
npm run build      # build production
npm run audit:data # kiểm tra tính nhất quán/nguồn dữ liệu tuyển sinh
```

Trên Windows có thể double-click [start-dev.bat](start-dev.bat) — tự cài dependency nếu thiếu rồi mở dev server.

## Kiến trúc

Mỗi trường có công thức, thang điểm, và điều kiện xét tuyển riêng, sống độc lập trong `src/schools/<id>/` — không có "công thức chung" ép buộc. `src/core/` chỉ chứa phần thật sự dùng chung: hồ sơ điểm gốc của thí sinh, kiểu dữ liệu, và tiện ích tính toán. Thêm một trường mới không cần đụng vào phần lõi hay các trường khác.

Chi tiết cấu trúc thư mục, nguyên tắc thêm trường mới, và các quy tắc bắt buộc (nguồn dữ liệu, độ chính xác, kiểm thử) nằm ở [docs/architecture.md](docs/architecture.md).

## Deploy

Deploy qua Vercel (framework preset: Vite), domain canonical `uniscorevn.vercel.app`.

## Tài liệu thêm

- [docs/architecture.md](docs/architecture.md) — kiến trúc, model dữ liệu, quy tắc kỹ thuật bắt buộc
- [docs/admission-research-2026.md](docs/admission-research-2026.md) — research công thức từng trường
- [docs/data-maintainer-guide.md](docs/data-maintainer-guide.md) — quy trình thêm/cập nhật dữ liệu tuyển sinh
- [docs/release-checklist.md](docs/release-checklist.md) — quy trình release
