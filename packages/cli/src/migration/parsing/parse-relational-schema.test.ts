import { RelationalSchema } from '@daita/orm';
import { allow, authorized, all, table } from '@daita/relational';


export class BaseTable {
  createdDate!: Date;
  modifiedDate?: Date;
}

export class User extends BaseTable {
  id!: string;
  username!: string;
  password: string = '1234';
  lastLogin!: Date;
  userType = UserType.Local;
  userStatus!: UserStatus;
  admin = false;
}

export enum UserType {
  Local= 'local',
  Social = 'social'
}

export enum UserStatus {
  Unverified = 10,
  Verified = 20,
  Certified
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
  userId!: string;
  user!: User;
}

export class RolePermission extends BaseTable {
  roleName!: string;
  role!: Role;
  permissionName!: string;
  permission!: Permission;
}

export const userRules = [
  allow(authorized(), { select: all(), from: table(User) }),
];

const schema = new RelationalSchema();
schema.table(User, {
  indices: {
    username: {
      unique: true,
      columns: ['username']
    }
  },
  rules: userRules
});
schema.table(Role, {key: 'name', indices: { desc: ['description']}});
schema.table(Permission, {key: ['name']});
schema.table(UserRole, {key: ['roleName', 'userId']});
schema.table(RolePermission, {key: ['roleName', 'permissionName']});
