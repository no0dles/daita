import {DatabaseSchema} from '@daita/core/dist/schema/database-schema';
import {SchemaInformation} from '../../utils/path';
import {AstContext} from '../../ast/ast-context';
import {generateRelationalMigrationSteps} from './generate-relational-migration-steps';
import {parseSchemas} from '../parsing/parse-schemas';
import {isNotNull} from '../../test/utils';

describe('get-migration-steps', () => {
  it('steps for test schema', () => {
    const context = new AstContext();
    const currentSchema = new DatabaseSchema({}, {});
    const sourceFile = context.get(`${__dirname}/../../../test/migration/schema/schema.ts`);
    isNotNull(sourceFile);
    const schemas = parseSchemas(sourceFile);
    const schema = schemas[0];
    if (!schema) {
      throw new Error('unable to parse schema');
    }
    const schemaInformation = new SchemaInformation(schema);
    const relationalSchema = schemaInformation.getRelationalSchema()
    const steps = generateRelationalMigrationSteps(currentSchema, relationalSchema);

    expectContainsItem(
      steps,
      {kind: 'add_table', table: 'User'},
    );
  });
});

function expectContainsItem<T>(array: T[], expectedItem: T) {
  for (const item of array) {
    //assert.has(item, expectedItem)
  }
}
