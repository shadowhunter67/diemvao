import type { SchoolModule } from '../../core/schoolModule';
import { HutechPage } from './HutechPage';
import { hutechMeta } from './meta';

export const hutechModule: SchoolModule = {
  ...hutechMeta,
  Page: HutechPage,
};
