import {RelationalSchema} from '@daita/core';
import { User } from "./models/user";
import {FooMigration} from './src/migrations/202001212039-foo';

const schema = new RelationalSchema();

schema.table(User, {key: ['username'] });
schema.migration(FooMigration);

export = schema;
