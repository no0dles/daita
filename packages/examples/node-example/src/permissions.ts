import {User} from './models/user';
import {PermissionBuilder} from '@daita/core';

const permissions = new PermissionBuilder();

permissions.push(User, {type: 'role', role: 'admin', select: true});
permissions.push(User, {
  type: 'role',
  role: 'admin',
  select: {
    fields: ['username'],
    where: {
      username: {$ne: 'admin'},
    },
    limit: {$lt: 100},
  },
});

export = permissions;