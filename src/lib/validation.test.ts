import { describe, expect, it } from 'vitest';
import { activeAdmissionConfig } from '../config/admission-2026';
import { validateTargetScore } from './validation';

const config = activeAdmissionConfig;

describe('validateTargetScore', () => {
  it('case 5: rejects a target above 100 with an error, clamped to the max', () => {
    const result = validateTargetScore('150', config);
    expect(result.error).not.toBeNull();
    expect(result.value).toBe(100);
  });

  it('accepts a target within 0..100', () => {
    const result = validateTargetScore('85', config);
    expect(result.error).toBeNull();
    expect(result.value).toBe(85);
  });

  it('treats an empty target as empty, not an error', () => {
    const result = validateTargetScore('', config);
    expect(result.error).toBeNull();
    expect(result.isEmpty).toBe(true);
  });
});
