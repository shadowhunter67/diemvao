import type { SchoolModule } from '../../core/schoolModule';
import { IuPage } from './IuPage';
import { iuMeta } from './meta';

export const iuModule: SchoolModule = {
  ...iuMeta,
  Page: IuPage,
};
