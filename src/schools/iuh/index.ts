import type { SchoolModule } from '../../core/schoolModule';
import { IuhPage } from './IuhPage';
import { iuhMeta } from './meta';

export const iuhModule: SchoolModule = {
  ...iuhMeta,
  Page: IuhPage,
};
