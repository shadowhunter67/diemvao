export interface HcmusProgramThreshold {
  id: string;
  code: string;
  name: string;
  quota2026: number;
  minimumCompositeScore: {
    scale30: number;
    scale100: number;
  };
  sourceId: 'hcmus-threshold-method2-2026';
}

/**
 * HCMUS 2026 Phuong thuc 2: manually transcribed from the official infographic
 * "NGUONG DAM BAO CHAT LUONG - PHUONG THUC XET TUYEN TONG HOP NAM 2026".
 * These are minimum composite-score registration thresholds, not admission cutoffs.
 */
export const hcmusProgramThresholds: HcmusProgramThreshold[] = [
  { id: 'hcmus-7420101', code: '7420101', name: 'Sinh học', quota2026: 215, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7420101KD', code: '7420101KD', name: 'Sinh học (CT TCTA)', quota2026: 90, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7420201', code: '7420201', name: 'Công nghệ Sinh học', quota2026: 200, minimumCompositeScore: { scale30: 19, scale100: 63.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7420201KD', code: '7420201KD', name: 'Công nghệ Sinh học (CT TCTA)', quota2026: 160, minimumCompositeScore: { scale30: 19, scale100: 63.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440102KD', code: '7440102KD', name: 'Vật lý học (CT TCTA)', quota2026: 140, minimumCompositeScore: { scale30: 20, scale100: 66.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440102NN', code: '7440102NN', name: 'Nhóm ngành Vật lý học (CT:145), Công nghệ Vật lý điện tử và tin học (CT:70)', quota2026: 215, minimumCompositeScore: { scale30: 22, scale100: 73.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440107KD', code: '7440107KD', name: 'Công nghệ Vật lý điện tử và tin học (CT TCTA)', quota2026: 60, minimumCompositeScore: { scale30: 20, scale100: 66.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-74401a1', code: '74401a1', name: 'Công nghệ bán dẫn', quota2026: 70, minimumCompositeScore: { scale30: 24, scale100: 80 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440112', code: '7440112', name: 'Hóa học', quota2026: 230, minimumCompositeScore: { scale30: 18.5, scale100: 61.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440112KD', code: '7440112KD', name: 'Hóa học (CT TCTA)', quota2026: 150, minimumCompositeScore: { scale30: 18.5, scale100: 61.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440122', code: '7440122', name: 'Khoa học Vật liệu', quota2026: 148, minimumCompositeScore: { scale30: 17.5, scale100: 58.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440122KD', code: '7440122KD', name: 'Khoa học Vật liệu (CT TCTA)', quota2026: 80, minimumCompositeScore: { scale30: 17.5, scale100: 58.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440201NN', code: '7440201NN', name: 'Nhóm ngành Địa chất học (CT:44), Kinh tế đất đai (CT:60)', quota2026: 104, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440228', code: '7440228', name: 'Hải dương học', quota2026: 30, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440228KD', code: '7440228KD', name: 'Hải dương học (CT TCTA)', quota2026: 30, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440301', code: '7440301', name: 'Khoa học Môi trường', quota2026: 130, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7440301KD', code: '7440301KD', name: 'Khoa học Môi trường (CT TCTA)', quota2026: 80, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7460101NN', code: '7460101NN', name: 'Nhóm ngành Toán học (Toán học, Toán ứng dụng, Toán tin)', quota2026: 180, minimumCompositeScore: { scale30: 21, scale100: 70 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7460112KD', code: '7460112KD', name: 'Toán ứng dụng (CT TCTA)', quota2026: 40, minimumCompositeScore: { scale30: 21, scale100: 70 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7460117KD', code: '7460117KD', name: 'Toán tin (CT TCTA)', quota2026: 40, minimumCompositeScore: { scale30: 21, scale100: 70 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7460108NN', code: '7460108NN', name: 'Nhóm ngành Khoa học dữ liệu (CT:40), Thống kê (CT:40)', quota2026: 80, minimumCompositeScore: { scale30: 22, scale100: 73.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7460108KD', code: '7460108KD', name: 'Khoa học dữ liệu (CT TCTA)', quota2026: 60, minimumCompositeScore: { scale30: 22, scale100: 73.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7480101TT', code: '7480101TT', name: 'Khoa học máy tính (CT Tiên tiến)', quota2026: 90, minimumCompositeScore: { scale30: 24, scale100: 80 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7480107', code: '7480107', name: 'Trí tuệ nhân tạo', quota2026: 90, minimumCompositeScore: { scale30: 24, scale100: 80 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7480201KD', code: '7480201KD', name: 'Công nghệ thông tin (CT TCTA)', quota2026: 530, minimumCompositeScore: { scale30: 22, scale100: 73.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7480201NN', code: '7480201NN', name: 'Nhóm ngành máy tính và Công nghệ thông tin (Công nghệ thông tin; Kỹ thuật phần mềm; Hệ thống thông tin; Khoa học máy tính)', quota2026: 490, minimumCompositeScore: { scale30: 22, scale100: 73.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7510401KD', code: '7510401KD', name: 'Công nghệ Kỹ thuật Hóa học (CT TCTA)', quota2026: 150, minimumCompositeScore: { scale30: 18.5, scale100: 61.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7510402', code: '7510402', name: 'Công nghệ Vật liệu', quota2026: 147, minimumCompositeScore: { scale30: 17.5, scale100: 58.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7510402KD', code: '7510402KD', name: 'Công nghệ Vật liệu (CT TCTA)', quota2026: 60, minimumCompositeScore: { scale30: 17.5, scale100: 58.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7510406', code: '7510406', name: 'Công nghệ Kỹ thuật Môi trường', quota2026: 120, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7520207', code: '7520207', name: 'Kỹ thuật điện tử - viễn thông', quota2026: 150, minimumCompositeScore: { scale30: 21, scale100: 70 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-75202a1', code: '75202a1', name: 'Thiết kế vi mạch', quota2026: 80, minimumCompositeScore: { scale30: 24, scale100: 80 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7520207KD', code: '7520207KD', name: 'Kỹ thuật điện tử - viễn thông (CT TCTA)', quota2026: 120, minimumCompositeScore: { scale30: 21, scale100: 70 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7520402', code: '7520402', name: 'Kỹ thuật hạt nhân', quota2026: 55, minimumCompositeScore: { scale30: 22, scale100: 73.3 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7520403', code: '7520403', name: 'Vật lý y khoa', quota2026: 35, minimumCompositeScore: { scale30: 20, scale100: 66.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7520403KD', code: '7520403KD', name: 'Vật lý y khoa (CT TCTA)', quota2026: 30, minimumCompositeScore: { scale30: 20, scale100: 66.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7520501', code: '7520501', name: 'Kỹ thuật địa chất', quota2026: 38, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7850101', code: '7850101', name: 'Quản lý tài nguyên và môi trường', quota2026: 109, minimumCompositeScore: { scale30: 17, scale100: 56.7 }, sourceId: 'hcmus-threshold-method2-2026' },
  { id: 'hcmus-7140103', code: '7140103', name: 'Công nghệ giáo dục', quota2026: 100, minimumCompositeScore: { scale30: 18, scale100: 60 }, sourceId: 'hcmus-threshold-method2-2026' },
];

export function findHcmusProgramThreshold(programId: string | undefined): HcmusProgramThreshold | undefined {
  if (!programId) return undefined;
  return hcmusProgramThresholds.find((program) => program.id === programId || program.code === programId);
}
