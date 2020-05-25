import * as fs from 'fs';
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
    expect(
      addMigrationImport(
        schemaResultFilePath,
        './migrations/init.migration',
        'InitMigration',
      ),
    ).toBeTruthy();
    expect(
      addMigrationRegistration(schemaResultFilePath, 'schema', 'InitMigration'),
    ).toBeTruthy();

    const expectedContent = fs.readFileSync(schemaExceptedFilePath).toString();
    const actualContent = fs.readFileSync(schemaResultFilePath).toString();
    expect(expectedContent).toEqual(actualContent);
  });

  it('should add import, registration and undo', () => {
    expect(
      addMigrationImport(
        schemaResultFilePath,
        './migrations/init.migration',
        'InitMigration',
      )
    ).toBeTruthy();
    expect(
      addMigrationRegistration(schemaResultFilePath, 'schema', 'InitMigration')
    ).toBeTruthy();
    expect(
      removeMigrationImport(
        schemaResultFilePath,
        './migrations/init.migration',
        'InitMigration',
      )
    ).toBeTruthy();
    expect(
      removeMigrationRegistration(schemaResultFilePath, 'InitMigration')
    ).toBeTruthy();

    const expectedContent = fs.readFileSync(schemaSourceFilePath).toString();
    const actualContent = fs.readFileSync(schemaResultFilePath).toString();
    expect(actualContent).toEqual(expectedContent);
  });

  it('should write add table', () => {
    const migration = writeMigration('init', undefined, undefined, [
      {kind: 'add_table', table: 'User'},
    ]);
    expect(migration).toEqual(
      'import { MigrationDescription } from "@daita/orm";\n' +
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
      {kind: 'drop_table', table: 'User'},
    ]);
    expect(migration).toEqual(
      'import { MigrationDescription } from "@daita/orm";\n' +
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
