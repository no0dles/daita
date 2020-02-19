import {RelationalSchema} from '@daita/core';
import { User } from "./models/user";
import {Permission, RolePermission} from './models/permission';
import {Role, UserRole} from './models/role';
import * as permissions from './permissions';

const schema = new RelationalSchema();

schema.table(User, {key: ['username']});
schema.table(UserRole, {key: ['roleName', 'userUsername']});
schema.table(Role, {key: ['name']});
schema.table(Permission, {key: 'name'});
schema.table(RolePermission, {key: ['permissionName', 'roleName']});

schema.permission(permissions);

export = schema;
