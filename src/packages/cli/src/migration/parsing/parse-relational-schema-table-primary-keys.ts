import { AstObjectValue } from '../../ast/ast-object-value';
import { getArrayValue, getStringValue } from '../../ast/utils';
import { AstArrayValue } from '../../ast/ast-array-value';
import { AstLiteralValue } from '../../ast/ast-literal-value';
import { SchemaDescription, setTablePrimaryKey } from '@daita/orm';
import { TableDescription } from '@daita/relational';

export function parseRelationalSchemaTablePrimaryKeys(
  schema: SchemaDescription,
  table: TableDescription<any>,
  optionsArgument: AstObjectValue | null,
): SchemaDescription {
  const key = optionsArgument?.prop('key');

  const keys = [];
  if (key && key.value instanceof AstArrayValue) {
    keys.push(
      ...getArrayValue(key.value, (elm) => {
        const stringValue = getStringValue(elm);
        if (stringValue) {
          return stringValue;
        }
        throw new Error('invalid key');
      }),
    );
  } else if (key && key.value instanceof AstLiteralValue) {
    keys.push(getStringValue(key.value));
  } else {
    keys.push('id');
  }

  return setTablePrimaryKey(schema, table, keys);
}
