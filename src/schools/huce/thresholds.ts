export type HuceCampus = 'hanoi' | 'hcm';
export type HuceMethodId = 'huce-thpt-exam-2026' | 'huce-transcript-2026' | 'huce-tsa-2026' | 'huce-spt-2026' | 'huce-vsat-2026';

export interface HuceProgramThreshold {
  programId: string;
  programCode: string;
  campus: HuceCampus;
  name: string;
  thptMin30?: number;
  transcriptMin30?: number;
  tsaMin100?: number;
  sptMin30?: number;
  vsatMin450?: number;
  sourceId: 'huce-threshold-conversion-2026';
  page: number;
  imageDerived: true;
}

function row(params: Omit<HuceProgramThreshold, 'sourceId' | 'imageDerived'>): HuceProgramThreshold {
  return { ...params, sourceId: 'huce-threshold-conversion-2026', imageDerived: true };
}

const hanoi = (programCode: string, name: string, thptMin30: number, page: number, extras?: Partial<HuceProgramThreshold>) =>
  row({ programId: `hanoi-${programCode}`, programCode, campus: 'hanoi', name, thptMin30, page, ...extras });
const hcm = (programCode: string, name: string, thptMin30: number, extras?: Partial<HuceProgramThreshold>) =>
  row({ programId: `hcm-${programCode}`, programCode, campus: 'hcm', name, thptMin30, page: 4, ...extras });

const t17 = { transcriptMin30: 22.5, tsaMin100: 41.39, sptMin30: 11.29, vsatMin450: 243.58 };
const t18 = { transcriptMin30: 22.93, tsaMin100: 43.07, sptMin30: 12.24, vsatMin450: 257.2 };
const t20 = { transcriptMin30: 23.79, tsaMin100: 46.42, sptMin30: 14.26, vsatMin450: 288.16 };
const t22 = { transcriptMin30: 24.9, tsaMin100: 50.3, sptMin30: 16.28, vsatMin450: 321.64 };
const hcm16 = { transcriptMin30: 22, tsaMin100: 39.63, sptMin30: 10.44, vsatMin450: 230.27 };

export const HUCE_PROGRAM_THRESHOLDS_2026: readonly HuceProgramThreshold[] = [
  hanoi('XDA01', 'Kien truc', 20, 2),
  hanoi('XDA02', 'Kien truc / Kien truc cong nghe', 20, 2),
  hanoi('XDA03', 'Kien truc canh quan', 18, 2),
  hanoi('XDA04', 'Kien truc noi that', 20, 2),
  hanoi('XDA05', 'Quy hoach vung va do thi', 18, 2),
  hanoi('XDA06', 'My thuat do thi', 20, 2),
  hanoi('XDA07', 'Ky thuat xay dung', 18, 2, t18),
  hanoi('XDA08', 'Ky thuat xay dung / Xay dung dan dung va cong nghiep', 20, 2, t20),
  hanoi('XDA09', 'Ky thuat xay dung / He thong ky thuat trong cong trinh', 18, 2, t18),
  hanoi('XDA10', 'Ky thuat xay dung / Tin hoc xay dung', 20, 2, t20),
  hanoi('XDA11', 'Ky thuat xay dung / Ky thuat cong trinh bien', 17, 2, t17),
  hanoi('XDA12', 'Ky thuat xay dung cong trinh thuy', 17, 2, t17),
  hanoi('XDA13', 'Ky thuat xay dung cong trinh Giao thong / Xay dung Cau duong', 18, 2, t18),
  hanoi('XDA14', 'Ky thuat xay dung cong trinh giao thong / Duong sat toc do cao va duong sat do thi', 18, 2, t18),
  hanoi('XDA15', 'Ky thuat Cap thoat nuoc / Ky thuat nuoc - Moi truong nuoc', 17, 2, t17),
  hanoi('XDA16', 'Kinh te xay dung', 20, 2, t20),
  hanoi('XDA17', 'Quan ly xay dung / Kinh te va quan ly do thi', 20, 2, t20),
  hanoi('XDA18', 'Quan ly xay dung / Kinh te va quan ly bat dong san', 20, 2, t20),
  hanoi('XDA19', 'Quan ly xay dung / Quan ly ha tang, dat dai do thi', 18, 2, t18),
  hanoi('XDA20', 'Quan ly xay dung / Kiem toan dau tu xay dung', 18, 2, t18),
  hanoi('XDA21', 'Cong nghe ky thuat xay dung', 18, 2, t18),
  hanoi('XDA22', 'Cong nghe ky thuat vat lieu xay dung', 17, 2, t17),
  hanoi('XDA23', 'Logistics va Quan ly chuoi cung ung', 22, 3, t22),
  hanoi('XDA24', 'Logistics va Quan ly chuoi cung ung / Logistics do thi', 20, 3, t20),
  hanoi('XDA25', 'Logistics va Quan ly chuoi cung ung / Logistics cong nghiep', 20, 3, t20),
  hanoi('XDA26', 'Cong nghe thong tin', 20, 3, t20),
  hanoi('XDA27', 'Cong nghe thong tin / Cong nghe da phuong tien', 20, 3, t20),
  hanoi('XDA28', 'Cong nghe thong tin / An toan thong tin', 20, 3, t20),
  hanoi('XDA29', 'Khoa hoc may tinh', 20, 3, t20),
  hanoi('XDA30', 'Khoa hoc du lieu', 20, 3, t20),
  hanoi('XDA31', 'Ky thuat co khi', 20, 3, t20),
  hanoi('XDA32', 'Ky thuat co khi / May xay dung', 18, 3, t18),
  hanoi('XDA33', 'Ky thuat co khi / Ky thuat co dien', 20, 3, t20),
  hanoi('XDA34', 'Ky thuat co khi / Ky thuat o to', 20, 3, t20),
  hanoi('XDA35', 'Ky thuat co dien tu', 20, 3, t20),
  hanoi('XDA36', 'Ky thuat dien', 20, 3, t20),
  hanoi('XDA37', 'Ky thuat dieu khien va tu dong hoa', 22, 3, t22),
  hanoi('XDA38', 'Ky thuat vat lieu', 17, 3, t17),
  hanoi('XDA39', 'Ky thuat Moi truong', 18, 3, t18),
  hanoi('XDA40', 'Quan ly du an', 20, 3, t20),
  hanoi('XDA41', 'CTDT Nghe thuat va thiet ke', 20, 3),
  hanoi('XDA42', 'Ky thuat xay dung (Chuong trinh dao tao Ky su chat luong cao - PFIEV)', 18, 3, t18),
  hanoi('XDA43', 'Ky thuat xay dung (Chuong trinh chuan dau ra tieng Anh, hop tac voi Dai hoc Mississippi, Hoa Ky)', 18, 3, t18),
  hanoi('XDA44', 'Khoa hoc May tinh (Chuong trinh chuan dau ra tieng Anh, hop tac voi Dai hoc Mississippi, Hoa Ky)', 18, 3, t18),
  hcm('XDA01', 'Kien truc', 17),
  hcm('XDA04', 'Kien truc noi that', 17),
  hcm('XDA08', 'Ky thuat xay dung / Xay dung dan dung va cong nghiep', 17, t17),
  hcm('XDA13', 'Ky thuat xay dung cong trinh Giao thong / Xay dung Cau duong', 16, hcm16),
  hcm('XDA15', 'Ky thuat Cap thoat nuoc / Ky thuat nuoc - Moi truong nuoc', 16, hcm16),
  hcm('XDA16', 'Kinh te xay dung', 17, t17),
  hcm('XDA23', 'Logistics va Quan ly chuoi cung ung', 17, t17),
];

export function getHuceProgramThreshold(programId?: string): HuceProgramThreshold | undefined {
  return HUCE_PROGRAM_THRESHOLDS_2026.find((program) => program.programId === programId);
}
