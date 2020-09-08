import { User } from './models/user';
import { Permission, RolePermission } from './models/permission';
import { Role, UserRole } from './models/role';
import { RelationalSchema } from '../../../../../orm/schema';

const schema = new RelationalSchema('auth-test');

schema.table(User, { key: ['username'] });
schema.table(UserRole, { key: ['roleName', 'userUsername'] });
schema.table(Role, { key: ['name'] });
schema.table(Permission, { key: 'name' });
schema.table(RolePermission, { key: ['permissionName', 'roleName'] });

export = schema;
