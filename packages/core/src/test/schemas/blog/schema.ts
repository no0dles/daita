import {RelationalSchema} from '../../../schema';
import {User} from './models/user';
import {Comment} from './models/comment';
import {FirstMigration} from './migrations/first';
import {SecondMigration} from './migrations/second';
import {blogPermissions} from './permissions';

export const blogSchema = new RelationalSchema();

blogSchema.table(User);
blogSchema.table(Comment);

blogSchema.migration(FirstMigration);
blogSchema.migration(SecondMigration);

blogSchema.permission(blogPermissions);