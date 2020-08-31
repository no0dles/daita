import { AppAuthorization } from './app-authorization';
import { Rule } from '../relational/permission/description';

export interface AppOptions {
  transactionTimeout?: number;
  cors?: boolean | string | string[];
  authorization?: AppAuthorization;
  rules: Rule[];
}
