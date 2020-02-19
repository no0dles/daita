import { User } from './user';
import {FirstMigration, SecondMigration} from './user-migration';
import {Comment} from './comment';
import {RelationalSchema} from '../schema';

const testSchema = new RelationalSchema();

testSchema.table(User);
testSchema.table(Comment);
testSchema.migration(FirstMigration);
testSchema.migration(SecondMigration);

export = testSchema;