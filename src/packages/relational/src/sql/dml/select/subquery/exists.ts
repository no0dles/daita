import { SelectSql } from '../select-sql';
import { ExistsDescription } from './exists-description';

export function exists(select: SelectSql<any>): ExistsDescription {
  return { exists: select };
}
