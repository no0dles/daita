import {Role} from './models/role';
import {RolePermission} from './models/role-permission';
import {User} from './models/user';
import {UserPermission} from './models/user-permission';
import {UserRole} from './models/user-role';
import {RelationalSchema, TablePermission} from '@daita/core';
import {Permission} from './models/permission';
import {InitMigration} from './migrations/2019114103938-init';
import {BaseTable} from './models/base-table';
import {TableRule} from '@daita/core/dist/schema/schema';

const schema = new RelationalSchema();

schema.table(User, {key: 'username'});
schema.table(UserRole, {key: ['userUsername', 'roleName']});
schema.table(UserPermission, {key: ['userUsername', 'permissionName']});
schema.table(Role, {key: 'name'});
schema.table(RolePermission, {key: ['roleName', 'permissionName']});
schema.table(Permission, {key: 'name'});
schema.migration(InitMigration);

schema.rule(User, {
  conditions: {
    email: {$regex: /[a-zA-Z0-9-_]+\@[a-zA-Z0-9-_]+.[a-zA-Z0-9]+/},
  },
});

const generalOptions: TableRule<BaseTable> = {
  update: {
    modifiedUser: schema.constants.username,
    modifiedDate: schema.constants.now,
  },
  insert: {
    createdUser: schema.constants.username,
    createdDate: schema.constants.now,
  },
};

schema.rule(Permission, generalOptions);
schema.rule(Role, generalOptions);
schema.rule(RolePermission, generalOptions);
schema.rule(UserPermission, generalOptions);
schema.rule(UserRole, generalOptions);

schema.permission(User, {
  anonymous: true,
  insert: true
});

schema.permission(User, {
  authorized: true,
  update: {
    where: {
      username: schema.constants.username,
    },
  },
  select: {
    deniedFields: ['password'],
    limit: {$eq: 12, $in: [10, 20, 30]},
    skip: {$gte: 12},
    where: {
      username: schema.constants.username,
    },
  }
});


schema.permission(User, {
  roles: ['admin'],
  insert: true,
  update: {
    allowedFields: ['password'],
  },
  delete: true,
});

//where (insert, select) required, notAllowed, allowed, conditions
//skip, limit, sort
//select fields allowed, notAllowed
//set allowed, notAllowed, conditions
//insert required, allowed, notAllowed, conditions
//conditions eq, neq, gt, gte, lt, lte, $or, $and
//constants user, id, email, now, (update: oldData, newData)

export = schema;
