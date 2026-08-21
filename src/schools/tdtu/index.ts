import type { SchoolModule } from '../../core/schoolModule';
import { TdtuPage } from './TdtuPage';
import { tdtuMeta } from './meta';

export const tdtuModule: SchoolModule = {
  ...tdtuMeta,
  Page: TdtuPage,
};
