import {PermissionBuilder} from '../../../permission';
import {User} from './models/user';
import {blogAdminRole} from './roles';

export const blogPermissions = new PermissionBuilder();

blogPermissions.push(User, {role: blogAdminRole, type: 'role', select: true});