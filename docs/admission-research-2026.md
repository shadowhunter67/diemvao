# Research tuyển sinh 2026 — DiemVao

Research phục vụ quyết định trường/công thức nào đủ điều kiện implement calculator trong DiemVao. Nguyên tắc: **research trước, code sau; không suy đoán công thức; official source luôn ưu tiên cao nhất**. Ngày research: 2026-08-10.

Thứ tự ưu tiên nguồn: (1) website tuyển sinh chính thức của trường → (2) website chính thức trường → (3) website ĐHQG-HCM → (4) đề án tuyển sinh chính thức → (5) thông báo tuyển sinh/điểm chuẩn chính thức → (6) PDF/ảnh từ trường → (7) báo chí uy tín (chỉ cross-check hoặc đọc bảng khó truy cập, không dùng làm nguồn chính duy nhất). Không dùng: blog SEO, forum, Facebook cá nhân, trang tổng hợp không dẫn nguồn, Google snippet không có link xác minh được.

## Phần A — HCMUT: mở rộng nhóm thí sinh

HCMUT 2026 định nghĩa **8 "đối tượng" (2.1–2.8)** trong phương thức Xét tuyển Tổng hợp, gộp thành 5 nhóm UI trong DiemVao:

| Đối tượng HCMUT | Nhóm UI DiemVao | Công thức | Trạng thái |
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

| Trường | Dùng ĐGNL? | Xét không ĐGNL? | Xét tổng hợp? | Trọng số (khi có ĐGNL) | Formula verified | Trạng thái DiemVao |
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

- **UIT**: `Hs1(THPT) 47,5% + Hs2(ĐGNL) 47,5% + Hs3(học bạ) 5%`, thang 100. Điểm cộng ≤10/100 (huy chương Olympic/giải quốc gia). Có ngưỡng SAT≥1170-1200/ACT≥26/IB≥30/A-Level 70% PUM. Ngưỡng riêng ngành Thiết kế vi mạch cao hơn. Nguồn: `tuyensinh.uit.edu.vn` (thông báo ngưỡng chính thức) + Cổng TTĐT Chính phủ (cross-check trọng số, khớp VnExpress).
- **UEL**: `ĐGNL 55% + THPT 35% + Học bạ 10%` (nhóm đủ cả 2 loại điểm); nhóm chỉ 1 loại: 90%/10%. Bảng ưu tiên KV/ĐT đầy đủ trên thang 100 (KV1=9,17/KV2NT=8,33/KV2=7,5/KV3=6,67). Điểm cộng IELTS/TOEFL "theo Phụ lục 2" — chưa đọc được bảng. Có Phương thức 5 riêng cho SAT/ACT/IB/A-Level. Nguồn: `uel.edu.vn` + `tuyensinh.uel.edu.vn` (chính thức).
- **HCMUS**: `0.8×(THPT hoặc ĐGNL, chọn cao hơn) + 0.2×Học bạ`, tính trên thang 30 rồi quy đổi ×100/30 để công bố. Điểm cộng ≤1,5/30. Ưu tiên theo khung chuẩn quốc gia (giống cách HCMUT/DiemVao đã làm). Điều kiện riêng theo ngành (vd Thiết kế vi mạch yêu cầu Toán nhóm 20% cao nhất). Nguồn: `tuyensinh.hcmus.edu.vn` (chính thức, 3 trang khác nhau).
- **USSH**: 3 công thức theo đối tượng: ĐHL1 = 45%THPT+45%ĐGNL+10%học bạ; ĐHL2 = 90%THPT+10%học bạ; ĐHL3 = 90%ĐGNL+10%học bạ. Nguồn: `hcmussh.edu.vn` (chính thức). **Thiếu**: bảng điểm cộng/ưu tiên chi tiết — cần đọc thêm trước khi code.
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
