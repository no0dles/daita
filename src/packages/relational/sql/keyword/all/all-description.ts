import { TableAliasDescription } from '../../dml/select/table-alias-description';
import { TableDescription } from '../table/table-description';
import { isExactKind } from '../../../../common/utils/is-exact-kind';

export interface AllDescription<T> {
  all: { table?: TableAliasDescription<T> | TableDescription<T> };
}

export const isAllDescription = (val: any): val is AllDescription<any> =>
  isExactKind<AllDescription<any>>(val, ['all']);
