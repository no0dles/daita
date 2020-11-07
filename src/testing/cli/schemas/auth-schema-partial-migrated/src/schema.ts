import { User } from './models/user';
import { Permission, RolePermission } from './models/permission';
import { Role, UserRole } from './models/role';
import { InitMigration } from './migrations/202016152817-init';
import { RelationalSchema } from '../../../../../packages/orm/schema/relational-schema';

const schema = new RelationalSchema('auth-test');

schema.table(User, { key: ['username'] });
schema.table(UserRole, { key: ['roleName', 'userUsername'] });
schema.table(Role, { key: ['name'] });
schema.table(Permission, { key: 'name' });
schema.table(RolePermission, { key: ['permissionName', 'roleName'] });
schema.migration(InitMigration);

export = schema;
