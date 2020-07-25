import { RelationalSchema } from '@daita/orm';
import { UserPool } from './models/user-pool';
import { UserPoolCors } from './models/user-pool-cors';
import { UserRefreshToken } from './models/user-refresh-token';
import { User } from './models/user';
import { UserReset } from './models/user-reset';
import { UserEmailVerify } from './models/user-email-verify';
import { Role } from './models/role';
import {InitMigration} from './migrations/202066161739-init';
import { UserRole } from './models/user-role';
import {SecondMigration} from './migrations/202066222440-second';
import {ThirdMigration} from './migrations/202060134311-third';
import {FourthMigration} from './migrations/202060173136-fourth';
import {FifthMigration} from './migrations/20206684348-fifth';

const schema = new RelationalSchema();

schema.table(User, { key: 'username' });
schema.table(UserPool);
schema.table(Role, {key: 'name'});
schema.table(UserRole, {key: ['userUsername', 'roleName']});
schema.table(UserReset, {key: 'code'});
schema.table(UserEmailVerify, {key: 'code'});
schema.table(UserPoolCors);
schema.table(UserRefreshToken, { key: ['token'] });
schema.migration(InitMigration);
schema.migration(SecondMigration);
schema.migration(ThirdMigration);
schema.migration(FourthMigration);
schema.migration(FifthMigration);

export = schema;
