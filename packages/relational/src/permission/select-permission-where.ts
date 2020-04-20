import { WherePermission } from './where-permission';

export type SelectPermissionWhere<T> = {
  [P in keyof T]?: WherePermission<T[P]>;
};
