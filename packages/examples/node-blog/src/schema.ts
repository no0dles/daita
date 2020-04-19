import {User} from './models/user';
import {Comment} from './models/comment';
import {FirstMigration} from './migrations/first';
import {SecondMigration} from './migrations/second';
import {RelationalSchema} from '@daita/core';
import {blogAdminRole} from './roles';

export const blogSchema = new RelationalSchema();

blogSchema.table(User);
blogSchema.table(Comment);

blogSchema.permission(User, {role: blogAdminRole, select: true});
blogSchema.permission(Comment, {role: blogAdminRole, select: true});

blogSchema.migration(FirstMigration);
blogSchema.migration(SecondMigration);
