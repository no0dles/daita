import { allow } from '@daita/relational';
import { field } from '@daita/relational';
import { authorized } from '@daita/relational';
import { UUID } from '@daita/relational';
import { RelationalSchema } from '@daita/orm';
import { table } from '@daita/relational';
import { join } from '@daita/relational';
import { equal } from '@daita/relational';
import { all } from '@daita/relational';
import { Json } from '@daita/relational';

export class BaseTable {
  createdDate!: Date;
  modifiedDate?: Date;
}

export class User extends BaseTable {
  id!: UUID;
  username!: string;
  password = '1234';
  lastLogin!: Date;
  userType = UserType.Local;
  userStatus!: UserStatus;
  admin = false;
  extra!: Json<any>;
  extraTyped!: Json<{ name: string }>;
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

export const userRules = [allow(authorized(), { select: all(), from: table(User) })];

const schema = new RelationalSchema('test');
schema.table(User, {
  indices: {
    username: {
      unique: true,
      columns: ['username'],
    },
  },
  columns: {
    password: {
      size: 64,
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
    join(RolePermission, equal(field(Role, 'name'), field(RolePermission, 'roleName'))),
  ],
});
schema.rules(userRules);
