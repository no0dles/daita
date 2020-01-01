import * as fs from 'fs';
import {assert} from 'chai';
import {
  addMigrationRegistration,
  addMigrationImport,
  removeMigrationImport,
  removeMigrationRegistration,
} from './write-migration';

describe('write-migration', () => {
  const schemaSourceFilePath = `${process.cwd()}/test/schema/schema.source.ts`;
  const schemaResultFilePath = `${process.cwd()}/test/schema/schema.result.ts`;
  const schemaExceptedFilePath = `${process.cwd()}/test/schema/schema.ts`;

  beforeEach(() => {
    if (fs.existsSync(schemaResultFilePath)) {
      fs.unlinkSync(schemaResultFilePath);
    }
    fs.copyFileSync(schemaSourceFilePath, schemaResultFilePath);
  });

  it('should add import and registration', () => {
    assert.equal(addMigrationImport(schemaResultFilePath, './migrations/init.migration', 'InitMigration'), true);
    assert.equal(addMigrationRegistration(schemaResultFilePath, 'schema', 'InitMigration'), true);

    const expectedContent = fs.readFileSync(schemaExceptedFilePath).toString();
    const actualContent = fs.readFileSync(schemaResultFilePath).toString();
    assert.equal(expectedContent, actualContent);
  });

  it('should add import, registration and undo', () => {
    assert.equal(addMigrationImport(schemaResultFilePath, './migrations/init.migration', 'InitMigration'), true);
    assert.equal(addMigrationRegistration(schemaResultFilePath, 'schema', 'InitMigration'), true);
    assert.equal(removeMigrationImport(schemaResultFilePath, './migrations/init.migration', 'InitMigration'), true);
    assert.equal(removeMigrationRegistration(schemaResultFilePath, 'InitMigration'), true);


    const expectedContent = fs.readFileSync(schemaSourceFilePath).toString();
    const actualContent = fs.readFileSync(schemaResultFilePath).toString();
    assert.equal(actualContent, expectedContent);
  });
});
