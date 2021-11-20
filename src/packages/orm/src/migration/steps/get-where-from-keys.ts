import { TableDescription } from '@daita/relational/sql/keyword/table/table-description';
import { ConditionDescription } from '@daita/relational/sql/operands/condition-description';
import { equal } from '@daita/relational/sql/operands/comparison/equal/equal';
import { field } from '@daita/relational';
import { and } from '@daita/relational/sql/keyword/and/and';

export function getWhereFromKeys(tableDescription: TableDescription<any>, keys: any): ConditionDescription {
  const conditions = Object.keys(keys).map((key) => equal(field(tableDescription, key), keys[key]));
  if (conditions.length === 0) {
    throw new Error('seed requires at least 1 key');
  }
  return and(...(conditions as any));
}
