import { AppAuthorization } from './app-authorization';
import { Rule } from '../relational/permission/description/rule';

export interface AppOptions {
  transactionTimeout?: number;
  cors?: boolean | string | string[];
  authorization: AppAuthorization | false;
  rules: Rule[];
}
