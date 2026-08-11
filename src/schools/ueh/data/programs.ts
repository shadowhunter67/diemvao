import type { UehProgram } from '../types/programs';

/**
 * 97 chương trình UEH 2026 (82 KSA – TP.HCM, 15 KSV – UEH Mekong/Vĩnh Long), đọc trực tiếp từ
 * bảng HTML (không phải ảnh) trong bài "UEH công bố kết quả xét tuyển Khóa 52..." trên
 * tuyensinh.ueh.edu.vn. LƯU Ý ĐỘ TIN CẬY: trích xuất qua công cụ đọc trang tự động (không phải
 * đọc thủ công/đối chiếu 2 lần độc lập như cách HCMUT/UIT/UEL đọc ảnh gốc) — xem sources.ts,
 * verification 'cross-checked' thay vì 'verified'. Nếu phát hiện sai lệch, ưu tiên đối chiếu lại
 * trực tiếp trang nguồn trước khi sửa.
 */
export const uehPrograms: UehProgram[] = [
  {
    "id": "tieng-anh-thuong-mai",
    "code": "7220201",
    "name": "Tiếng Anh thương mại",
    "campus": "hcmc"
  },
  {
    "id": "kinh-te",
    "code": "7310101",
    "name": "Kinh tế",
    "campus": "hcmc"
  },
  {
    "id": "kinh-te-chinh-tri",
    "code": "731010201",
    "name": "Kinh tế chính trị",
    "campus": "hcmc"
  },
  {
    "id": "kinh-te-chinh-tri-quoc-te",
    "code": "731010202",
    "name": "Kinh tế chính trị quốc tế",
    "campus": "hcmc"
  },
  {
    "id": "kinh-te-dau-tu",
    "code": "731010401",
    "name": "Kinh tế đầu tư",
    "campus": "hcmc"
  },
  {
    "id": "tham-dinh-gia-va-quan-tri-tai-san",
    "code": "731010402",
    "name": "Thẩm định giá và Quản trị tài sản",
    "campus": "hcmc"
  },
  {
    "id": "thong-ke-kinh-doanh",
    "code": "7310107",
    "name": "Thống kê kinh doanh",
    "campus": "hcmc"
  },
  {
    "id": "toan-tai-chinh",
    "code": "731010801",
    "name": "Toán tài chính",
    "campus": "hcmc"
  },
  {
    "id": "phan-tich-rui-ro-va-dinh-phi-bao-hiem",
    "code": "731010802",
    "name": "Phân tích rủi ro và định phí bảo hiểm",
    "campus": "hcmc"
  },
  {
    "id": "truyen-thong-so-va-thiet-ke-da-phuong-tien",
    "code": "732010601",
    "name": "Truyền thông số và thiết kế đa phương tiện",
    "campus": "hcmc"
  },
  {
    "id": "truyen-thong-so-va-thiet-ke-da-phuong-tien-song-bang",
    "code": "73201061D",
    "name": "Truyền thông số và thiết kế đa phương tiện song bằng",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-kinh-doanh",
    "code": "734010101",
    "name": "Quản trị kinh doanh",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-tieng-anh-toan-phan",
    "code": "73401011F",
    "name": "Quản trị – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "kinh-doanh-so",
    "code": "734010102",
    "name": "Kinh doanh số",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-benh-vien",
    "code": "734010103",
    "name": "Quản trị bệnh viện",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-ben-vung-doanh-nghiep-va-moi-truong",
    "code": "734010104",
    "name": "Quản trị bền vững doanh nghiệp và môi trường",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-ben-vung-song-bang-duc",
    "code": "73401014D",
    "name": "Quản trị bền vững song bằng Đức",
    "campus": "hcmc"
  },
  {
    "id": "marketing",
    "code": "734011501",
    "name": "Marketing",
    "campus": "hcmc"
  },
  {
    "id": "marketing-tieng-anh-toan-phan",
    "code": "73401151F",
    "name": "Marketing – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "cong-nghe-marketing",
    "code": "734011502",
    "name": "Công nghệ Marketing",
    "campus": "hcmc"
  },
  {
    "id": "bat-dong-san",
    "code": "7340116",
    "name": "Bất động sản",
    "campus": "hcmc"
  },
  {
    "id": "kinh-doanh-quoc-te",
    "code": "734012001",
    "name": "Kinh doanh quốc tế",
    "campus": "hcmc"
  },
  {
    "id": "kinh-doanh-quoc-te-tieng-anh-toan-phan",
    "code": "73401201F",
    "name": "Kinh doanh quốc tế – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "kinh-doanh-thuong-mai",
    "code": "734012101",
    "name": "Kinh doanh thương mại",
    "campus": "hcmc"
  },
  {
    "id": "kinh-doanh-thuong-mai-tieng-anh-toan-phan",
    "code": "73401211F",
    "name": "Kinh doanh thương mại – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "thuong-mai-dien-tu",
    "code": "7340122",
    "name": "Thương mại điện tử",
    "campus": "hcmc"
  },
  {
    "id": "tai-chinh-cong",
    "code": "734020101",
    "name": "Tài chính công",
    "campus": "hcmc"
  },
  {
    "id": "thue",
    "code": "734020102",
    "name": "Thuế",
    "campus": "hcmc"
  },
  {
    "id": "ngan-hang",
    "code": "734020103",
    "name": "Ngân hàng",
    "campus": "hcmc"
  },
  {
    "id": "ngan-hang-tieng-anh-toan-phan",
    "code": "73402013F",
    "name": "Ngân hàng – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "thi-truong-chung-khoan",
    "code": "734020104",
    "name": "Thị trường chứng khoán",
    "campus": "hcmc"
  },
  {
    "id": "tai-chinh",
    "code": "734020105",
    "name": "Tài chính",
    "campus": "hcmc"
  },
  {
    "id": "tai-chinh-tieng-anh-toan-phan",
    "code": "73402015F",
    "name": "Tài chính – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "dau-tu-tai-chinh",
    "code": "734020106",
    "name": "Đầu tư tài chính",
    "campus": "hcmc"
  },
  {
    "id": "dau-tu-tai-chinh-tieng-anh-toan-phan",
    "code": "73402016F",
    "name": "Đầu tư tài chính – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-hai-quan-ngoai-thuong",
    "code": "734020107",
    "name": "Quản trị Hải quan – Ngoại thương",
    "campus": "hcmc"
  },
  {
    "id": "tai-chinh-ngan-hang-song-bang-phap",
    "code": "73402010D",
    "name": "Tài chính – Ngân hàng song bằng Pháp",
    "campus": "hcmc"
  },
  {
    "id": "bao-hiem",
    "code": "7340204",
    "name": "Bảo hiểm",
    "campus": "hcmc"
  },
  {
    "id": "cong-nghe-tai-chinh",
    "code": "7340205",
    "name": "Công nghệ tài chính",
    "campus": "hcmc"
  },
  {
    "id": "tai-chinh-quoc-te",
    "code": "734020601",
    "name": "Tài chính quốc tế",
    "campus": "hcmc"
  },
  {
    "id": "tai-chinh-quoc-te-tieng-anh-toan-phan",
    "code": "73402061F",
    "name": "Tài chính quốc tế – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "ke-toan-doanh-nghiep",
    "code": "734030101",
    "name": "Kế toán doanh nghiệp",
    "campus": "hcmc"
  },
  {
    "id": "ke-toan-doanh-nghiep-tieng-anh-toan-phan",
    "code": "73403011F",
    "name": "Kế toán doanh nghiệp – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "ke-toan-cong",
    "code": "734030102",
    "name": "Kế toán công",
    "campus": "hcmc"
  },
  {
    "id": "ke-toan-tich-hop-icaew",
    "code": "734030103",
    "name": "Kế toán tích hợp ICAEW",
    "campus": "hcmc"
  },
  {
    "id": "ke-toan-tich-hop-acca",
    "code": "734030104",
    "name": "Kế toán tích hợp ACCA",
    "campus": "hcmc"
  },
  {
    "id": "kiem-toan",
    "code": "734030201",
    "name": "Kiểm toán",
    "campus": "hcmc"
  },
  {
    "id": "kiem-toan-tieng-anh-toan-phan",
    "code": "73403021F",
    "name": "Kiểm toán – Tiếng Anh toàn phần",
    "campus": "hcmc"
  },
  {
    "id": "quan-ly-cong",
    "code": "7340403",
    "name": "Quản lý công",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-nhan-luc",
    "code": "7340404",
    "name": "Quản trị nhân lực",
    "campus": "hcmc"
  },
  {
    "id": "he-thong-thong-tin-quan-ly",
    "code": "7340405",
    "name": "Hệ thống thông tin quản lý",
    "campus": "hcmc"
  },
  {
    "id": "luat-kinh-doanh-quoc-te",
    "code": "738010101",
    "name": "Luật kinh doanh quốc tế",
    "campus": "hcmc"
  },
  {
    "id": "luat",
    "code": "738010102",
    "name": "Luật",
    "campus": "hcmc"
  },
  {
    "id": "luat-kinh-te",
    "code": "7380107",
    "name": "Luật kinh tế",
    "campus": "hcmc"
  },
  {
    "id": "luat-thuong-mai-quoc-te",
    "code": "7380109",
    "name": "Luật thương mại quốc tế",
    "campus": "hcmc"
  },
  {
    "id": "khoa-hoc-du-lieu",
    "code": "746010801",
    "name": "Khoa học dữ liệu",
    "campus": "hcmc"
  },
  {
    "id": "phan-tich-du-lieu",
    "code": "746010802",
    "name": "Phân tích dữ liệu",
    "campus": "hcmc"
  },
  {
    "id": "khoa-hoc-may-tinh",
    "code": "7480101",
    "name": "Khoa học máy tính",
    "campus": "hcmc"
  },
  {
    "id": "ky-thuat-phan-mem",
    "code": "7480103",
    "name": "Kỹ thuật phần mềm",
    "campus": "hcmc"
  },
  {
    "id": "robot-va-tri-tue-nhan-tao",
    "code": "748010701",
    "name": "Robot và Trí tuệ nhân tạo",
    "campus": "hcmc"
  },
  {
    "id": "robot-va-tri-tue-nhan-tao-song-bang-han",
    "code": "74801071D",
    "name": "Robot và Trí tuệ nhân tạo song bằng Hàn",
    "campus": "hcmc"
  },
  {
    "id": "dieu-khien-thong-minh-va-tu-dong-hoa",
    "code": "748010702",
    "name": "Điều khiển thông minh và tự động hóa",
    "campus": "hcmc"
  },
  {
    "id": "dieu-khien-thong-minh-song-bang-han",
    "code": "74801072D",
    "name": "Điều khiển thông minh song bằng Hàn",
    "campus": "hcmc"
  },
  {
    "id": "cong-nghe-thong-tin",
    "code": "748020101",
    "name": "Công nghệ thông tin",
    "campus": "hcmc"
  },
  {
    "id": "cong-nghe-nghe-thuat",
    "code": "748020102",
    "name": "Công nghệ nghệ thuật",
    "campus": "hcmc"
  },
  {
    "id": "cong-nghe-va-doi-moi-sang-tao",
    "code": "748020103",
    "name": "Công nghệ và đổi mới sáng tạo",
    "campus": "hcmc"
  },
  {
    "id": "an-toan-thong-tin",
    "code": "7480202",
    "name": "An toàn thông tin",
    "campus": "hcmc"
  },
  {
    "id": "san-xuat-thong-minh",
    "code": "7510201",
    "name": "Sản xuất thông minh",
    "campus": "hcmc"
  },
  {
    "id": "logistics-va-quan-ly-chuoi-cung-ung",
    "code": "751060501",
    "name": "Logistics và Quản lý chuỗi cung ứng",
    "campus": "hcmc"
  },
  {
    "id": "logistics-va-quan-ly-chuoi-cung-ung-tieng-anh",
    "code": "75106051F",
    "name": "Logistics và Quản lý chuỗi cung ứng – Tiếng Anh",
    "campus": "hcmc"
  },
  {
    "id": "cong-nghe-logistics",
    "code": "751060502",
    "name": "Công nghệ Logistics",
    "campus": "hcmc"
  },
  {
    "id": "cong-nghe-logistics-fiata-tieng-anh",
    "code": "75106052F",
    "name": "Công nghệ Logistics FIATA – Tiếng Anh",
    "campus": "hcmc"
  },
  {
    "id": "kien-truc-song-bang-new-zealand",
    "code": "7580104SD",
    "name": "Kiến trúc song bằng New Zealand",
    "campus": "hcmc"
  },
  {
    "id": "kien-truc-va-thiet-ke-do-thi-thong-minh",
    "code": "758010402",
    "name": "Kiến trúc và Thiết kế đô thị thông minh",
    "campus": "hcmc"
  },
  {
    "id": "kinh-doanh-nong-nghiep",
    "code": "7620114",
    "name": "Kinh doanh nông nghiệp",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-dich-vu-du-lich-va-lu-hanh",
    "code": "7810103",
    "name": "Quản trị dịch vụ du lịch và lữ hành",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-khach-san",
    "code": "781020101",
    "name": "Quản trị khách sạn",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-su-kien-va-dich-vu-giai-tri",
    "code": "781020102",
    "name": "Quản trị sự kiện và dịch vụ giải trí",
    "campus": "hcmc"
  },
  {
    "id": "quan-tri-van-hanh-va-di-chuyen-thong-minh",
    "code": "7840104",
    "name": "Quản trị vận hành và di chuyển thông minh",
    "campus": "hcmc"
  },
  {
    "id": "chuong-trinh-cu-nhan-asia-co-op",
    "code": "ASACoop01",
    "name": "Chương trình Cử nhân ASIA Co-op",
    "campus": "hcmc"
  },
  {
    "id": "chuong-trinh-cu-nhan-tai-nang-isb-kinh-doanh",
    "code": "ISBCNTN01",
    "name": "Chương trình Cử nhân tài năng ISB – Kinh doanh",
    "campus": "hcmc"
  },
  {
    "id": "chuong-trinh-cu-nhan-tai-nang-isb-cong-nghe",
    "code": "ISBCNTN02",
    "name": "Chương trình Cử nhân tài năng ISB – Công nghệ",
    "campus": "hcmc"
  },
  {
    "id": "tieng-anh-thuong-mai-mekong",
    "code": "7220201",
    "name": "Tiếng Anh thương mại",
    "campus": "mekong"
  },
  {
    "id": "quan-tri-kinh-doanh-mekong",
    "code": "7340101",
    "name": "Quản trị kinh doanh",
    "campus": "mekong"
  },
  {
    "id": "marketing-mekong",
    "code": "7340115",
    "name": "Marketing",
    "campus": "mekong"
  },
  {
    "id": "kinh-doanh-quoc-te-mekong",
    "code": "7340120",
    "name": "Kinh doanh quốc tế",
    "campus": "mekong"
  },
  {
    "id": "thuong-mai-dien-tu-mekong",
    "code": "7340122",
    "name": "Thương mại điện tử",
    "campus": "mekong"
  },
  {
    "id": "ngan-hang-mekong",
    "code": "734020101",
    "name": "Ngân hàng",
    "campus": "mekong"
  },
  {
    "id": "tai-chinh-mekong",
    "code": "734020102",
    "name": "Tài chính",
    "campus": "mekong"
  },
  {
    "id": "thue-mekong",
    "code": "734020103",
    "name": "Thuế",
    "campus": "mekong"
  },
  {
    "id": "ke-toan-doanh-nghiep-mekong",
    "code": "7340301",
    "name": "Kế toán doanh nghiệp",
    "campus": "mekong"
  },
  {
    "id": "luat-kinh-te-mekong",
    "code": "7380107",
    "name": "Luật kinh tế",
    "campus": "mekong"
  },
  {
    "id": "robot-va-tri-tue-nhan-tao-he-ky-su-mekong",
    "code": "7480107",
    "name": "Robot và Trí tuệ nhân tạo (hệ kỹ sư)",
    "campus": "mekong"
  },
  {
    "id": "cong-nghe-va-doi-moi-sang-tao-mekong",
    "code": "7480201",
    "name": "Công nghệ và Đổi mới sáng tạo",
    "campus": "mekong"
  },
  {
    "id": "logistics-va-quan-ly-chuoi-cung-ung-mekong",
    "code": "7510605",
    "name": "Logistics và Quản lý chuỗi cung ứng",
    "campus": "mekong"
  },
  {
    "id": "kinh-doanh-nong-nghiep-mekong",
    "code": "7620114",
    "name": "Kinh doanh nông nghiệp",
    "campus": "mekong"
  },
  {
    "id": "quan-tri-khach-san-mekong",
    "code": "7810201",
    "name": "Quản trị khách sạn",
    "campus": "mekong"
  }
];
