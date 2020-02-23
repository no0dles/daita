import {Role} from './models/role';
import {RolePermission} from './models/role-permission';
import {User} from './models/user';
import {UserPermission} from './models/user-permission';
import {UserRole} from './models/user-role';
import {RelationalSchema} from '@daita/core';
import {Permission} from './models/permission';
import * as permissions from './permissions';
import {InitialMigration} from './migrations/20201519810-initial';

const schema = new RelationalSchema();

schema.table(User, {key: 'username'});
schema.table(UserRole, {key: ['userUsername', 'roleName']});
schema.table(UserPermission, {key: ['userUsername', 'permissionName']});
schema.table(Role, {key: 'name'});
schema.table(RolePermission, {key: ['roleName', 'permissionName']});
schema.table(Permission, {key: 'name'});

schema.permission(permissions);
schema.migration(InitialMigration);

export = schema;
