import { SelectSql } from '../../dml/select/select-sql';
import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '@daita/common';

export interface CreateViewSql<T> {
  createView: TableDescription<T>;
  orReplace?: boolean;
  as: SelectSql<T>;
}

export const isCreateViewSql = (val: any): val is CreateViewSql<any> =>
  isKind<CreateViewSql<any>>(val, ['createView', 'as']);
