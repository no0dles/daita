import {AnonymousPermission} from './anonymous-permission';
import {AuthorizedPermission} from './authorized-permission';
import {RolePermission} from './role-permission';

export type Permission<T> = RolePermission<T> | AnonymousPermission<T> | AuthorizedPermission<T>;
