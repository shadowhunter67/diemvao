import type { SchoolModule } from '../../core/schoolModule';
import { UfmPage } from './UfmPage';
import { ufmMeta } from './meta';

export const ufmModule: SchoolModule = {
  ...ufmMeta,
  Page: UfmPage,
};
