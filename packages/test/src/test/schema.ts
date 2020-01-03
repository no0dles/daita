import { RelationalSchema } from '@daita/core';
import { UserMigration } from './user-migration';
import { User } from './user';

const schema = new RelationalSchema();

schema.table(User);
schema.migration(UserMigration);

export = schema;
