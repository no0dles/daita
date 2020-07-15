import { AstVariableCallArgument } from '../../ast/ast-variable-call-argument';
import { RelationalTableDescription } from '@daita/orm';
import { RelationalTableIndexDescription } from '@daita/orm';

export function parseRelationalSchemaTableIndices(table: RelationalTableDescription, optionsArgument: AstVariableCallArgument | null) {
  const index = optionsArgument?.objectValue?.property('indices');
  if (!index) {
    return;
  }

  for (const indexProperty of index.properties()) {
    const indexValue = indexProperty.value.objectValue;
    if (indexProperty.value.objectValue && indexProperty.value.objectValue['columns']) {
      const columns = indexProperty.value.objectValue['columns'].arrayValue?.map(v => v.stringValue);
      const unique = indexProperty.value.objectValue['unique']?.booleanValue ?? false;
      addIndex(table, indexProperty.name, columns, unique);
    } else {
      addIndex(table, indexProperty.name, indexValue, false);
    }
  }
}

function addIndex(table: RelationalTableDescription, name: string, columns: any, unique: boolean) {
  if (columns instanceof Array) {
    const idx = new RelationalTableIndexDescription(name, table, columns.map(f => table.field(f)), unique);
    table.addIndex(name, idx);
  } else if (typeof columns === 'string') {
    const idx = new RelationalTableIndexDescription(name, table, [table.field(columns)], unique);
    table.addIndex(name, idx);
  } else {
    throw new Error(`invalid index`);
  }
}
