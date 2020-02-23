import {AstVariable} from '../../ast/ast-variable';
import {Permission} from '@daita/core';

export function parseSchemaPermissions(schemaVariable: AstVariable) {
  const permissions: { [key: string]: Permission<any>[] } = {};

  for (const permissionCalls of schemaVariable.getCalls({name: 'permission'})) {
    const builderArgument = permissionCalls.argument(0);

    if (!builderArgument) {
      throw new Error('invalid permission call');
    }

    const variable = builderArgument.variable;
    if (!variable) {
      throw new Error('invalid variable');
    }

    const pushCalls = variable.getCalls({name: 'push'});
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

      const type = objVal.property('type');
      if (type) {
        type.stringValue
      }
    }
  }

  return permissions;
}
