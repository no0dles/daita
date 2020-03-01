import {ContextUser} from '../../../auth';
import {blogAdminRole, blogViewerRole} from './roles';

export const blogAdminUser: ContextUser = {id: 'a', username: 'admin', roles: [blogAdminRole], claims: []};
export const blogViewUser: ContextUser = {id: 'b', username: 'viewer', roles: [blogViewerRole], claims: []};