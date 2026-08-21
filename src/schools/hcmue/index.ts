import type { SchoolModule } from '../../core/schoolModule';
import { HcmuePage } from './HcmuePage';
import { hcmueMeta } from './meta';

export const hcmueModule: SchoolModule = {
  ...hcmueMeta,
  Page: HcmuePage,
};
