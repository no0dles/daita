import {AstVariable} from '../../ast/ast-variable';
import {TablePermission} from '@daita/core';

export function parsePermissionBuilder(builderVariable: AstVariable) {
  const permissions: { [key: string]: TablePermission<any>[] } = {};

  const pushCalls = builderVariable.getCalls({name: 'push'});
  for (const pushCall of pushCalls) {
    const clsArg = pushCall.argument(0);
    const objArg = pushCall.argument(1);
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
    if (!permissions[classDeclaration.name]) {
      permissions[classDeclaration.name] = [];
    }
    permissions[classDeclaration.name].push(permission);
  }

  return permissions;
}