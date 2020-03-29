import { RootFilter } from './root-filter';
import {isKind} from '../utils/is-kind';

export interface AndRootFilter<T> {
  $and: RootFilter<T>[];
}

export const isAndRootFilter = (val: any): val is AndRootFilter<any> => isKind<AndRootFilter<any>>(val, ['$and']);