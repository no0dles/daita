import { AstSourceFile } from '../../ast/ast-source-file';
import { SchemaDeclaration } from './schema-declaration';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';

export function parseSchemas(sourceFile: AstSourceFile): SchemaDeclaration[] {
  const schemas: SchemaDeclaration[] = [];
  for (const variable of sourceFile.block.variables) {
    const variableType = variable.type;
    if (!(variableType instanceof AstClassDeclaration)) {
      continue;
    }
    if (variableType.name === 'RelationalSchema') {
      schemas.push({
        variable: variable,
        type: 'relational',
      });
    } else if (variableType.name === 'DocumentSchema') {
      schemas.push({
        variable: variable,
        type: 'document',
      });
    }
  }
  return schemas;
}
