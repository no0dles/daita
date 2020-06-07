import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { table } from '@daita/relational';

export function parseTableDescription(classDeclaration: AstClassDeclaration) {
  if (!classDeclaration.name) {
    throw new Error('reference name is missing');
  }

  let tableName = classDeclaration.name;

  let schemaName: string | undefined = undefined;
  const tableProperty = classDeclaration.getProperty('table', { static: true });
  if (tableProperty && tableProperty.initializer && tableProperty.initializer.stringValue) {
    tableName = tableProperty.initializer.stringValue;
  }
  const schemaProperty = classDeclaration.getProperty('table', { static: true });
  if (schemaProperty && schemaProperty.initializer && schemaProperty.initializer.stringValue) {
    schemaName = schemaProperty.initializer.stringValue;
  }

  return table(tableName, schemaName);
}
