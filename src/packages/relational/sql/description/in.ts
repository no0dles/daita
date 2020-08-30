import { isExactKind } from '../../../common/utils';

export interface InDescription<T> {
  in: {
    field: T;
    values: T[];
  };
}

export const isInDescription = (val: any): val is InDescription<any> =>
  isExactKind<InDescription<any>>(val, ['in']);
