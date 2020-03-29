import {Role, RolePermissions} from './models/role';
import {RolePermission, RolePermissionPermissions} from './models/role-permission';
import {User, UserPermissions} from './models/user';
import {UserPermission, UserPermissionPermissions} from './models/user-permission';
import {UserRole, UserRolePermissions} from './models/user-role';
import {RelationalSchema} from '@daita/core';
import {Permission, PermissionPermissions} from './models/permission';
import {InitialMigration} from './migrations/20201519810-initial';

const schema = new RelationalSchema();

schema.table(User, {key: 'username', permissions: UserPermissions});
schema.table(UserRole, {key: ['userUsername', 'roleName'], permissions: UserRolePermissions});
schema.table(UserPermission, {key: ['userUsername', 'permissionName'], permissions: UserPermissionPermissions});
schema.table(Role, {key: 'name', permissions: RolePermissions});
schema.table(RolePermission, {key: ['roleName', 'permissionName'], permissions: RolePermissionPermissions});
schema.table(Permission, {key: 'name', permissions: PermissionPermissions});

schema.migration(InitialMigration);

export = schema;
