import {User} from './models/user';
import {blogAdminRole} from './roles';
import {Comment} from './models/comment';
import {blogSchema} from './schema';

// export const blogPermissions = new PermissionBuilder(blogSchema);
//
// blogPermissions.push(User, {role: blogAdminRole, type: 'role', select: true});
// blogPermissions.push(Comment, {role: blogAdminRole, type: 'role', select: true});