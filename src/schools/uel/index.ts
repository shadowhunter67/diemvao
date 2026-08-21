import type { SchoolModule } from '../../core/schoolModule';
import { UelExplorerPage } from './UelExplorerPage';
import { uelMeta } from './meta';

export const uelModule: SchoolModule = {
  ...uelMeta,
  Page: UelExplorerPage,
};
