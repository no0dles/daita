import { Constructable } from '../../types';
import { isKind } from '../../utils';

export interface ClassProvider {
  provide: {};
  useClass: Constructable<any>;
}

export const isClassProvider = (val: any): val is ClassProvider => isKind(val, ['useClass', 'provide']);
