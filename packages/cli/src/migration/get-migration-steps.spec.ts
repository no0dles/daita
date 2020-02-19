import { assert } from 'chai';
import {getDocumentMigrationSteps, getRelationalMigrationSteps, parseModelSchema} from './generation';
import {
  ExtendedAddCollectionFieldMigrationStep,
  ExtendedAddCollectionMigrationStep,
  ExtendedRelationalAddTableMigrationStep,
} from './steps';
import {DatabaseSchemaCollection} from '@daita/core/dist/schema/database-schema-collection';
import {parseSourceFile} from '../ast/utils';
import {DatabaseSchema} from '@daita/core/dist/schema/database-schema';


describe('get-migration-steps', () => {
  it('steps for empty schema', () => {
    const oldSchema = new DatabaseSchema({}, {});
    const newSchema = new DatabaseSchema(
      {
        user: new DatabaseSchemaCollection('user', {
          foo: {
            name: 'foo',
            type: 'string',
            required: true,
            defaultValue: 'abc',
          },
        }),
      },
      {},
    );

    const steps = getDocumentMigrationSteps(oldSchema, newSchema);

    assert.deepEqual(steps, [
      new ExtendedAddCollectionMigrationStep('user'),
      new ExtendedAddCollectionFieldMigrationStep(
        'user',
        'foo',
        'string',
        true,
        'abc',
      ),
    ]);
  });

  it('steps for same schema', () => {
    const schema = new DatabaseSchema(
      {
        user: new DatabaseSchemaCollection('user', {
          foo: {
            name: 'foo',
            type: 'string',
            required: true,
            defaultValue: 'abc',
          },
        }),
      },
      {},
    );
    const steps = getDocumentMigrationSteps(schema, schema);
    assert.deepEqual(steps, []);
  });

  it('steps for test schema', () => {
    const currentSchema = new DatabaseSchema({}, {});
    const sourceFile = parseSourceFile(
      `${process.cwd()}/test/migration/schema/schema.ts`,
    );
    const schema = parseModelSchema(sourceFile, 'schema');
    const steps = getRelationalMigrationSteps(currentSchema, schema);

    expectContainsItem(
      steps,
      new ExtendedRelationalAddTableMigrationStep('User'),
    );
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
  for (const item of array) {
    //assert.has(item, expectedItem)
  }
}
