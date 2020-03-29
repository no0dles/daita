import {MockAstContext} from '../../ast/ast-context';
import {isNotNull} from '../../test/utils';
import {parseSchemaPermissions} from './parse-schema-permissions';

describe('parse-schema-permissions', () => {
  it('should parse permission', () => {
    const context = new MockAstContext();
    context.mock('user.ts', `
      export class User {
        id: string;
        username: string;
      }
    `);
    context.mock('schema.ts', `
      import {User} from './user';
      import * as permissions from './permissions';
      const schema = new RelationalSchema();
      schema.table(User);
      schema.permission(permissions);
      export = permissions;
    `);
    context.mock('permissions.ts', `
      import {User} from './user';
      const permissions = new PermissionBuilder();
      permissions.push(User, {role: 'admin', select: true});
      export = permissions;
    `);
    const sourceFile = context.get('schema.ts');
    isNotNull(sourceFile);
    const schemaVariable = sourceFile.getVariable('schema');
    isNotNull(schemaVariable);
    const permissions = parseSchemaPermissions(schemaVariable);

    expect(permissions).toContainAllKeys(['User']);
    expect(permissions['User']).toEqual([
      {role: 'admin', select: true},
    ]);
  });
});