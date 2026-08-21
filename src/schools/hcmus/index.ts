import type { SchoolModule } from '../../core/schoolModule';
import { HcmusPage } from './HcmusPage';
import { hcmusMeta } from './meta';

export const hcmusModule: SchoolModule = {
  ...hcmusMeta,
  Page: HcmusPage,
};
