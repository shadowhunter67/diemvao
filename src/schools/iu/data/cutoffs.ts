import type { IuCutoff } from '../types/programs';

const SOURCE = {
  sourceLabel: 'THÔNG BÁO Mức điểm trúng tuyển theo phương thức Xét tuyển tổng hợp năm 2026 (Phương thức 2) — HCMIU',
  sourceUrl:
    'https://tuyensinh.hcmiu.edu.vn/tuyen-sinh/thong-bao-muc-diem-trung-tuyen-vao-cac-nganh-theo-phuong-thuc-xet-tuyen-tong-hop-nam-2026-phuong-thuc-2/',
  publishedAt: '2026-08-10',
  accessedAt: '2026-08-14',
  sourceType: 'official-school' as const,
};

/** Điểm trúng tuyển (KHÔNG phải ngưỡng đầu vào) 2026 Phương thức 2, thang 100, đã bao gồm điểm
 * cộng + điểm ưu tiên — transcribe thủ công từ thông báo chính thức, đọc qua trình duyệt thật. */
export const iuCutoffs2026: IuCutoff[] = [
  { year: 2026, programId: 'iu-7220201', score: 73, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7310101', score: 62, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340101', score: 53, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340115', score: 53, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340122', score: 53, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340201', score: 53, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340301', score: 53, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7420201', score: 55, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7440112', score: 58, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7460108', score: 62, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7460112', score: 52, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7460201', score: 52, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7480101', score: 65, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7480201', score: 62, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7510605', score: 72, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7520118', score: 63, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7520121', score: 52, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7520207', score: 55, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7520212', score: 68, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7520216', score: 65, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7520301', score: 58, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7540101', score: 52, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7580201', score: 50, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7580302', score: 50, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7220201W3', score: 65, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7220201W4', score: 65, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340101AD', score: 52, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340101MQ', score: 54, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340101SY', score: 65, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340101W2', score: 52, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340101W4', score: 52, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340201MQ', score: 53, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7340301MQ', score: 53, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7420201W2', score: 62, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7420201W4', score: 70, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7480201DK', score: 60, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7480201MQ', score: 60, scoreScale: 100, ...SOURCE },
  { year: 2026, programId: 'iu-7480201W4', score: 60, scoreScale: 100, ...SOURCE },
];

export function findIuCutoff(programId: string | undefined, year = 2026): IuCutoff | undefined {
  if (!programId) return undefined;
  return iuCutoffs2026.find((cutoff) => cutoff.programId === programId && cutoff.year === year);
}
