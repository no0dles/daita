import { AstVariableCallArgument } from '../../ast/ast-variable-call-argument';
import { RelationalTableDescription } from '@daita/orm';
import { RelationalTableIndexDescription } from '@daita/orm/dist/schema/description/relational-table-index-description';

export function parseRelationalSchemaTableIndices(table: RelationalTableDescription, optionsArgument: AstVariableCallArgument | null) {
  const index = optionsArgument?.objectValue?.property('indices');
  if (!index) {
    return;
  }

  for (const indexProperty of index.properties()) {
    const indexValue = indexProperty.value.anyValue;
    if (typeof indexValue === 'object' && indexValue.columns) {
      addIndex(table, indexProperty.name, indexValue.columns, indexValue.unique ?? false);
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
