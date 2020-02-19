import {TableInformation} from '../context/table-information';

export interface ContextUser {
  id: string;
  username: string;
  roles: string[]
  claims: string[];
}