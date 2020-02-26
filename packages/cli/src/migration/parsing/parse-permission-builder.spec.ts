import {MockAstContext} from '../../ast/ast-context';
import {isNotNull} from '../../test/utils';
import {parsePermissionBuilder} from './parse-permission-builder';

describe('parse-permission-builder', () => {
  it('should parse permission', () => {
    const context = new MockAstContext();
    context.mock('user.ts', `
      export class User {
        id: string;
        username: string;
      }
    `);
    context.mock('permissions.ts', `
      import {User} from './user';
      const permissions = new PermissionBuilder();
      permissions.push(User, {type: 'role', role: 'admin', select: true});
      export = permissions;
    `);
    const sourceFile = context.get('permissions.ts');
    isNotNull(sourceFile);
    const permissionVariable = sourceFile.getVariable('permissions');
    isNotNull(permissionVariable);
    const permissions = parsePermissionBuilder(permissionVariable);

    expect(permissions).toContainAllKeys(['User']);
    expect(permissions['User']).toEqual([
      {type: 'role', role: 'admin', select: true},
    ]);
  });
});