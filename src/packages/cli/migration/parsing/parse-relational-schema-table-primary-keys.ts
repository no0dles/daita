import { AstObjectValue } from '../../ast/ast-object-value';
import { getArrayValue, getStringValue } from '../../ast/utils';
import { AstArrayValue } from '../../ast/ast-array-value';
import { AstLiteralValue } from '../../ast/ast-literal-value';
import { RelationalTableDescription } from '../../../orm/schema';

export function parseRelationalSchemaTablePrimaryKeys(
  table: RelationalTableDescription,
  optionsArgument: AstObjectValue | null,
) {
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

  for (const key of keys) {
    const field = table.field(key);
    table.addPrimaryKey(field);
  }
}
