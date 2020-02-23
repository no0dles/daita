import * as fs from 'fs';
import { assert } from 'chai';
import {
  addMigrationImport,
  addMigrationRegistration,
  removeMigrationImport,
  removeMigrationRegistration,
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
});
