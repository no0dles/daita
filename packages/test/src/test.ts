import {
  MigrationDescription,
  RelationalAddTableFieldMigrationStep,
  RelationalAddTableForeignKey, RelationalAddTableMigrationStep,
  RelationalAddTablePrimaryKey, RelationalSchema,
} from '@daita/core';


export class User {
  id!: string;
  name!: string;
  count!: number | null;
  parentId!: string | null;
  parent!: User | null;
  admin!: boolean;
}

export class Comment {
  id!: string;
  text!: string;
  user!: User;
}

export class FirstMigration implements MigrationDescription {
  id = 'first';
  steps = [
    new RelationalAddTableMigrationStep('User'),
    new RelationalAddTablePrimaryKey('User', ['id']),
    new RelationalAddTableFieldMigrationStep('User', 'id', 'string', true),
    new RelationalAddTableFieldMigrationStep('User', 'name', 'string', true),
    new RelationalAddTableFieldMigrationStep('User', 'count', 'number', false),
    new RelationalAddTableFieldMigrationStep('User', 'parentId', 'string', false),
    new RelationalAddTableForeignKey('User', 'parent', ['parentId'], 'User', ['id']),
  ]
}

export class SecondMigration implements MigrationDescription {
  id = 'second';
  after = 'first';
  steps = [
    new RelationalAddTableFieldMigrationStep('User', 'admin', 'boolean', true),
    new RelationalAddTableMigrationStep('Comment'),
    new RelationalAddTablePrimaryKey('Comment', ['id']),
    new RelationalAddTableFieldMigrationStep('Comment', 'id', 'string', true),
    new RelationalAddTableFieldMigrationStep('Comment', 'text', 'string', true),
    new RelationalAddTableFieldMigrationStep('Comment', 'userId', 'string', true),
    new RelationalAddTableForeignKey('Comment', 'user', ['userId'], 'User', ['id']),
  ]
}

export const testConnectionString = 'postgres://postgres:postgres@localhost/daita-test';
export const testSchema = new RelationalSchema();

testSchema.table(User);
testSchema.table(Comment);
testSchema.migration(FirstMigration);
testSchema.migration(SecondMigration);