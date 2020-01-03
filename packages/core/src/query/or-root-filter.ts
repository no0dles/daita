import { RootFilter } from './root-filter';

export interface OrRootFilter<T> {
  $or: RootFilter<T>[];
}
