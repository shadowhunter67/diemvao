import type { SchoolModule } from '../../core/schoolModule';
import { UsshPage } from './UsshPage';
import { usshMeta } from './meta';

export const usshModule: SchoolModule = {
  ...usshMeta,
  Page: UsshPage,
};
