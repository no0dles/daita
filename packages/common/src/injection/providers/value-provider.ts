import { isKind } from '../../utils';
import { InjectionToken } from '../injection-token';

export interface ValueProvider<T> {
  provide: InjectionToken<T>;
  useValue: T;
}

export const isValueProvider = (val: any): val is ValueProvider<any> => isKind(val, ['useValue', 'provide']);
