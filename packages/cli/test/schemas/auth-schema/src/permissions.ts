import {PermissionBuilder} from '@daita/core';
import {User} from './models/user';

const permissions = new PermissionBuilder();

permissions.push(User, {
  role: 'admin',
  select: true,
  type: 'role',
});

export = permissions;