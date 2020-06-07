import { FieldDescription, isFieldDescription } from './field';
import { TableDescription } from './table';
import { isExactKind } from '@daita/common';

export interface SumDescription {
  sum: { key: FieldDescription, table: TableDescription<any> };
}

export const isSumDescription = (val: any): val is SumDescription => isExactKind<SumDescription>(val, ['sum']) && isFieldDescription(val.sum);
