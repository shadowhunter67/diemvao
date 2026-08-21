export interface NeuEquivalenceBand {
  thpt: [number, number];
  hsa: [number, number];
  sat: [number, number];
  vact: [number, number];
  tsa: [number, number];
}

export const NEU_THPT_THRESHOLD_30 = 22;

export const NEU_EQUIVALENCE_BANDS: NeuEquivalenceBand[] = [
  { thpt: [28, 30], hsa: [112, 150], sat: [1580, 1600], vact: [1004, 1200], tsa: [77.9, 100] },
  { thpt: [26, 28], hsa: [98, 112], sat: [1500, 1580], vact: [882, 1004], tsa: [66.19, 77.9] },
  { thpt: [24, 26], hsa: [87, 98], sat: [1290, 1500], vact: [752, 882], tsa: [60.63, 66.19] },
  { thpt: [22, 24], hsa: [85, 87], sat: [1200, 1290], vact: [700, 752], tsa: [60, 60.63] },
];

export function findNeuVactEquivalenceBand(vactScore: number): NeuEquivalenceBand | undefined {
  return NEU_EQUIVALENCE_BANDS.find((band) => vactScore >= band.vact[0] && vactScore <= band.vact[1]);
}

export function checkNeuThptThreshold(total30: number): { pass: boolean; requiredText: string } {
  return { pass: total30 >= NEU_THPT_THRESHOLD_30, requiredText: `THPT combination total >= ${NEU_THPT_THRESHOLD_30}/30` };
}

