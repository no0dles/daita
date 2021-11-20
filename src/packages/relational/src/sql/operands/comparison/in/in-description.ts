import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface InDescription<T> {
  in: {
    field: T;
    values: T[];
  };
}

export const isInDescription = (val: any): val is InDescription<any> => isExactKind<InDescription<any>>(val, ['in']);
