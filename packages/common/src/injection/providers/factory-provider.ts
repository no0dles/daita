import { isKind } from '../../utils';

export interface FactoryProvider {
  provide: {};
  useFactory: (...args: any[]) => any;
  deps?: any[];
}

export const isFactoryProvider = (val: any): val is FactoryProvider => isKind(val, ['useFactory', 'provide']);
