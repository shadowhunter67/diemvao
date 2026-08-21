import type { SchoolModule } from '../../core/schoolModule';
import { UmpPage } from './UmpPage';
import { umpMeta } from './meta';

export const umpModule: SchoolModule = {
  ...umpMeta,
  Page: UmpPage,
};
