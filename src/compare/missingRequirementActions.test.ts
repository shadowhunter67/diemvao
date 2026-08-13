import { describe, expect, it } from 'vitest';
import hcmutPageSource from '../schools/hcmut/HcmutCalculatorPage.tsx?raw';
import uehPageSource from '../schools/ueh/UehExplorerPage.tsx?raw';
import uelPageSource from '../schools/uel/UelExplorerPage.tsx?raw';
import uitPageSource from '../schools/uit/UitInfoPage.tsx?raw';
import { withMissingRequirementActions } from './missingRequirementActions';

describe('missing requirement actions', () => {
  it('links actionable UEL THPT gaps and leaves official-rule gaps without CTA', () => {
    const requirements = withMissingRequirementActions('uel', [
      { kind: 'profile-input', code: 'uel-thpt-physics', label: 'Điểm THPT môn Vật lý.' },
      { kind: 'official-rule', code: 'uel-appendix-2', label: 'Thiếu phụ lục 2.' },
    ]);

    expect(requirements[0].action?.href).toBe('/uel#thpt');
    expect(requirements[1].action).toBeUndefined();
  });

  it('links HCMUT school context to the subject context section', () => {
    const requirements = withMissingRequirementActions('hcmut', [
      { kind: 'school-context', code: 'hcmut-context', label: 'Cần chọn ngữ cảnh HCMUT.' },
    ]);

    expect(requirements[0].action?.href).toBe('/hcmut#subject-context');
  });

  it('canonical action anchors point to IDs that exist in school pages', () => {
    const pages = {
      hcmut: hcmutPageSource,
      uel: uelPageSource,
      ueh: uehPageSource,
      uit: uitPageSource,
    };
    const hrefs = [
      '/hcmut#subject-context',
      '/hcmut#thpt',
      '/hcmut#dgnl',
      '/uel#subject-combination',
      '/uel#thpt',
      '/uel#dgnl',
      '/ueh#dgnl',
      '/uit#dgnl',
    ];

    for (const href of hrefs) {
      const [schoolId, targetId] = href.slice(1).split('#') as [keyof typeof pages, string];
      expect(pages[schoolId]).toContain(`id="${targetId}"`);
    }
  });
});
