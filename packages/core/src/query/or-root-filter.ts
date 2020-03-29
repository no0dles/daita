import { RootFilter } from './root-filter';
import {isKind} from '../utils/is-kind';

export interface OrRootFilter<T> {
  $or: RootFilter<T>[];
}

export const isOrRootFilter = (val: any): val is OrRootFilter<any> => isKind<OrRootFilter<any>>(val, ['$or']);