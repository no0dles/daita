import { TablePermission } from './table-permission';

export function comparePermissions(
  first: TablePermission<any>,
  second: TablePermission<any>,
) {
  return JSON.stringify(first) === JSON.stringify(second);
}
