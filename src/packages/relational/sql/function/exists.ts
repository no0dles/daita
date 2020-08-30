import { SelectSql } from '../select-sql';
import { ExistsDescription } from '../description/exists';

export function exists(select: SelectSql<any>): ExistsDescription {
  return { exists: select };
}
