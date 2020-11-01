import { TableDescription } from './table';
import { TableAliasDescription } from './table-alias';
import { isExactKind } from '../../../common/utils/is-exact-kind';

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
