import { allow, authorized } from '../../../relational/permission/function';
import {
  all,
  equal,
  field,
  join,
  table,
} from '../../../relational/sql/function';
import { UUID } from '../../../relational/types';
import { RelationalSchema } from '../../../orm/schema';

export class BaseTable {
  createdDate!: Date;
  modifiedDate?: Date;
}

export class User extends BaseTable {
  id!: UUID;
  username!: string;
  password: string = '1234';
  lastLogin!: Date;
  userType = UserType.Local;
  userStatus!: UserStatus;
  admin = false;
}

export enum UserType {
  Local = 'local',
  Social = 'social',
}

export enum UserStatus {
  Unverified = 10,
  Verified = 20,
  Certified,
}

export class Role extends BaseTable {
  name!: string;
  description: string | null = null;
  parentRole?: Role;
}

export class Permission extends BaseTable {
  name!: string;
}

export class UserRole extends BaseTable {
  roleName!: string;
  role!: Role;
  userId!: UUID;
  user!: User;
}

export class RolePermission extends BaseTable {
  roleName!: string;
  role!: Role;
  permissionName!: string;
  permission!: Permission;
}

export class UserPermissions {
  username!: string;
  permissionName!: string;
}

export const userRules = [
  allow(authorized(), { select: all(), from: table(User) }),
];

const schema = new RelationalSchema('test');
schema.table(User, {
  indices: {
    username: {
      unique: true,
      columns: ['username'],
    },
  },
});
schema.table(Role, { key: 'name', indices: { desc: ['description'] } });
schema.table(Permission, { key: ['name'] });
schema.table(UserRole, { key: ['roleName', 'userId'] });
schema.table(RolePermission, { key: ['roleName', 'permissionName'] });
schema.view(UserPermissions, {
  select: {
    username: field(User, 'username'),
    permissionName: field(RolePermission, 'permissionName'),
  },
  from: table(User),
  join: [
    join(UserRole, equal(field(User, 'id'), field(UserRole, 'userId'))),
    join(Role, equal(field(Role, 'name'), field(UserRole, 'roleName'))),
    join(
      RolePermission,
      equal(field(Role, 'name'), field(RolePermission, 'roleName')),
    ),
  ],
});
schema.rules(userRules);
