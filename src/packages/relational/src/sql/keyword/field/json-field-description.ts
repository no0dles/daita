import { TableDescription } from '../table/table-description';
import { TableAliasDescription } from '../../dml/select/table-alias-description';
import { isExactKind } from '@daita/common';

export interface JsonFieldDescription {
  jsonField: {
    keys: string[];
    table: TableDescription<any> | TableAliasDescription<any>;
  };
}

export const isJsonFieldDescription = (val: any): val is JsonFieldDescription =>
  isExactKind<JsonFieldDescription>(val, ['jsonField']) &&
  val.jsonField.keys instanceof Array &&
  val.jsonField.keys.every((k) => /^[a-zA-Z0-9_]+$/.test(k));