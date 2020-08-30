import {isExactKind} from '../../../common/utils';
import { ExpressionDescription } from './expression';

export interface LowerEqualThanDescription<T> {
  lowerEqualThan: ExpressionDescription<T>;
}

export const isLowerEqualThanDescription = (val: any): val is LowerEqualThanDescription<any> => isExactKind<LowerEqualThanDescription<any>>(val, ['lowerEqualThan']);

