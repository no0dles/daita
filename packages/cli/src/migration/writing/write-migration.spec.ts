import * as fs from 'fs';
import { assert } from 'chai';
import {
  addMigrationImport,
  addMigrationRegistration,
  removeMigrationImport,
  removeMigrationRegistration, writeMigration,
} from './write-migration';

describe('write-migration', () => {
  const schemaSourceFilePath = `${__dirname}/../../../test/migration/schema/schema.source.ts`;
  const schemaResultFilePath = `${__dirname}/../../../test/migration/schema/schema.result.ts`;
  const schemaExceptedFilePath = `${__dirname}/../../../test/migration/schema/schema.ts`;

  beforeEach(() => {
    if (fs.existsSync(schemaResultFilePath)) {
      fs.unlinkSync(schemaResultFilePath);
    }
    fs.copyFileSync(schemaSourceFilePath, schemaResultFilePath);
  });

  it('should add import and registration', () => {
    assert.equal(
      addMigrationImport(
        schemaResultFilePath,
        './migrations/init.migration',
        'InitMigration',
      ),
      true,
    );
    assert.equal(
      addMigrationRegistration(schemaResultFilePath, 'schema', 'InitMigration'),
      true,
    );

    const expectedContent = fs.readFileSync(schemaExceptedFilePath).toString();
    const actualContent = fs.readFileSync(schemaResultFilePath).toString();
    assert.equal(expectedContent, actualContent);
  });

  it('should add import, registration and undo', () => {
    assert.equal(
      addMigrationImport(
        schemaResultFilePath,
        './migrations/init.migration',
        'InitMigration',
      ),
      true,
    );
    assert.equal(
      addMigrationRegistration(schemaResultFilePath, 'schema', 'InitMigration'),
      true,
    );
    assert.equal(
      removeMigrationImport(
        schemaResultFilePath,
        './migrations/init.migration',
        'InitMigration',
      ),
      true,
    );
    assert.equal(
      removeMigrationRegistration(schemaResultFilePath, 'InitMigration'),
      true,
    );

    const expectedContent = fs.readFileSync(schemaSourceFilePath).toString();
    const actualContent = fs.readFileSync(schemaResultFilePath).toString();
    assert.equal(actualContent, expectedContent);
  });

  it('should write add table', () => {
    const migration = writeMigration('init', undefined, undefined, [
      {kind: 'add_table', table: 'User'}
    ]);
    expect(migration).toEqual(
      'import { MigrationDescription } from "@daita/core";\n' +
      '\n' +
      'export const InitMigration: MigrationDescription = {\n' +
      '    id: "init",\n' +
      '    steps: [\n' +
      '        { kind: "add_table", table: "User" }\n' +
      '    ]\n' +
      '};')
  });

  it('should write drop table', () => {
    const migration = writeMigration('init', 'first', undefined, [
      {kind: 'drop_table', table: 'User'}
    ]);
    expect(migration).toEqual(
      'import { MigrationDescription } from "@daita/core";\n' +
      '\n' +
      'export const InitMigration: MigrationDescription = {\n' +
      '    id: "init",\n' +
      '    after: "first",\n' +
      '    steps: [\n' +
      '        { kind: "drop_table", table: "User" }\n' +
      '    ]\n' +
      '};')
  });
});
