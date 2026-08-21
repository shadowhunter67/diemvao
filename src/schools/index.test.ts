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
import readme from '../../README.md?raw';

describe('schoolRegistry', () => {
  it('có hcmut đăng ký với id đúng', () => {
    expect(schoolRegistry.hcmut).toBe(hcmutModule);
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
    expect(supported).toEqual(
      expect.arrayContaining([
        hcmutModule,
        uehModule,
        uelModule,
        iuModule,
        usshModule,
        tdtuModule,
        huflitModule,
        umpModule,
        hutechModule,
        hcmulawModule,
        ufmModule,
        iuhModule,
      ])
    );
    expect(supported).toHaveLength(12);
  });

  it('ftuModule có exact calculator (route ĐGNL/ĐGTD nội địa) nhưng status vẫn researching vì chưa có Page thật', () => {
    expect(ftuModule.capabilities?.exactCalculator).toBe(true);
    expect(ftuModule.status).toBe('researching');
    expect(ftuModule.Page).toBeUndefined();
  });

  it('có đủ các trường đã research (ĐHQG-HCM + UEH ngoài hệ thống)', () => {
    const ids = Object.keys(schoolRegistry).sort();
    expect(ids).toEqual([
      'agu',
      'ctu',
      'ftu',
      'hcmue',
      'hcmulaw',
      'hcmus',
      'hcmut',
      'hcmute',
      'hiu',
      'hsu',
      'hub',
      'huflit',
      'huit',
      'hutech',
      'iu',
      'iuh',
      'neu',
      'nttu',
      'ptit',
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
      'vlu',
    ]);
  });

  it('README.md mục "Trường đang hỗ trợ" nhắc tên mọi trường trong registry (phát hiện drift)', () => {
    for (const school of Object.values(schoolRegistry)) {
      expect(readme, `README thiếu shortName "${school.shortName}"`).toContain(school.shortName);
    }
  });
});

