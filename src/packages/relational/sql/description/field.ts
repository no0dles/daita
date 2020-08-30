import { TableDescription } from './table';
import { isExactKind } from '../../../common/utils';
import { TableAliasDescription } from './table-alias';

export interface FieldDescription {
  field: {
    key: string;
    table: TableDescription<any> | TableAliasDescription<any>;
  };
}

export const isFieldDescription = (val: any): val is FieldDescription =>
  isExactKind<FieldDescription>(val, ['field']) &&
  typeof val.field.key === 'string' &&
  /^[a-zA-Z0-9_]+$/.test(val.field.key);
