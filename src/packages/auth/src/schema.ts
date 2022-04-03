import { UserPool } from './models/user-pool';
import { UserPoolCors } from './models/user-pool-cors';
import { UserRefreshToken } from './models/user-refresh-token';
import { User } from './models/user';
import { UserReset } from './models/user-reset';
import { UserEmailVerify } from './models/user-email-verify';
import { Role } from './models/role';
import { UserRole } from './models/user-role';
import { UserToken } from './models/user-token';
import { RelationalSchema } from '@daita/orm';
import { UserPoolUser } from './models/user-pool-user';

export const authSchema = new RelationalSchema({
  name: 'auth',
});

authSchema.table(User, { key: 'username' });
authSchema.table(UserPool);
authSchema.table(Role, { key: ['name', 'userPoolId'] });
authSchema.table(UserRole, { key: ['userUsername', 'roleName'] });
authSchema.table(UserReset, { key: 'code' });
authSchema.table(UserEmailVerify, { key: 'code' });
authSchema.table(UserPoolCors, {
  indices: {
    url: { unique: true, columns: ['url', 'userPoolId'] },
  },
});
authSchema.table(UserRefreshToken, { key: ['token'] });
authSchema.table(UserToken, { key: ['token'] });
authSchema.table(UserPoolUser, { key: ['userPoolId', 'userUsername'] });
