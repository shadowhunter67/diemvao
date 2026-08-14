import { describe, expect, it } from 'vitest';
import { uhsModule } from './index';
import { uhsAdmissionMethods } from './methods';

describe('UHS exactness contract', () => {
  it('marks method 2 as partial, not exact, because w1/w2 remain ranges', () => {
    expect(uhsAdmissionMethods[0].capabilities.exactCalculator).toBe(false);
    expect(uhsModule.capabilities?.partialCalculator).toBe(true);
    expect(uhsModule.capabilities?.exactCalculator).toBe(false);
  });
});
