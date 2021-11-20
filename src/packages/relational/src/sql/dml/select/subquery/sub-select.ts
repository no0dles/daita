import { SelectSql } from '../select-sql';
import { SubSelectDescription } from './sub-select-description';

export function subSelect<T>(sql: SelectSql<T>): T {
  return (<SubSelectDescription<T>>{ subSelect: sql }) as any;
}
