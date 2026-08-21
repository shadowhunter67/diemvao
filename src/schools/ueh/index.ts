import type { SchoolModule } from '../../core/schoolModule';
import { UehExplorerPage } from './UehExplorerPage';
import { uehMeta } from './meta';

export const uehModule: SchoolModule = {
  ...uehMeta,
  Page: UehExplorerPage,
};
