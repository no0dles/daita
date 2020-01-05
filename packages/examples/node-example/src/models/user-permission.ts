import {Permission} from './permission';
import {User} from './user';

export class UserPermission {
  permission!: Permission;
  permissionName!: string;
  user!: User;
  userUsername!: string;
}
