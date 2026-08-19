import { hcmueProgramThresholds } from './data/programs';

export function getHcmueProgramThreshold(programId: string | undefined) {
  return hcmueProgramThresholds.find((program) => program.id === programId);
}

export function checkHcmueThptThreshold(total30: number, programId: string) {
  const program = getHcmueProgramThreshold(programId);
  if (!program) return { pass: false, requiredText: 'Chưa có ngưỡng HCMUE cho ngành đã chọn.' };
  return {
    pass: total30 >= program.thptThreshold30,
    requiredText: `Ngưỡng THPT HCMUE 2026: ${program.thptThreshold30.toFixed(2)}/30 (${program.code} - ${program.name}).`,
  };
}
