# Research tuyển sinh 2026 — Uniscore

Research phục vụ quyết định trường/công thức nào đủ điều kiện implement calculator trong Uniscore. Nguyên tắc: **research trước, code sau; không suy đoán công thức; official source luôn ưu tiên cao nhất**. Ngày research: 2026-08-10.

Thứ tự ưu tiên nguồn: (1) website tuyển sinh chính thức của trường → (2) website chính thức trường → (3) website ĐHQG-HCM → (4) đề án tuyển sinh chính thức → (5) thông báo tuyển sinh/điểm chuẩn chính thức → (6) PDF/ảnh từ trường → (7) báo chí uy tín (chỉ cross-check hoặc đọc bảng khó truy cập, không dùng làm nguồn chính duy nhất). Không dùng: blog SEO, forum, Facebook cá nhân, trang tổng hợp không dẫn nguồn, Google snippet không có link xác minh được.

## Phần A — HCMUT: mở rộng nhóm thí sinh

HCMUT 2026 định nghĩa **8 "đối tượng" (2.1–2.8)** trong phương thức Xét tuyển Tổng hợp, gộp thành 5 nhóm UI trong Uniscore:

| Đối tượng HCMUT | Nhóm UI Uniscore | Công thức | Trạng thái |
|---|---|---|---|
| 2.1 — có ĐGNL ĐHQG-HCM 2026 | `dgnl` | Điểm năng lực = ĐGNL chuẩn hóa (không đổi, hành vi cũ) | ✅ Supported |
| 2.2 — không có ĐGNL | `no-dgnl` | Điểm năng lực = Điểm THPT quy đổi × **0.75** | ✅ Supported (mới) |
| 2.4 — có chứng chỉ quốc tế (SAT/ACT/IB/A-Level) | `international-certificate` | Có "Bảng quy đổi chứng chỉ tuyển sinh quốc tế, thang 100" theo đề án, nhưng chưa lấy được bảng số liệu cụ thể | ⏳ Chưa hỗ trợ |
| 2.3 — tốt nghiệp THPT nước ngoài | `foreign-high-school` | Chưa tìm được công thức | ⏳ Chưa hỗ trợ |
| 2.5–2.8 — chương trình đặc thù/TNE/chuyển tiếp quốc tế | `special-program` | Công thức riêng theo chương trình, chưa research | ⏳ Chưa hỗ trợ |

### Nguồn — Đối tượng 2.2 (không ĐGNL)

- **Công thức**: `Điểm năng lực = Điểm TNTHPT quy đổi × 0.75`, trong đó `Điểm TNTHPT quy đổi = (Toán×2 + Môn2 + Môn3) / 4 × 10` — **giống hệt** công thức "THPT chuẩn hóa" (thành phần 20%) đã có sẵn trong `calculator.ts` (`convertThptScore`), nên chỉ cần nhân thêm hệ số 0.75, không cần logic mới.
- Điểm học lực tổng thể **không đổi trọng số** (vẫn Điểm năng lực×70% + THPT×20% + Học bạ×10%) — đúng yêu cầu "không tự đổi trọng số/chia lại" của đề bài.
- **Nguồn đã dùng**:
  - Cross-check 1: VnExpress, "Cách tính điểm xét tuyển mới năm 2026 vào Trường Đại học Bách khoa TPHCM" (dantri.com.vn, xác nhận công thức tổng "Điểm năng lực×70%+THPT×20%+Học bạ×10%" và có nhắc quy đổi SAT nhưng không có bảng).
  - Cross-check 2: `diemthi.tuyensinh247.com/de-an-tuyen-sinh/dai-hoc-bach-khoa-hcm-QSB.html` — trang republish PDF Đề án tuyển sinh 2026 của HCMUT (link file gốc `images.tuyensinh247.com/picture/2026/0227/...`), xác nhận nguyên văn "Đối tượng 2.2: Thí sinh KHÔNG CÓ kết quả thi ĐGNL ĐHQG-HCM năm 2026" + công thức `[Điểm năng lực] = [Điểm TNTHPT quy đổi] × 0.75`.
  - **Hạn chế đã biết**: chưa fetch trực tiếp được PDF gốc trên `hcmut.edu.vn` (2 lần timeout khi WebFetch trang `hcmut.edu.vn/tintuc/cong-bo-thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026`) — độ tin cậy dựa trên 2 nguồn độc lập cùng khớp số liệu 0.75, không phải đọc trực tiếp file PDF trường. Nếu có ai đọc được bản gốc, nên đối chiếu lại.
- **Chứng chỉ quốc tế (2.4)**: đề án có nhắc "Bảng quy đổi [Điểm chứng chỉ tuyển sinh quốc tế quy đổi], thang 100" với SAT/ACT/IB/A-Level nhưng research chưa lấy được giá trị bảng cụ thể — **không implement**, tránh suy đoán.
- **2.3, 2.5–2.8**: chỉ xác nhận được tên/mô tả nhóm, chưa có công thức — **không implement**, UI hiển thị "chưa hỗ trợ".

## Phần B — 8 trường thành viên ĐHQG-HCM

| Trường | Dùng ĐGNL? | Xét không ĐGNL? | Xét tổng hợp? | Trọng số (khi có ĐGNL) | Formula verified | Trạng thái Uniscore |
|---|---|---|---|---|---|---|
| **HCMUT** | Có | Có (0.75×THPT) | Có | ĐGNL 70% + THPT 20% + Học bạ 10% | ✅ true | **Supported** |
| **UIT** | Có | Có (THPT, kể cả quy đổi IB/A-Level) | Có | THPT 47,5% + ĐGNL 47,5% + Học bạ 5% | ✅ true (2 nguồn độc lập khớp) | Researching — ứng viên #1 |
| **UEL** | Có | Có (90% THPT+10% học bạ) | Có | ĐGNL 55% + THPT 35% + Học bạ 10% (đổi theo nhóm đối tượng) | ✅ true | Researching — ứng viên #2 |
| **HCMUS** | Có | Có (thay thế trực tiếp) | Có | 80% (THPT hoặc ĐGNL, chọn cao hơn) + 20% học bạ | ✅ true | Researching — ứng viên #3 |
| **USSH** | Có | Có (90% THPT+10% học bạ) | Có | 3 công thức theo đối tượng: 45/45/10, 90/10 (THPT), 90/10 (ĐGNL) | ✅ true (thiếu bảng điểm cộng/ưu tiên chi tiết) | Researching |
| **IU** | Có | Không xác định | Có | Cấu trúc `k1×THPT+k2×ĐGNL+k3×Học bạ` xác nhận được, **giá trị k1/k2/k3 mâu thuẫn giữa nguồn thứ cấp** | ❌ false | Formula-incomplete |
| **AGU** | Có | Có (chọn phương án có lợi) | Có | Cấu trúc `b1×THPT+b2×ĐGNL+b3×Học bạ` xác nhận, **giá trị cụ thể chỉ có ở nguồn thứ cấp** (tuyensinh247, không phải ưu tiên cao) | ❌ false | Formula-incomplete |
| **UHS** | Có | Không xác định | Có (phương thức duy nhất 2026) | Trọng số ghi rõ là **"dự kiến, chưa chính thức"** trên chính trang trường | ❌ false | Formula-incomplete |

Chi tiết đầy đủ 15 câu hỏi/trường (thành phần, quy đổi, môn hệ số, điểm cộng, ưu tiên, chứng chỉ quốc tế, IELTS/TOEFL, thang điểm, điều kiện/cutoff theo ngành) — xem log research gốc, tóm tắt trọng tâm:

- **UIT**: `Hs1(THPT) 47,5% + Hs2(ĐGNL) 47,5% + Hs3(học bạ) 5%`, thang 100. Điểm cộng ≤10/100 (huy chương Olympic/giải quốc gia). Có ngưỡng SAT≥1170-1200/ACT≥26/IB≥30/A-Level 70% PUM. Ngưỡng riêng ngành Thiết kế vi mạch cao hơn. Nguồn: `tuyensinh.uit.edu.vn` (thông báo ngưỡng chính thức) + Cổng TTĐT Chính phủ (cross-check trọng số, khớp VnExpress). **Research bổ sung 2026-08-10** (đọc trực tiếp toàn bộ 6 thông báo chính thức UIT do user cung cấp URL, xem `schools/uit/`):
  - Cấu trúc công thức đầy đủ hơn (Cổng TTĐT Chính phủ, đọc nguyên văn): `THPT = Max(THPT_ĐT, THPT_QĐ, THPT_QT)`, `ĐGNL = Max(ĐGNL_ĐT, ĐGNL_QĐ, ĐGNL_QT)`. Quy đổi THPT↔ĐGNL theo "phương pháp bách phân vị" — **có nêu tên phương pháp, KHÔNG có bảng/công thức cụ thể** → vẫn blocked cho exact calculator.
  - **Bảng điểm cộng đầy đủ** (thông báo 20/05/2026, đọc nguyên văn text — không phải ảnh): 4 nhóm, mỗi nhóm mức trần cố định 10/5/5/5, tổng cap 10/100. Nhóm 1 (Olympic quốc tế/HSG quốc gia/HSG Tỉnh-Thành) có bảng môn↔ngành loại trừ (KTMT + TKVM không Văn; TTĐPT không Hóa, có thêm Sử/Địa; 4 ngành Khoa học Dữ liệu/Mạng máy tính/HTTT/HTTT-tiên tiến có thêm Sinh; CNTT Việt Nhật có thêm Nhật). Nhóm 2 (OLP/VOAI), nhóm 3 (chứng chỉ ngoại ngữ IELTS≥5.0/TOEFL≥50/TOEIC 650+250/JLPT≥N3), nhóm 4 (149 trường THPT ưu tiên ĐHQG-HCM). Nguồn nói mỗi nhóm không có thang trượt theo hạng — đạt điều kiện là nhận trọn mức trần → ban đầu implement như bonus calculator trả thẳng điểm cộng (`schools/uit/bonus.ts`).
    - **2026-08-11 — hạ cấp xuống Bonus Eligibility Checker** (`calculateUitBonusEligibility`, xem `schools/uit/bonus.ts`): quyết định policy thận trọng, KHÔNG phải bằng chứng mới phủ định research trên. `maxPoints` từng nhóm nay chỉ dùng như upper bound hiển thị, không trả `awardedPoints`/tổng điểm cộng suy ra. Lý do: hồ sơ xét duyệt thật (minh chứng, hội đồng) có thể có bước xác nhận/điều chỉnh ngoài phạm vi 1 thông báo web đã đọc, nên UniScore chọn under-claim thay vì hiển thị một con số cuối cùng có thể sai. Nếu sau này có thêm nguồn xác nhận quy trình xét duyệt không có bước điều chỉnh nào khác, có thể cân nhắc phục hồi lại exact bonus calculator.
  - **Ngưỡng chứng chỉ quốc tế: 2 tầng riêng biệt, khác mục đích** — ngưỡng đăng ký minh chứng (thông báo 20/05/2026, thấp hơn: SAT≥1080/ACT≥21/A-Level PUM≥67%/IB≥29) và ngưỡng đảm bảo chất lượng đầu vào (thông báo 08/07/2026, cao hơn: SAT≥1170/ACT≥26/A-Level≥70%/IB≥30) — đã implement `schools/uit/eligibility.ts` phân biệt rõ 2 kết quả, không gộp.
  - **Tuyển thẳng (Điều 8)**: route tuyển sinh tách biệt hoàn toàn khỏi combined-score, có bảng điều kiện môn/ngành riêng (thông báo 20/05/2026) — đã implement `schools/uit/data/directAdmission.ts`, hiển thị info-only, không cộng vào công thức.
  - **Điểm chuẩn 19 ngành**: đối chiếu lại dữ liệu đã lưu từ phase trước với nguồn gốc — khớp 100%, không sửa.
  - **Vẫn KHÔNG tìm được**: công thức bách phân vị cụ thể, cách tính điểm học bạ, cách ĐGNL_QT (SAT/ACT→ĐGNL) và THPT_QT (IB/A-Level→THPT) được tính — exact final-score calculator UIT tiếp tục không bật.
- **UEL**: `ĐGNL 55% + THPT 35% + Học bạ 10%` (nhóm đủ cả 2 loại điểm); nhóm chỉ 1 loại: 90%/10%. Bảng ưu tiên KV/ĐT đầy đủ trên thang 100 (KV1=9,17/KV2NT=8,33/KV2=7,5/KV3=6,67). Điểm cộng IELTS/TOEFL "theo Phụ lục 2" — chưa đọc được bảng. Có Phương thức 5 riêng cho SAT/ACT/IB/A-Level. Nguồn: `uel.edu.vn` + `tuyensinh.uel.edu.vn` (chính thức).
  - **Research bổ sung 2026-08-11** (đọc trực tiếp `tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/` + ảnh công bố điểm chuẩn gốc, xem `schools/uel/`):
    - Công thức đầy đủ theo Đối tượng: ĐT1 (có ĐGNL) = `X·β1 + Y·β2 + Z·β3`; ĐT2 (không ĐGNL) = `(Y·α)·β1 + Y·β2 + Z·β3` (α=100% → rút gọn = 90%Y + 10%Z); ĐT3 (chỉ ĐGNL, tự do) = `X·β1 + X·β2 + Z·β3` (= 90%X + 10%Z); ĐT4 = chứng chỉ quốc tế (SAT/ACT/IB/A-Level) quy đổi — **chưa có công thức quy đổi cụ thể, KHÔNG implement**.
    - Quy đổi thang 100: `X (ĐGNL) = raw × 100/1200`; `Y (THPT) = tổng 3 môn tổ hợp × 100/30`; `Z (học bạ) = tổng điểm TB 3 môn tổ hợp (mỗi môn = TB cả năm lớp 10+11+12) × 100/30`. **Đây là công thức normalization RÕ RÀNG HƠN UIT** (UIT chỉ nêu tên "phương pháp bách phân vị", không có công thức) — đã implement `schools/uel/eligibility.ts` (ngưỡng THPT ≥50/100) nhưng KHÔNG mở exact final-score calculator vì 2 phần còn thiếu dưới đây vẫn có thể làm sai điểm cuối.
    - Ngưỡng đầu vào: tổng 3 môn THPT tổ hợp quy đổi thang 100 ≥ 50.
    - Điểm cộng: cap tổng 10/100 (xác nhận). Nhóm 149 trường THPT ưu tiên ĐHQG-HCM: **+5/100 cố định** (verified) — đã implement như bonus eligibility category (`schools/uel/data/bonus.ts`, cùng chính sách eligibility-only với UIT, không trả awarded score). Nhóm chứng chỉ ngoại ngữ quốc tế (IELTS≥5.0 tương đương): biết khoảng 2–5/100 (qua VnExpress dẫn "Phụ lục 2"), nhưng bảng chi tiết theo từng mức chứng chỉ nằm trong ảnh lazy-load không trích xuất được qua fetch tool — **KHÔNG implement như category có số cụ thể**, chỉ ghi chú blocked.
    - Điểm ưu tiên khu vực thang 100 (KV1=9,17/KV2-NT=8,33/KV2=7,5/KV3=6,67): verified, nhưng **không tìm thấy nguồn xác nhận UEL có áp quy tắc giảm dần khi tổng điểm cao** (như HCMUT) hay không — hiển thị như bảng tra cứu tham khảo (`UelExplorerPage.tsx`), KHÔNG cộng vào một điểm cuối cùng.
    - **Điểm chuẩn 38 ngành/chuyên ngành 2026**: đọc trực tiếp ảnh gốc full-resolution `UEL_Cong-bo-diem-chuan-2026-724x1024.png` (tải về, đọc bằng công cụ đọc ảnh, đối chiếu số lượng 38/38 và khoảng điểm 65,01–90,01 khớp báo chí cùng ngày) — đã implement `schools/uel/data/cutoffs.ts`, đủ chuẩn tương đương cách HCMUT/UIT đọc ảnh gốc.
    - **Kết luận**: implement Admission Explorer thật (info + cutoff đầy đủ + ngưỡng đầu vào + bonus eligibility + bảng ưu tiên tham khảo + source), `status: 'researching'`, exact calculator tiếp tục blocked cho tới khi có bảng điểm cộng ngoại ngữ chi tiết + xác nhận quy tắc ưu tiên.
- **HCMUS**: `0.8×(THPT hoặc ĐGNL, chọn cao hơn) + 0.2×Học bạ`, tính trên thang 30 rồi quy đổi ×100/30 để công bố. Điểm cộng ≤1,5/30. Ưu tiên theo khung chuẩn quốc gia (giống cách HCMUT/Uniscore đã làm). Điều kiện riêng theo ngành (vd Thiết kế vi mạch yêu cầu Toán nhóm 20% cao nhất). Nguồn: `tuyensinh.hcmus.edu.vn` (chính thức, 3 trang khác nhau).
  - **Research bổ sung 2026-08-11** (đọc trực tiếp `tuyensinh.hcmus.edu.vn/2026-thong-bao-ve-phuong-thuc-xet-tuyen-2/`):
    - Xác nhận chính xác: `w1=w3=0.8`, `w2=w4=0.2`. `Điểm học lực = max(w1×THPT + w2×Học bạ, w3×ĐGNL_quy_đổi + w4×Học bạ)` — về mặt toán học tương đương `0.8×max(THPT, ĐGNL_quy_đổi) + 0.2×Học bạ` (vì Học bạ giống nhau ở cả 2 nhánh).
    - Học bạ = tổng điểm TB 3 năm (lớp 10+11+12) của 3 môn thuộc tổ hợp có giá trị LỚN NHẤT trong các tổ hợp ngành đăng ký — rõ ràng, có thể implement nếu biết danh sách tổ hợp từng ngành.
    - **BLOCKER thật (khác UIT/UEL)**: Điểm quy đổi ĐGNL dùng công thức nội suy `A2 + (A1-A2)×(Điểm ĐGNL – X2)/(X1-X2)` dựa trên "khung quy đổi tương đương điểm ĐGNL với điểm THPT 2026" — đây LÀ MỘT BẢNG (các cặp A1/X1/A2/X2 theo mốc điểm), không phải công thức đóng. Chưa trích xuất được bảng này (không thấy trong nội dung text đã fetch, có thể chỉ tồn tại dạng ảnh/PDF riêng) → không thể tính ĐGNL_quy_đổi chính xác, tương tự tình trạng "phương pháp bách phân vị" của UIT.
    - **BLOCKER thứ 2**: Điểm cộng có công thức tỉ lệ (không phải mức trần cố định như HCMUT/UIT/UEL): khi tổng điểm ≥28,5/30, `Điểm cộng = [(30 – Tổng điểm)/1.5] × Điểm cộng cơ sở` — nhưng "Điểm cộng cơ sở" theo từng loại giải/thành tích (vd giải Nhất/Nhì/Ba HSG quốc gia) CHƯA có bảng giá trị cụ thể trong nguồn đã đọc.
    - Điểm ưu tiên: xác nhận công thức giảm dần theo chuẩn quốc gia, có số liệu đầy đủ — khi tổng điểm ≥22,5/30: `Điểm ưu tiên = [(30 – Tổng điểm)/7,5] × Mức điểm ưu tiên KV/ĐT`. Đây LÀ xác nhận rõ ràng cho quy tắc giảm dần mà UEL research KHÔNG tìm thấy (khác trường, không suy ra UEL cũng áp dụng y hệt).
    - Điều kiện riêng ngành: Thiết kế vi mạch/Công nghệ bán dẫn (Toán ≥20% + tổ hợp ≥25% toàn quốc theo phổ điểm), Kỹ thuật hạt nhân (Toán+Lý ≥7,5 THPT hoặc ĐGNL thành phần Toán ≥225).
    - **Điểm chuẩn 2026**: công bố theo TỪNG TỔ HỢP MÔN riêng biệt cho cùng 1 ngành (khác cấu trúc HCMUT/UIT/UEL vốn 1 cutoff/ngành) — thang 30 (21,50–29,32), quy đổi thang 100 (71,67–97,73). Ngành/tổ hợp điểm cao nhất: Chương trình Tiên tiến KHMT (29,32/30).
    - **Kết luận: KHÔNG implement trong batch này.** 2 lý do: (1) thiếu bảng quy đổi ĐGNL và bảng điểm cộng cơ sở — 2 blocker thật giống UIT; (2) cutoff theo (ngành × tổ hợp) cần schema khác `AdmissionCutoff`/`UitCutoff`/`UelCutoff` hiện có (chỉ key theo năm+ngành) — quyết định mở rộng schema này cần cân nhắc riêng, không vội trong batch đang chạy nhanh. Để lại cho phase sau, ưu tiên fetch được bảng quy đổi ĐGNL + bảng điểm cộng cơ sở trước khi code.
- **USSH**: 3 công thức theo đối tượng: ĐHL1 = 45%THPT+45%ĐGNL+10%học bạ; ĐHL2 = 90%THPT+10%học bạ; ĐHL3 = 90%ĐGNL+10%học bạ. Nguồn: `hcmussh.edu.vn` (chính thức). **Thiếu**: bảng điểm cộng/ưu tiên chi tiết — cần đọc thêm trước khi code.
  - **Research bổ sung 2026-08-11** (đọc trực tiếp `hcmussh.edu.vn/bai-viet/cong-bo-thong-tin-tuyen-sinh-nam-2026-cua-truong-dh-khxh-nv-dhqg-hcm` — lưu ý: đây là USSH **ĐHQG-HCM**, không phải USSH ĐHQGHN, hai trường trùng tên viết tắt khác nhau, kết quả tìm kiếm ban đầu có lẫn cả hai, đã lọc kỹ trước khi trích dẫn):
    - Xác nhận lại nguyên văn 3 công thức trên — khớp research trước, không đổi.
    - Điểm cộng: nguồn chỉ liệt kê các LOẠI thành tích được xét ("học tập, hoạt động xã hội, văn hóa, thể dục thể thao, văn nghệ; chứng chỉ ngoại ngữ quốc tế") — **không có mức điểm cụ thể hay cap**, khác hẳn HCMUT/UIT/UEL đã có bảng rõ. Blocker thật.
    - Điểm ưu tiên: nguồn không nêu công thức. Blocker thật.
    - Ngưỡng đảm bảo chất lượng đầu vào: KHÔNG có trong trang thông tin tuyển sinh chính đã đọc. Có tín hiệu qua tìm kiếm tổng hợp (chưa fetch trực tiếp để xác minh) rằng trường công bố ngưỡng riêng ngày 10/7/2026 (THPT+học bạ ≥17, ĐGNL ≥620) — verification mức `cross-checked` không phải `verified`, chưa đủ tin cậy để code, cần fetch lại trang thông báo ngưỡng gốc trước khi dùng.
    - **Điểm chuẩn 2026: CHƯA CÔNG BỐ tại thời điểm research (2026-08-11)** — theo kế hoạch chung Bộ GD&ĐT, trường dự kiến công bố trước 17h ngày 13/8/2026. Đây là ví dụ thật của trạng thái `not-published` (xem `core/admissionHistory.ts`) — không suy đoán/nội suy số liệu 2025 để giả làm 2026.
    - **Kết luận: KHÔNG implement trong batch này.** Không phải vì thiếu công thức chính (đã có, verified), mà vì (1) chưa có bảng điểm cộng/ưu tiên (blocker thật), (2) cutoff năm hiện tại chưa tồn tại để hiển thị — một Explorer không có bảng điểm chuẩn thì giá trị rất thấp. Đề xuất: quay lại sau ngày 13/8/2026 khi trường công bố điểm chuẩn, đồng thời fetch trực tiếp thông báo ngưỡng đầu vào 10/7/2026 để nâng verification lên 'verified'.
- **IU/AGU/UHS**: xem lý do `false` ở cột trên — cần xác minh thêm bằng cách truy cập trực tiếp (site IU chặn crawler tự động; AGU chỉ có số liệu ở nguồn thứ cấp; UHS tự ghi "dự kiến chưa chính thức").

## Phần C — Trường ngoài ĐHQG-HCM dùng ĐGNL 2026

Bối cảnh: 118 trường ĐH/CĐ đăng ký dùng kết quả ĐGNL ĐHQG-HCM 2026 (nguồn: tuoitre.vn dẫn số liệu ĐHQG-HCM). Từ 2026, Thông tư 06/2026/TT-BGDĐT yêu cầu các trường công bố "bảng quy đổi tương đương" điểm ĐGNL sang thang điểm chung.

| Trường | Dùng ĐGNL? | officialSource | calculatorWorthBuilding |
|---|---|---|---|
| **FTU — Ngoại thương** | Có | thongtintuyensinh.ftu.edu.vn/admissions-methods | ✅ **true** — công thức tuyến tính đơn giản, đã xác minh |
| **UEH — Kinh tế TP.HCM** | Có | tuyensinh.ueh.edu.vn | ✅ true (cần lấy thêm bảng mốc nội suy đầy đủ) |
| NEU — Kinh tế Quốc dân | Có | neu.edu.vn (PDF) | ⚠️ chưa chắc — cần đọc PDF đề án gốc |
| HCMUTE — Sư phạm Kỹ thuật TP.HCM | Có | xettuyen.hcmute.edu.vn | ❌ false — trọng số chưa công khai |
| IUH — Công nghiệp TP.HCM | Có | tuyensinh.iuh.edu.vn (PDF, lỗi SSL khi fetch) | ❌ false (tạm thời) |
| PTIT | Có (ngưỡng thuần, theo hướng dẫn chung Bộ GD-ĐT) | — | ❌ false |
| TDTU — Tôn Đức Thắng | Có (phương thức thuần ĐGNL, không tổng hợp) | — | ❌ false |
| Văn Lang | Có (phương thức độc lập, không có công thức chi tiết công khai) | — | ❌ false |

**FTU** — công thức xác nhận: `Điểm quy đổi thang 30 = 27 + (Điểm ĐGNL − 850) × 3/350`, ngưỡng tối thiểu 850/1200, cộng thêm điểm ưu tiên/khuyến khích tối đa 3/30. Nguồn: `thongtintuyensinh.ftu.edu.vn/admissions-methods` (chính thức).

**UEH** — công thức: `Điểm xét tuyển (thang 100) = Điểm thi quy đổi×60% + ĐTB THPT quy đổi×40% + điểm cộng + điểm ưu tiên`; ĐGNL quy đổi bằng nội suy tuyến tính (ví dụ: 950 điểm ĐGNL → 25.55/30). Ngưỡng: 65/100 (UEH TP.HCM) / 60/100 (UEH Mekong). Nguồn: `tuyensinh.ueh.edu.vn` (chính thức).

## Shortlist ưu tiên implement tiếp theo (deliverable bắt buộc)

Xếp theo độ ưu tiên đề xuất (không implement ngay trong phase này — xem lý do bên dưới):

1. **UIT** — trọng số xác nhận từ 2 nguồn độc lập khớp nhau, có cả bảng ngưỡng chứng chỉ quốc tế công khai, dữ liệu đầy đủ nhất.
2. **UEL** — trọng số + bảng ưu tiên KV/ĐT đầy đủ chi tiết (chỉ thiếu bảng quy đổi IELTS/TOEFL phụ trợ).
3. **HCMUS** — công thức đơn giản nhất (0.8/0.2, chọn max giữa THPT/ĐGNL), rủi ro thấp nhất khi implement, phù hợp làm "trường thứ hai" đầu tiên.
4. Dự phòng: **FTU** (ngoài ĐHQG-HCM, công thức tuyến tính rất đơn giản) nếu muốn test kiến trúc multi-school với một trường KHÔNG dùng kiểu "xét tuyển tổng hợp".

**Quyết định phase này: CHƯA implement calculator cho trường thứ hai.** Lý do: phase này đã ưu tiên (a) mở rộng đúng đắn HCMUT cho nhóm không-ĐGNL, (b) dựng kiến trúc school registry/selector, và (c) đảm bảo không phá calculator HCMUT đang chạy production. Thêm một calculator engine mới (dù đã có formula verified trên giấy) đòi hỏi tự viết test + validate kỹ theo đúng tinh thần "KHÔNG expose calculator production nếu formula chưa verify [bằng thực nghiệm]" — ưu tiên correctness hơn tốc độ, nên để dành phase kế tiếp làm cẩn thận cho **HCMUS** (rủi ro thấp nhất, công thức đơn giản nhất trong 3 ứng viên đầu).

## Ghi chú phương pháp

- Một số trang chính thức không fetch được trực tiếp (timeout hoặc chặn crawler): `hcmut.edu.vn` (2 lần timeout — dùng cross-check qua 2 nguồn khác), `hcmiu.edu.vn` (IU, trả về rỗng), một phần `tuyensinh.iuh.edu.vn` (lỗi SSL). Các trường hợp này đều được ghi rõ "formulaVerified = false" hoặc "độ tin cậy trung bình", không tự suy đoán số liệu thay thế.
- Không dùng bất kỳ trang tổng hợp điểm chuẩn không dẫn nguồn hoặc snippet Google không kèm link xác minh được làm nguồn chính cho bất kỳ khẳng định số liệu nào.
