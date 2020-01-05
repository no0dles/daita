import {Role} from './models/role';
import {RolePermission} from './models/role-permission';
import {User} from './models/user';
import {UserPermission} from './models/user-permission';
import {UserRole} from './models/user-role';
import {RelationalSchema} from '@daita/core';
import {Permission} from './models/permission';
import {InitMigration} from './migrations/2019114103938-init';

const schema = new RelationalSchema();

schema.table(User, {key: 'username'});
schema.table(UserRole, {key: ['userUsername', 'roleName']});
schema.table(UserPermission, {key: ['userUsername', 'permissionName']});
schema.table(Role, {key: 'name'});
schema.table(RolePermission, {key: ['roleName', 'permissionName']});
schema.table(Permission, {key: 'name'});
schema.migration(InitMigration);


export = schema;
