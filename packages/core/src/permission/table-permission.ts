import {AnonymousPermission} from './anonymous-permission';
import {AuthorizedPermission} from './authorized-permission';
import {RolePermission} from './role-permission';
import {PermissionPermission} from './permission-permission';

export type TablePermission<T> = RolePermission<T> | PermissionPermission<T> | AnonymousPermission<T> | AuthorizedPermission<T>;
