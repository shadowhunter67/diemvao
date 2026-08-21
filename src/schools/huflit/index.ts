import type { SchoolModule } from '../../core/schoolModule';
import { HuflitPage } from './HuflitPage';
import { huflitMeta } from './meta';

export const huflitModule: SchoolModule = {
  ...huflitMeta,
  Page: HuflitPage,
};
