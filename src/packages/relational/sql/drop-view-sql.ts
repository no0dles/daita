import { TableDescription } from './description';
import { isKind } from '../../common/utils';

export interface DropViewSql {
  dropView: TableDescription<any>;
  ifExists?: boolean;
}

export const isDropViewSql = (val: any): val is DropViewSql =>
  isKind<DropViewSql>(val, ['dropView']);
