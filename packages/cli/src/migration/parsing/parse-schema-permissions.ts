import { AstVariable } from '../../ast/ast-variable';
import { RelationalSchemaDescription } from '@daita/orm';

export function parseSchemaPermissions(schema: RelationalSchemaDescription,schemaVariable: AstVariable) {
  for (const permissionCalls of schemaVariable.getCalls({ name: 'permission' })) {
    const clsArg = permissionCalls.argument(0);
    const objArg = permissionCalls.argument(1);
    if (!clsArg || !objArg) {
      throw new Error('invalid push call');
    }

    const objVal = objArg.objectValue;
    if (!objVal) {
      throw new Error('invalid obj');
    }

    const classDeclaration = clsArg.classDeclaration;
    if (!classDeclaration) {
      throw new Error('invalid cls');
    }

    if (!classDeclaration.name) {
      throw new Error('missing cls name');
    }

    const permission = objVal.anyValue;
    schema.addPermission(undefined, classDeclaration.name, classDeclaration.name, permission); //TODO static schema
  }

}
