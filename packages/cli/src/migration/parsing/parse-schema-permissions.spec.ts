import { AstContext } from '../../ast/ast-context';
import {isNotNull} from '../../test/utils';
import {parseSchemaPermissions} from './parse-schema-permissions';
import { RelationalSchemaDescription } from '@daita/orm';

describe('parse-schema-permissions', () => {
  it('should parse permission', () => {
    const context = new AstContext();
    const sourceFile = context.get('./src/test/schemas/auth-schema/src/schema.ts')
    isNotNull(sourceFile);
    const schemaVariable = sourceFile.getVariable('schema');
    isNotNull(schemaVariable);
    const schema = new RelationalSchemaDescription();
    parseSchemaPermissions(schema, schemaVariable);

    expect(schema.schemaPermissions.tablePermissions('User')).toEqual([
      {role: 'admin', select: true},
    ]);
  });
});
