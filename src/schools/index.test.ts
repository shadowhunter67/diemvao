import { describe, expect, it } from 'vitest';
import { schoolRegistry } from './index';
import { hcmutModule } from './hcmut';
import { uehModule } from './ueh';
import { uelModule } from './uel';
import { iuModule } from './iu';
import { usshModule } from './ussh';
import { ftuModule } from './ftu';
import { tdtuModule } from './tdtu';
import { huflitModule } from './huflit';
import { umpModule } from './ump';
import { hutechModule } from './hutech';
import { hcmulawModule } from './hcmulaw';
import { ufmModule } from './ufm';
import { iuhModule } from './iuh';
import { southernCatalogSchools } from './southernCatalog';
import { remainingCatalogSchools } from './remainingCatalog';
import { finalCatalogSchools } from './finalCatalog';
import { collegeCatalogSchools } from './collegeCatalog';
import readme from '../../README.md?raw';
import type { SchoolModule } from '../core/schoolModule';

/**
 * So metadata KHÔNG so `Page` — từ batch code-splitting (P1), `schoolRegistry` bọc `Page` của 16
 * trường "nặng" bằng `React.lazy(...)` (xem `schools/index.ts`), nên `schoolRegistry.hcmut.Page`
 * KHÔNG còn cùng reference với `hcmutModule.Page` (import trực tiếp, component thật, không lazy) —
 * đây là khác biệt CÓ CHỦ ĐÍCH, không phải bug. Test so sánh danh tính/metadata của trường, không
 * so cách `Page` được tải.
 */
function withoutPage(module: SchoolModule): Omit<SchoolModule, 'Page'> {
  const { Page: _Page, ...rest } = module;
  return rest;
}

describe('schoolRegistry', () => {
  it('có hcmut đăng ký với id đúng, metadata khớp module import trực tiếp', () => {
    expect(withoutPage(schoolRegistry.hcmut)).toEqual(withoutPage(hcmutModule));
    expect(schoolRegistry.hcmut.id).toBe('hcmut');
  });

  it('hcmut, uit, uel, ueh, hcmus, ussh, uhs, iu có Page (route thật) — App shell chỉ cần tra registry, không tự biết bên trong', () => {
    expect(schoolRegistry.hcmut.Page).toBeDefined();
    expect(schoolRegistry.uit.Page).toBeDefined();
    expect(schoolRegistry.uel.Page).toBeDefined();
    expect(schoolRegistry.ueh.Page).toBeDefined();
    expect(schoolRegistry.hcmus.Page).toBeDefined();
    expect(schoolRegistry.ussh.Page).toBeDefined();
    expect(schoolRegistry.uhs.Page).toBeDefined();
    expect(schoolRegistry.iu.Page).toBeDefined();
    expect(schoolRegistry.hcmue.Page).toBeDefined();
  });

  it('các trường formula-incomplete/researching còn lại chưa có Page', () => {
    const withPage = new Set(['hcmut', 'uit', 'uel', 'ueh', 'hcmus', 'ussh', 'uhs', 'iu', 'hcmue', 'tdtu', 'huflit', 'ump', 'hutech', 'hcmulaw', 'ufm', 'iuh']);
    const withoutPage = Object.values(schoolRegistry).filter((school) => !withPage.has(school.id));
    for (const school of withoutPage) {
      expect(school.Page).toBeUndefined();
    }
  });

  it('hcmutModule có đủ thông tin định danh và status supported', () => {
    expect(hcmutModule.shortName).toBe('HCMUT');
    expect(hcmutModule.year).toBe(2026);
    expect(hcmutModule.name).toContain('Bách khoa');
    expect(hcmutModule.status).toBe('supported');
  });

  it('hcmut, ueh, uel, iu, ussh, tdtu, huflit, ump, hutech, hcmulaw, ufm, iuh có status supported (đều có Page thật để tính điểm)', () => {
    const supported = Object.values(schoolRegistry).filter((school) => school.status === 'supported');
    expect(supported.map(withoutPage)).toEqual(
      expect.arrayContaining(
        [hcmutModule, uehModule, uelModule, iuModule, usshModule, tdtuModule, huflitModule, umpModule, hutechModule, hcmulawModule, ufmModule, iuhModule].map(
          withoutPage
        )
      )
    );
    expect(supported).toHaveLength(12);
    for (const school of supported) {
      expect(school.Page, `${school.id} status=supported nhưng thiếu Page`).toBeDefined();
    }
  });

  it('ftuModule có exact calculator (route ĐGNL/ĐGTD nội địa) nhưng status vẫn researching vì chưa có Page thật', () => {
    expect(ftuModule.capabilities?.exactCalculator).toBe(true);
    expect(ftuModule.status).toBe('researching');
    expect(ftuModule.Page).toBeUndefined();
  });

  it('có đủ các trường đã research (ĐHQG-HCM + UEH ngoài hệ thống)', () => {
    const ids = Object.keys(schoolRegistry).sort();
    const coreIds = [
      'agu',
      'ctu',
      'ftu',
      'hcmue',
      'hcmulaw',
      'hcmus',
      'hcmut',
      'hcmute',
      'hiu',
      'hnue',
      'hsu',
      'hub',
      'huflit',
      'huit',
      'hutech',
      'iu',
      'iuh',
      'neu',
      'nttu',
      'ou',
      'ptit',
      'sgu',
      'tdmu',
      'tdtu',
      'uef',
      'ueh',
      'uel',
      'ufm',
      'uhs',
      'uit',
      'ump',
      'ussh',
      'utc',
      'vinhuni',
      'vlu',
      'vnua',
    ];
    const catalogIds = [...southernCatalogSchools, ...remainingCatalogSchools, ...finalCatalogSchools, ...collegeCatalogSchools].map((school) => school.id);
    expect(ids).toEqual([...coreIds, ...catalogIds].sort());
    expect(ids).toHaveLength(267);
  });

  it('README.md mục "Trường đang hỗ trợ" nhắc tên mọi trường trong registry (phát hiện drift)', () => {
    for (const school of Object.values(schoolRegistry)) {
      expect(readme, `README thiếu shortName "${school.shortName}"`).toContain(school.shortName);
    }
  });
});
