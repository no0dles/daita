import {
  MigrationDescription,
  RelationalAddTableFieldMigrationStep,
  RelationalAddTableMigrationStep,
  RelationalAddTablePrimaryKey,
} from '@daita/core';

export class UserMigration implements MigrationDescription {
  id = 'user';
  steps = [
    new RelationalAddTableMigrationStep('User'),
    new RelationalAddTableFieldMigrationStep('User', 'id', 'string', true),
    new RelationalAddTableFieldMigrationStep('User', 'name', 'string', true),
    new RelationalAddTablePrimaryKey('User', ['id']),
  ];
}
