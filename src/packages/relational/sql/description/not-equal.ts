import {isExactKind} from '../../../common/utils';
import { ExpressionDescription } from './expression';

export interface NotEqualDescription<T> {
  notEqual: ExpressionDescription<T>;
}

export const isNotEqualDescription = (val: any): val is NotEqualDescription<any> => isExactKind<NotEqualDescription<any>>(val, ['notEqual']);

