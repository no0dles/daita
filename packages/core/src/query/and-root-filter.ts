import {RootFilter} from './root-filter';

export interface AndRootFilter<T> {
  $and: RootFilter<T>[];
}
