import { SelectSql } from '../../dml/select/select-sql';
import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '../../../../common/utils/is-kind';

export interface CreateViewSql<T> {
  createView: TableDescription<T>;
  orReplace?: boolean;
  as: SelectSql<T>;
}

export const isCreateViewSql = (val: any): val is CreateViewSql<any> =>
  isKind<CreateViewSql<any>>(val, ['createView', 'as']);
