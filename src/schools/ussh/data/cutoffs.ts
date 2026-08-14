import type { UsshCutoff } from '../types/programs';

const SOURCE_LABEL = 'Điểm chuẩn xét tuyển đại học chính quy USSH năm 2026 (mã trường QSX)';
const SOURCE_URL = 'https://www.hcmussh.edu.vn/';
const ACCESSED_AT = '2026-08-14';

/**
 * Bảng thô ĐT01/ĐT02/ĐT03 theo `programId` (khớp `data/programs.ts`) — transcribe trực tiếp từ 3
 * ảnh official (xem `sources.ts` `ussh-cutoff-2026`). `buildCutoffRecords` bung mỗi dòng thành 3
 * record riêng (1/applicantType) để khớp `ComparableCutoffRecord.applicantTypeId` (Phần I: strict
 * matching program + ĐT, không so điểm ĐT1 với ngưỡng ĐT2).
 */
const RAW_ROWS: { programId: string; dt01: number; dt02: number; dt03: number }[] = [
  { programId: 'ussh-7310401', dt01: 86.3, dt02: 87, dt03: 86.3 },
  { programId: 'ussh-7310403', dt01: 79.5, dt02: 79.5, dt03: 79.5 },
  { programId: 'ussh-7310501', dt01: 78.3, dt02: 78.5, dt03: 78.3 },
  { programId: 'ussh-7310601', dt01: 79.5, dt02: 79.5, dt03: 79.5 },
  { programId: 'ussh-7310608', dt01: 74.6, dt02: 74.7, dt03: 74.6 },
  { programId: 'ussh-7310613', dt01: 76.1, dt02: 76.3, dt03: 76.1 },
  { programId: 'ussh-7310614', dt01: 76.5, dt02: 77, dt03: 76.5 },
  { programId: 'ussh-7310630', dt01: 76, dt02: 76.6, dt03: 76 },
  { programId: 'ussh-7320101', dt01: 84.9, dt02: 84.9, dt03: 84.9 },
  { programId: 'ussh-7320104', dt01: 88.8, dt02: 88.8, dt03: 88.8 },
  { programId: 'ussh-7320108', dt01: 85.5, dt02: 85.5, dt03: 85.5 },
  { programId: 'ussh-7320201', dt01: 74.5, dt02: 74.5, dt03: 74.5 },
  { programId: 'ussh-7320205', dt01: 79, dt02: 79.5, dt03: 79 },
  { programId: 'ussh-7320303', dt01: 74, dt02: 75.2, dt03: 74 },
  { programId: 'ussh-7340404', dt01: 80, dt02: 80.35, dt03: 80 },
  { programId: 'ussh-7340406', dt01: 78, dt02: 78.8, dt03: 78 },
  { programId: 'ussh-7580109', dt01: 70, dt02: 70, dt03: 70 },
  { programId: 'ussh-7580112', dt01: 73.3, dt02: 74.1, dt03: 73.3 },
  { programId: 'ussh-7760101', dt01: 77.25, dt02: 77.65, dt03: 77.25 },
  { programId: 'ussh-7810103', dt01: 82, dt02: 82, dt03: 82 },
  { programId: 'ussh-73106A1', dt01: 76.9, dt02: 76.9, dt03: 76.9 },
  { programId: 'ussh-7140101', dt01: 75.5, dt02: 76.2, dt03: 75.5 },
  { programId: 'ussh-7140107', dt01: 78.5, dt02: 78.5, dt03: 78.5 },
  { programId: 'ussh-7140114', dt01: 79, dt02: 79, dt03: 79 },
  { programId: 'ussh-7210213', dt01: 83.5, dt02: 83.5, dt03: 83.5 },
  { programId: 'ussh-7220104', dt01: 73, dt02: 73.5, dt03: 73 },
  { programId: 'ussh-7220201', dt01: 83.1, dt02: 83.1, dt03: 83.1 },
  { programId: 'ussh-7220202', dt01: 76, dt02: 77, dt03: 76 },
  { programId: 'ussh-7220203', dt01: 73.5, dt02: 73.7, dt03: 73.5 },
  { programId: 'ussh-7220204', dt01: 81.5, dt02: 81.5, dt03: 81.5 },
  { programId: 'ussh-7220205', dt01: 78.7, dt02: 78.7, dt03: 78.7 },
  { programId: 'ussh-7220206', dt01: 75.1, dt02: 75.1, dt03: 75.1 },
  { programId: 'ussh-7220208', dt01: 71, dt02: 71.6, dt03: 71 },
  { programId: 'ussh-7229001', dt01: 76, dt02: 76.5, dt03: 76 },
  { programId: 'ussh-7229009', dt01: 70, dt02: 70, dt03: 70 },
  { programId: 'ussh-7229010', dt01: 80, dt02: 80.3, dt03: 80 },
  { programId: 'ussh-7229020', dt01: 74, dt02: 74, dt03: 74 },
  { programId: 'ussh-7229030', dt01: 81, dt02: 81, dt03: 81 },
  { programId: 'ussh-7229040', dt01: 79.5, dt02: 80.9, dt03: 79.5 },
  { programId: 'ussh-7310206', dt01: 82.6, dt02: 82.6, dt03: 82.6 },
  { programId: 'ussh-7310301', dt01: 76.5, dt02: 77.9, dt03: 76.5 },
  { programId: 'ussh-7310302', dt01: 75, dt02: 75.3, dt03: 75 },
  { programId: 'ussh-7220201LK', dt01: 71.4, dt02: 71.4, dt03: 71.4 },
  { programId: 'ussh-7220204LK', dt01: 75.5, dt02: 75.5, dt03: 75.5 },
  { programId: 'ussh-7310206LK', dt01: 70, dt02: 70, dt03: 70 },
  { programId: 'ussh-7320101LK', dt01: 70, dt02: 70, dt03: 70 },
  { programId: 'ussh-7220201QT', dt01: 80.1, dt02: 80.1, dt03: 80.1 },
  { programId: 'ussh-7220204QT', dt01: 78.1, dt02: 78.1, dt03: 78.1 },
  { programId: 'ussh-7220205QT', dt01: 72, dt02: 72, dt03: 72 },
  { programId: 'ussh-7310206QT', dt01: 80.8, dt02: 80.8, dt03: 80.8 },
  { programId: 'ussh-7310401QT', dt01: 84.5, dt02: 84.6, dt03: 84.5 },
  { programId: 'ussh-7310613QT', dt01: 72, dt02: 73, dt03: 72 },
  { programId: 'ussh-7320101QT', dt01: 80.7, dt02: 80.7, dt03: 80.7 },
  { programId: 'ussh-7810103QT', dt01: 76.9, dt02: 76.9, dt03: 76.9 },
];

function buildCutoffRecords(): UsshCutoff[] {
  return RAW_ROWS.flatMap((row) => {
    const base = {
      year: 2026,
      programId: row.programId,
      scoreScale: 100,
      sourceLabel: SOURCE_LABEL,
      sourceUrl: SOURCE_URL,
      accessedAt: ACCESSED_AT,
      status: 'final' as const,
      sourceType: 'official-school' as const,
    };
    return [
      { ...base, applicantTypeId: 'DT1' as const, score: row.dt01 },
      { ...base, applicantTypeId: 'DT2' as const, score: row.dt02 },
      { ...base, applicantTypeId: 'DT3' as const, score: row.dt03 },
    ];
  });
}

export const usshCutoffs: UsshCutoff[] = buildCutoffRecords();
