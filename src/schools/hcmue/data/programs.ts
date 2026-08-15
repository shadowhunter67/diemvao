export interface HcmueProgramThreshold {
  id: string;
  code: string;
  name: string;
  campus: 'hcmc';
  group: 'teacher-training' | 'other';
  thptThreshold30: number;
  dgnlcbThreshold30: number;
}

export const hcmueProgramThresholds: HcmueProgramThreshold[] = [
  { id: 'hcmue-7140201', code: '7140201', name: 'Giao duc Mam non', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 21, dgnlcbThreshold30: 19 },
  { id: 'hcmue-7140202', code: '7140202', name: 'Giao duc Tieu hoc', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 21, dgnlcbThreshold30: 19 },
  { id: 'hcmue-7140202SN', code: '7140202SN', name: 'Giao duc Tieu hoc song ngu', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 21, dgnlcbThreshold30: 19 },
  { id: 'hcmue-7140203', code: '7140203', name: 'Giao duc Dac biet', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7140204', code: '7140204', name: 'Giao duc Cong dan', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7140205', code: '7140205', name: 'Giao duc Chinh tri', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7140206', code: '7140206', name: 'Giao duc The chat', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 19, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7140208', code: '7140208', name: 'Giao duc Quoc phong - An ninh', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7140209', code: '7140209', name: 'Su pham Toan hoc', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 24, dgnlcbThreshold30: 22 },
  { id: 'hcmue-7140210', code: '7140210', name: 'Su pham Tin hoc', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7140211', code: '7140211', name: 'Su pham Vat ly', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 24, dgnlcbThreshold30: 22 },
  { id: 'hcmue-7140212', code: '7140212', name: 'Su pham Hoa hoc', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 24, dgnlcbThreshold30: 22 },
  { id: 'hcmue-7140213', code: '7140213', name: 'Su pham Sinh hoc', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7140217', code: '7140217', name: 'Su pham Ngu van', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 24, dgnlcbThreshold30: 22 },
  { id: 'hcmue-7140218', code: '7140218', name: 'Su pham Lich su', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 24, dgnlcbThreshold30: 22 },
  { id: 'hcmue-7140219', code: '7140219', name: 'Su pham Dia ly', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 24, dgnlcbThreshold30: 22 },
  { id: 'hcmue-7140231', code: '7140231', name: 'Su pham Tieng Anh', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 23, dgnlcbThreshold30: 21 },
  { id: 'hcmue-7140232', code: '7140232', name: 'Su pham Tieng Nga', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7140233', code: '7140233', name: 'Su pham Tieng Phap', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7140234', code: '7140234', name: 'Su pham Tieng Trung Quoc', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7140246', code: '7140246', name: 'Su pham Cong nghe', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7140247', code: '7140247', name: 'Su pham Khoa hoc tu nhien', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 21, dgnlcbThreshold30: 19 },
  { id: 'hcmue-7140249', code: '7140249', name: 'Su pham Lich su - Dia ly', campus: 'hcmc', group: 'teacher-training', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7140101', code: '7140101', name: 'Giao duc hoc', campus: 'hcmc', group: 'other', thptThreshold30: 19, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7140103', code: '7140103', name: 'Cong nghe giao duc', campus: 'hcmc', group: 'other', thptThreshold30: 18, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7140114', code: '7140114', name: 'Quan ly giao duc', campus: 'hcmc', group: 'other', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7220201', code: '7220201', name: 'Ngon ngu Anh', campus: 'hcmc', group: 'other', thptThreshold30: 21, dgnlcbThreshold30: 19 },
  { id: 'hcmue-7220202', code: '7220202', name: 'Ngon ngu Nga', campus: 'hcmc', group: 'other', thptThreshold30: 17, dgnlcbThreshold30: 16 },
  { id: 'hcmue-7220203', code: '7220203', name: 'Ngon ngu Phap', campus: 'hcmc', group: 'other', thptThreshold30: 18, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7220204', code: '7220204', name: 'Ngon ngu Trung Quoc', campus: 'hcmc', group: 'other', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7220209', code: '7220209', name: 'Ngon ngu Nhat', campus: 'hcmc', group: 'other', thptThreshold30: 19, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7220210', code: '7220210', name: 'Ngon ngu Han Quoc', campus: 'hcmc', group: 'other', thptThreshold30: 19, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7229030', code: '7229030', name: 'Van hoc', campus: 'hcmc', group: 'other', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7310401', code: '7310401', name: 'Tam ly hoc', campus: 'hcmc', group: 'other', thptThreshold30: 23, dgnlcbThreshold30: 21 },
  { id: 'hcmue-7310403', code: '7310403', name: 'Tam ly hoc giao duc', campus: 'hcmc', group: 'other', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7310501', code: '7310501', name: 'Dia ly hoc', campus: 'hcmc', group: 'other', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7310601', code: '7310601', name: 'Quoc te hoc', campus: 'hcmc', group: 'other', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7310630', code: '7310630', name: 'Viet Nam hoc', campus: 'hcmc', group: 'other', thptThreshold30: 21, dgnlcbThreshold30: 19 },
  { id: 'hcmue-7420203', code: '7420203', name: 'Sinh hoc ung dung', campus: 'hcmc', group: 'other', thptThreshold30: 18, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7440102', code: '7440102', name: 'Vat ly hoc', campus: 'hcmc', group: 'other', thptThreshold30: 19, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7440112', code: '7440112', name: 'Hoa hoc', campus: 'hcmc', group: 'other', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7460112', code: '7460112', name: 'Toan ung dung', campus: 'hcmc', group: 'other', thptThreshold30: 22, dgnlcbThreshold30: 20 },
  { id: 'hcmue-7480201', code: '7480201', name: 'Cong nghe thong tin', campus: 'hcmc', group: 'other', thptThreshold30: 18, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7760101', code: '7760101', name: 'Cong tac xa hoi', campus: 'hcmc', group: 'other', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7810101', code: '7810101', name: 'Du lich', campus: 'hcmc', group: 'other', thptThreshold30: 20, dgnlcbThreshold30: 18 },
  { id: 'hcmue-7310201', code: '7310201', name: 'Chinh tri hoc', campus: 'hcmc', group: 'other', thptThreshold30: 19, dgnlcbThreshold30: 17 },
  { id: 'hcmue-7760103', code: '7760103', name: 'Ho tro Giao duc nguoi khuyet tat', campus: 'hcmc', group: 'other', thptThreshold30: 19, dgnlcbThreshold30: 17 },
];
