import { describe, expect, it } from 'vitest';
import { getUehCutoffContext } from './cutoffContext';
import { uehCutoffs } from './data/cutoffs';
import { uehPrograms } from './data/programs';

describe('getUehCutoffContext', () => {
  it('gán đúng campusId theo program cho cả 2 campus hcmc/mekong', () => {
    const mekongProgram = uehPrograms.find((p) => p.campus === 'mekong');
    const hcmcProgram = uehPrograms.find((p) => p.campus === 'hcmc');
    expect(mekongProgram).toBeDefined();
    expect(hcmcProgram).toBeDefined();

    const mekongCutoff = uehCutoffs.find((c) => c.programId === mekongProgram!.id);
    const hcmcCutoff = uehCutoffs.find((c) => c.programId === hcmcProgram!.id);
    expect(mekongCutoff).toBeDefined();
    expect(hcmcCutoff).toBeDefined();

    expect(getUehCutoffContext(mekongCutoff!, mekongProgram!).campusId).toBe('mekong');
    expect(getUehCutoffContext(hcmcCutoff!, hcmcProgram!).campusId).toBe('hcmc');
  });

  it('gán methodId từ uehAdmissionMethods[0]', () => {
    const program = uehPrograms[0];
    const cutoff = uehCutoffs.find((c) => c.programId === program.id)!;
    expect(getUehCutoffContext(cutoff, program).methodId).toBe('ueh-integrated-2026');
  });
});
