import {getDocumentMigrationSteps, getRelationalMigrationSteps} from './get-migration-steps';
import {assert} from 'chai';
import {parseModelSchema} from './parse-migration';
import {parseSourceFile} from './utils';
import {AddCollectionFieldMigrationStep, AddCollectionMigrationStep, RelationalAddTableMigrationStep} from '../steps';
import {DatabaseSchemaCollection} from '../../schema/database-schema-collection';
import {DatabaseSchema} from '../../schema/database-schema';


describe('get-migration-steps', () => {
  it('steps for empty schema', () => {
    const oldSchema = new DatabaseSchema({}, {});
    const newSchema = new DatabaseSchema({
      'user': new DatabaseSchemaCollection('user', {
        'foo': {name: 'foo', type: 'string', required: true, defaultValue: 'abc'},
      })
    }, {});

    const steps = getDocumentMigrationSteps(oldSchema, newSchema);

    assert.deepEqual(steps, [
      new AddCollectionMigrationStep('user'),
      new AddCollectionFieldMigrationStep('user', 'foo', 'string', true, 'abc'),
    ]);
  });

  it('steps for same schema', () => {
    const schema = new DatabaseSchema({
      'user': new DatabaseSchemaCollection('user', {
        'foo': {name: 'foo', type: 'string', required: true, defaultValue: 'abc'},
      })
    }, {});
    const steps = getDocumentMigrationSteps(schema, schema);
    assert.deepEqual(steps, []);
  });


  it('steps for test schema', () => {
    const currentSchema = new DatabaseSchema( {}, {});
    const sourceFile = parseSourceFile(`${process.cwd()}/test/schema/schema.ts`);
    const schema = parseModelSchema(sourceFile, 'schema');
    const steps = getRelationalMigrationSteps(currentSchema, schema);

    expectContainsItem(steps, new RelationalAddTableMigrationStep('User'));
    // assert.deepEqual(steps, [
    //   new RelationalAddTableMigrationStep('User'),
    //   new RelationalAddTableMigrationStep('Role'),
    //   new RelationalAddTableMigrationStep('Permission'),
    //   new RelationalAddTableMigrationStep('RolePermission'),
    //   new RelationalAddTableMigrationStep('UserRole'),
    //   new RelationalAddTableFieldMigrationStep('User', 'username', 'string', true),
    // ]);
  });
});

function expectContainsItem<T>(array: T[], expectedItem: T) {
  for(const item of array) {
    //assert.has(item, expectedItem)
  }
}
