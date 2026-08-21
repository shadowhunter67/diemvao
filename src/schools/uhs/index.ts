import type { SchoolModule } from '../../core/schoolModule';
import { UhsPage } from './UhsPage';
import { uhsMeta } from './meta';

export const uhsModule: SchoolModule = {
  ...uhsMeta,
  Page: UhsPage,
};
