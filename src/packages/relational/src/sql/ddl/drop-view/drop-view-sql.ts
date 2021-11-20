import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '@daita/common/utils/is-kind';

export interface DropViewSql {
  dropView: TableDescription<any>;
  ifExists?: boolean;
}

export const isDropViewSql = (val: any): val is DropViewSql => isKind<DropViewSql>(val, ['dropView']);
