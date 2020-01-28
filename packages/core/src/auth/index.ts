import {TableInformation} from '../context/table-information';

export interface ContextUser {
  id: string;
  username: string;
  roles: string[]
  permissions: string[];
}

export function canInsert(user: ContextUser | null, table: TableInformation<any>) {

}