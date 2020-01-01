import {Collection} from '@daita/core';
import {Role} from './role';

@Collection('permission')
export class Permission {
  name!: string;
}

export class RolePermission {
  role!: Role;
  permission!: Permission;
}
