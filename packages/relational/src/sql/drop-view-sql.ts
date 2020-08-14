import { TableDescription } from './description';

export interface DropViewSql {
  dropView: TableDescription<any>;
  ifExists?: boolean;
}
