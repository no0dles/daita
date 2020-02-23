import {AstVariable} from '../../ast/ast-variable';
import {AstClassDeclaration} from '../../ast/ast-class-declaration';

export function parseSchemaCollections(
  schemaVariable: AstVariable,
): AstClassDeclaration[] {
  const classDeclarations = new Array<AstClassDeclaration>();

  const calls = schemaVariable.getCalls({name: 'collection'});
  for (const call of calls) {
    const classArgument = call.argument(0);
    if (!classArgument) {
      throw new Error('missing class arugment');
    }
    const classDeclaration = classArgument.classDeclaration;
    if (!classDeclaration) {
      throw new Error('first arg is not class arg');
    }
    classDeclarations.push(classDeclaration);
  }

  return classDeclarations;
}