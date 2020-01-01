import {
  RelationalAddTableFieldMigrationStep,
  RelationalAddTableForeignKey, RelationalAddTableMigrationStep,
  RelationalAddTablePrimaryKey,
} from '../../../src/migration/steps';

export class InitMigration {
  id = 'init';
  steps = [
    new RelationalAddTableMigrationStep('User'),
    new RelationalAddTableFieldMigrationStep('User', 'username', 'string', true, null),
    new RelationalAddTableFieldMigrationStep('User', 'firstName', 'string', false, null),
    new RelationalAddTableFieldMigrationStep('User', 'lastName', 'string', false, null),
    new RelationalAddTableFieldMigrationStep('User', 'password', 'string', true, null),
    new RelationalAddTableFieldMigrationStep('User', 'email', 'string', true, null),
    new RelationalAddTablePrimaryKey('User', ['username']),
    new RelationalAddTableMigrationStep('UserRole'),
    new RelationalAddTableFieldMigrationStep('UserRole', 'userUsername', 'string', true, null),
    new RelationalAddTableFieldMigrationStep('UserRole', 'roleName', 'string', true, null),
    new RelationalAddTablePrimaryKey('UserRole', ['userUsername', 'roleName']),
    new RelationalAddTableForeignKey('UserRole', 'user', ['userUsername'], 'User', ['username']),
    new RelationalAddTableForeignKey('UserRole', 'role', ['roleName'], 'Role', ['name']),
    new RelationalAddTableMigrationStep('UserPermission'),
    new RelationalAddTableFieldMigrationStep('UserPermission', 'permissionName', 'string', true, null),
    new RelationalAddTableFieldMigrationStep('UserPermission', 'userUsername', 'string', true, null),
    new RelationalAddTablePrimaryKey('UserPermission', ['userUsername', 'permissionName']),
    new RelationalAddTableForeignKey('UserPermission', 'permission', ['permissionName'], 'Permission', ['name']),
    new RelationalAddTableForeignKey('UserPermission', 'user', ['userUsername'], 'User', ['username']),
    new RelationalAddTableMigrationStep('Role'),
    new RelationalAddTableFieldMigrationStep('Role', 'name', 'string', true, null),
    new RelationalAddTablePrimaryKey('Role', ['name']),
    new RelationalAddTableMigrationStep('RolePermission'),
    new RelationalAddTableFieldMigrationStep('RolePermission', 'permissionName', 'string', true, null),
    new RelationalAddTableFieldMigrationStep('RolePermission', 'roleName', 'string', true, null),
    new RelationalAddTablePrimaryKey('RolePermission', ['roleName', 'permissionName']),
    new RelationalAddTableForeignKey('RolePermission', 'permission', ['permissionName'], 'Permission', ['name']),
    new RelationalAddTableForeignKey('RolePermission', 'role', ['roleName'], 'Role', ['name']),
    new RelationalAddTableMigrationStep('Permission'),
    new RelationalAddTableFieldMigrationStep('Permission', 'name', 'string', true, null),
    new RelationalAddTablePrimaryKey('Permission', ['name']),
  ]
}
