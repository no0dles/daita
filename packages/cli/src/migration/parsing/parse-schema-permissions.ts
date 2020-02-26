import {AstVariable} from '../../ast/ast-variable';
import {Permission} from '@daita/core';
import {parsePermissionBuilder} from './parse-permission-builder';

export function parseSchemaPermissions(schemaVariable: AstVariable) {
  const result: { [key: string]: Permission<any>[] } = {};

  for (const permissionCalls of schemaVariable.getCalls({name: 'permission'})) {
    const builderArgument = permissionCalls.argument(0);

    if (!builderArgument) {
      throw new Error('invalid permission call');
    }

    const variable = builderArgument.variable;
    if (!variable) {
      throw new Error('invalid variable');
    }

    const permissions = parsePermissionBuilder(variable)
    for (const key of Object.keys(permissions)) {
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(...permissions[key]);
    }
  }

  return result;
}
