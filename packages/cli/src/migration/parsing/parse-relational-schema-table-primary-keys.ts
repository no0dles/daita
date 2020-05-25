import { RelationalTableDescription } from '@daita/orm';
import { AstVariableCallArgument } from '../../ast/ast-variable-call-argument';

export function parseRelationalSchemaTablePrimaryKeys(table: RelationalTableDescription, optionsArgument: AstVariableCallArgument | null) {
  const key = optionsArgument?.objectValue?.property('key');

  let keys = ['id'];
  if (key) {
    if (key.stringValue) {
      keys = [key.stringValue];
    } else if (key.arrayValue) {
      keys = [];
      for (const item of key.arrayValue) {
        if (item.stringValue) {
          keys.push(item.stringValue);
        } else {
          throw new Error('not all keys are valid');
        }
      }
    }
  }

  for (const key of keys) {
    const field = table.field(key);
    table.addPrimaryKey(field);
  }
}
