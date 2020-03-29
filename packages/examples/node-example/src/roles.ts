import {CanManagePermissions, CanManageRoles, CanManageUsers, CanViewPermissions, CanViewRoles} from './permissions';

export const roles = {
  admin: {
    permissions: [CanManageRoles, CanManageUsers, CanManagePermissions],
  },
  manager: {
    permissions: [CanManageUsers, CanViewRoles, CanViewPermissions],
  },
};