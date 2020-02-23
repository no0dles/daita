import {AstSourceFile} from '../../ast/ast-source-file';
import {SchemaDeclaration} from './schema-declaration';

export function parseSchemas(sourceFile: AstSourceFile): SchemaDeclaration[] {
  const schemas: SchemaDeclaration[] = [];
  const variables = sourceFile.getVariables();
  for (const variable of variables) {
    const initializer = variable.initializer;
    if (!initializer || !initializer.newConstructor) {
      continue;
    }

    if (initializer.newConstructor.typeName === 'RelationalSchema') {
      schemas.push({
        variable: variable,
        type: 'relational',
      });
    } else if (initializer.newConstructor.typeName === 'DocumentSchema') {
      schemas.push({
        variable: variable,
        type: 'document',
      });
    }
  }
  return schemas;
}
