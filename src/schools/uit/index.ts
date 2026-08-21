import type { SchoolModule } from '../../core/schoolModule';
import { UitInfoPage } from './UitInfoPage';
import { uitMeta } from './meta';

export const uitModule: SchoolModule = {
  ...uitMeta,
  Page: UitInfoPage,
};
