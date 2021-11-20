import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { getStringValue } from '../../ast/utils';
import { table } from '@daita/relational/sql/keyword/table/table';

export function parseTableDescription(classDeclaration: AstClassDeclaration) {
  if (!classDeclaration.name) {
    throw new Error('reference name is missing');
  }

  let tableName = classDeclaration.name;
  let schemaName: string | undefined = undefined;

  const tableProperty = classDeclaration.staticProp('table');
  if (tableProperty && tableProperty.value) {
    tableName = getStringValue(tableProperty.value);
  }

  const schemaProperty = classDeclaration.staticProp('schema');
  if (schemaProperty && schemaProperty.value) {
    schemaName = getStringValue(schemaProperty.value);
  }

  return table(tableName, schemaName);
}
