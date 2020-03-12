import {PermissionBuilder} from '../../../permission';
import {User} from './models/user';
import {blogAdminRole} from './roles';
import {Comment} from './models/comment';

export const blogPermissions = new PermissionBuilder();

blogPermissions.push(User, {role: blogAdminRole, type: 'role', select: true});
blogPermissions.push(Comment, {role: blogAdminRole, type: 'role', select: true});