import {compareTableDescription, isTableDescription, TableDescription} from '../table/table-description';
import {
  getTableDescription,
  isTableAliasDescription,
  TableAliasDescription,
} from '../../dml/select/table-alias-description';
import {isExactKind} from '../../../../common/utils/is-exact-kind';

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

export const compareFieldDescription = (first: FieldDescription, second: FieldDescription) => {
  if (first.field.key !== second.field.key) {
    return false;
  }

  const firstTable = getTableDescription(first.field.table);
  const secondTable = getTableDescription(second.field.table);

  return firstTable.table === secondTable.table && firstTable.schema === secondTable.schema;
};
