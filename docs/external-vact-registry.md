# Registry các trường ngoài ĐHQG-HCM dùng V-ACT (ĐGNL ĐHQG-HCM)

Khởi tạo 2026-08-11, cập nhật 2026-08-11 (round 2). UEH đã research đủ sâu để **implement thật**
(xem `schools/ueh/`) — không còn nằm trong bảng theo dõi này, có mục riêng trong
`admission-research-2026.md`. Các trường còn lại trong bảng dưới vẫn ở mức research (đa số
partial), CHƯA implement.

Không dùng cột `status: supported/unsupported` — mỗi trường có thể đạt các mức capability khác
nhau độc lập với nhau (xem `core/schoolModule.ts` phần ghi chú hướng capability model).

## 🔑 Lead quan trọng nhất tìm được round này: bảng bách phân vị quốc gia

ĐHQG-HCM công bố "Khung quy đổi tương đương điểm ĐGNL với điểm thi tốt nghiệp THPT" (phương pháp
bách phân vị, 5 tổ hợp: A00/A01/B00/C00/D01), theo Thông tư 06/2026/TT-BGDĐT Phụ lục 2 —
`vnuhcm.edu.vn`, công bố 2026-07-06. **Đây rất có thể chính là bảng mà UIT ("phương pháp bách
phân vị"), HCMUS (bảng nội suy A1/A2/X1/X2), và IUH đều tham chiếu tới nhưng chưa trích xuất
được** — nếu lấy được bảng NÀY một lần, có thể unblock cả 3 trường cùng lúc.

**Chưa lấy được trong batch này**: trang `vnuhcm.edu.vn` render bằng JS (WebFetch không đọc được
nội dung), bản trên `xaydungchinhsach.chinhphu.vn` mà tìm thấy là bảng **năm 2025** (không phải
2026, không dùng được — mỗi năm bách phân vị khác nhau theo phổ điểm thật của năm đó). Cần
navigate bằng trình duyệt thật (chrome-devtools MCP) tới `vnuhcm.edu.vn` bản 2026, hoặc tìm lại
thông báo 2026-07-06 bản ảnh/PDF gốc. **Đây là next-highest-ROI action** — ưu tiên hơn cả research
7 trường còn "chưa research" bên dưới, vì 1 lần lấy đúng bảng có thể mở khóa 3 trường cùng lúc.

## Nguồn tổng hợp ưu tiên

Trung tâm Khảo thí & Đánh giá Chất lượng Đào tạo — ĐHQG-HCM là nguồn công bố danh sách chính thức
các cơ sở sử dụng kết quả V-ACT. Ghi nhận nội bộ (chưa re-verify trong batch này, cần admin
cập nhật khi có nguồn mới):

> Khoảng 118 cơ sở ĐH/CĐ trên cả nước sử dụng V-ACT 2026 (khoảng 99 ngoài hệ thống ĐHQG-HCM);
> trong phạm vi TP.HCM + Đông Nam Bộ + ĐBSCL, khoảng 50 cơ sở đã được lọc sơ bộ. Con số này
> KHÔNG phải invariant — admin cần cập nhật khi có công bố mới, không hard-code vào UI.

## Bảng theo dõi

| # | Trường | usesVact | formulaStatus | cutoffStatus | eligibilityStatus | sourceQuality | calculatorWorthBuilding | primarySources | blockers |
|---|--------|----------|----------------|--------------|--------------------|----------------|--------------------------|-----------------|----------|
| 1 | ĐH Mở TP.HCM (OU) | ✅ xác nhận (1 trong 6 phương thức độc lập, không phải trọng số kết hợp) | partial — điểm ĐGNL raw dùng trực tiếp làm điểm xét (không có công thức kết hợp cần tìm), nhưng điểm cộng (0,5–1,5 học bạ/HSG) chưa có bảng đầy đủ | missing — không tìm thấy ngưỡng sàn/cutoff/danh sách ngành | missing | official (ou.edu.vn, tuyensinh.ou.edu.vn — đã fetch trực tiếp) | false (chưa) | `ou.edu.vn/tuyen_sinh/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026/`, `tuyensinh.ou.edu.vn/...ban-update-ngay-10032026` | Thiếu ngưỡng sàn ĐGNL, cutoff, danh sách ngành — trang chi tiết không có, cần liên hệ trực tiếp trường theo khuyến nghị trên trang |
| 2 | ĐH Công nghiệp TP.HCM (IUH) | ✅ xác nhận, quy đổi theo Phụ lục 2 Thông tư 06/2026 (bảng bách phân vị quốc gia — xem mục lead ở trên) | partial — có công cụ tính điểm chính thức (`tuyensinh.iuh.edu.vn/thiSinh/fTinhDiem_2026`) và biết các input (ĐGNL, ưu tiên KV/ĐT, thành tích, IELTS/TOEIC/VSTEP) nhưng CHƯA đối chiếu được trọng số/công thức cụ thể đằng sau tool — theo rule #13, không gọi verified nếu chỉ có tool mà chưa có văn bản gốc khớp | partial — biết range chung 2026 là 17–26/30 (không phải per-ngành) | missing | official nhưng chưa đủ (tool UI đã thấy, văn bản gốc quy đổi trọng số chưa đối chiếu) | false (chưa) | `tuyensinh.iuh.edu.vn/thiSinh/fTinhDiem_2026` | Cần đối chiếu tool với văn bản/quy chế gốc (rule #13) trước khi gọi formula verified; cần cutoff per-ngành |
| 3 | ĐH Nông Lâm TP.HCM (HCMUAF) | ✅ xác nhận (3 phương thức: ĐGNL, HB+NK, THPT+NK — NK = năng khiếu?) | missing — chưa tìm thấy trọng số/công thức cụ thể | missing | missing | official nhưng nông (chỉ tìm thấy tên phương thức, chưa vào chi tiết `ts.hcmuaf.edu.vn`) | false | `ts.hcmuaf.edu.vn`, `hcmuaf.edu.vn` | Chưa fetch trực tiếp trang chi tiết — mới dừng ở tên 3 phương thức |
| 4 | ĐH Công nghệ TP.HCM (HUTECH) | ✅ xác nhận, mô hình threshold trực tiếp (không kết hợp trọng số) | partial — biết ngưỡng ĐGNL theo nhóm ngành (Y=650/Dược=570/khác=550, thang 1200) và ngưỡng V-SAT tương ứng, nhưng chưa biết có cộng thêm gì khác không | missing | partial (ngưỡng theo nhóm ngành đã có, chưa map hết ngành) | official (`hutech.edu.vn`, qua search summary — CHƯA fetch trực tiếp để xác nhận 'verified') | false | `hutech.edu.vn/tuyensinh/tin-tuyen-sinh/14634076-...` | Chưa fetch trực tiếp; chưa có danh sách ngành/cutoff |
| 5 | ĐH Tôn Đức Thắng (TDTU) | ✅ xác nhận, PT2 = ĐGNL riêng biệt (không kết hợp), PT1 = THPT+học bạ+thành tích thang 100 (trọng số chưa rõ) | partial — biết có "3-tier" (điều kiện môn chính, tổ hợp, ngưỡng sàn theo phương thức) và 1 ví dụ cụ thể (ngành Tiếng Anh: sàn 15/30 tổ hợp + Anh≥6 + tổng ≥62/100) nhưng không phải bảng đầy đủ mọi ngành | missing — chỉ biết range chung 55–62/100 tùy nhóm ngành | partial (1 ví dụ ngành) | official (VnExpress dẫn thông báo trường — cross-checked, chưa fetch trực tiếp trang trường) | false | `vnexpress.net/chi-tiet-diem-san-cong-thuc-tinh-diem-chuan-quy-doi-cua-dai-hoc-ton-duc-thang-nam-2026-5093941.html` | Cần fetch trực tiếp `tdtu.edu.vn`/`admission.tdtu.edu.vn` để lấy bảng đầy đủ thay vì 1 ví dụ |
| 6 | ĐH Kinh tế - Tài chính TP.HCM (EIU/UEF) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | (chưa xác định domain chính thức) | Chưa bắt đầu — cần làm rõ trường viết tắt EIU hay UEF trước khi research (2 tên khác nhau dễ nhầm) |
| 7 | ĐH Nguyễn Tất Thành (NTTU) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | ntt.edu.vn (chưa fetch) | Chưa bắt đầu research trong round này |
| 8 | ĐH Tài chính - Marketing (UFM) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | ufm.edu.vn (chưa fetch) | Chưa bắt đầu research trong round này |
| 9 | ĐH Sư phạm Kỹ thuật TP.HCM (HCM-UTE) | chưa xác nhận | chưa research | chưa research | chưa research | — | chưa đánh giá | hcmute.edu.vn (chưa fetch) | Chưa bắt đầu research trong round này |

Ghi chú: `SGU` và "các trường Đông Nam Bộ/ĐBSCL còn lại" chưa đưa vào bảng theo dõi — cần một
vòng research/liệt kê riêng trước khi thêm dòng.

## Quy trình khi research một trường trong bảng trên

1. Xác nhận `usesVact` từ nguồn chính thức của trường (không chỉ dựa vào danh sách tổng hợp của
   Trung tâm Khảo thí — cross-check với thông báo tuyển sinh riêng của trường).
2. Research đủ 15 câu hỏi như đã áp dụng cho UEL/HCMUS/USSH/UEH (xem đầu file
   `admission-research-2026.md`): thành phần, quy đổi, môn hệ số, điểm cộng, ưu tiên, chứng chỉ
   quốc tế, thang điểm, ngưỡng/cutoff theo ngành.
3. Điền đủ 7 cột trong bảng trên, KHÔNG để trống `blockers` nếu formula/cutoff chưa đủ.
4. Chỉ implement calculator khi `formulaStatus` + `cutoffStatus` đều đủ nguồn — matching nguyên
   tắc "đúng dữ liệu > nhiều calculator" xuyên suốt dự án.
5. Nếu trường có công cụ tính điểm chính thức trên web (như IUH) — KHÔNG coi UI tool = verified
   formula. Phải đối chiếu với văn bản/quy chế/thông báo gốc trước (xem rule #13 batch
   2026-08-11).
