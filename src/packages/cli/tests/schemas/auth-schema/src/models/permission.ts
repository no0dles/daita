import { Role } from './role';

export class Permission {
  name!: string;
}

export class RolePermission {
  role!: Role;
  roleName!: string;
  permission!: Permission;
  permissionName!: string;
}
