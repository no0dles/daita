import {MockAstContext} from '../../ast/ast-context';
import {parseSchemaPermissions} from './parse-schema-permissions';
import {isNotNull} from '../../test/utils';

describe('parse-schema-permissions', () => {
  it('should parse permission', () => {
    const context = new MockAstContext();
    context.mock('permissions.ts', `
      const permissions = new PermissionBuilder();
      permissions
      export = permissions;
    `);
    const sourceFile = context.get('permissions.ts');
    isNotNull(sourceFile);
    const permissionVariable = sourceFile.getVariable('permissions');
    isNotNull(permissionVariable);
    const permissions = parseSchemaPermissions(permissionVariable);
    console.log(permissions);
  });
});