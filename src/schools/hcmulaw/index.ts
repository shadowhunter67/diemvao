import type { SchoolModule } from '../../core/schoolModule';
import { HcmulawPage } from './HcmulawPage';
import { hcmulawMeta } from './meta';

export const hcmulawModule: SchoolModule = {
  ...hcmulawMeta,
  Page: HcmulawPage,
};
