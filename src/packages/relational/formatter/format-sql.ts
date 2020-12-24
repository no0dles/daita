import { isAllDescription } from '../sql/keyword/all/all-description';
import { isConcatDescription } from '../sql/function/string/concat/concat-description';
import { isGreaterThanDescription } from '../sql/operands/comparison/greater-than/greater-than-description';
import { isLowerThanDescription } from '../sql/operands/comparison/lower-than/lower-than-description';
import { isFieldDescription } from '../sql/keyword/field/field-description';
import { isEqualDescription } from '../sql/operands/comparison/equal/equal-description';
import { isCountDescription } from '../sql/function/aggregation/count/count-description';
import { isSubSelectDescription } from '../sql/dml/select/subquery/sub-select-description';
import { isTableDescription } from '../sql/keyword/table/table-description';

export function formatSql(sql: any, level = 0): string {
  const padding = ' '.repeat(level * 2);
  const nestedPadding = ' '.repeat((level + 1) * 2);
  if (typeof sql === 'number') {
    return sql.toString();
  }
  if (typeof sql === 'string') {
    return `'${sql}'`;
  }
  if (typeof sql === 'object' && sql instanceof Date) {
    return `new Date(${sql.getFullYear()}, ${sql.getMonth()}, ${sql.getDay()})`;
  }
  if (typeof sql === 'object' && sql instanceof Array) {
    return `[\n${sql.map((i) => `${nestedPadding}${formatSql(i, level + 1)}`).join(`,\n`)}\n${padding}]`;
  }
  if (isAllDescription(sql)) {
    if (sql.all.table) {
      return `all(${(<any>sql.all.table).table})`;
    } else {
      return `all()`;
    }
  }
  if (isConcatDescription(sql)) {
    return `concat(${sql.concat.map((c) => formatSql(c, level)).join(', ')})`;
  }
  if (isGreaterThanDescription(sql)) {
    return `greaterThan(${formatSql(sql.greaterThan.left, level)}, ${formatSql(sql.greaterThan.right, level)})`;
  }
  if (isLowerThanDescription(sql)) {
    return `lowerThan(${formatSql(sql.lowerThan.left, level)}, ${formatSql(sql.lowerThan.right, level)})`;
  }
  if (isFieldDescription(sql)) {
    return `field(${(<any>sql.field.table).table}, '${sql.field.key}')`;
  }
  if (isEqualDescription(sql)) {
    return `equal(${formatSql(sql.equal.left, level)}, ${formatSql(sql.equal.right, level)})`;
  }
  if (isCountDescription(sql)) {
    return `count()`;
  }
  if (isSubSelectDescription(sql)) {
    return `subSelect({\n${Object.keys(sql.subSelect)
      .map((k) => `${nestedPadding}${k}: ${formatSql((<any>sql.subSelect)[k], level + 1)},`)
      .join('\n')}\n${padding}})`;
  }

  if (isTableDescription(sql)) {
    return `table(${sql.table})`;
  } else if (typeof sql === 'object') {
    return `{\n${Object.keys(sql)
      .map((k) => `${nestedPadding}${k}: ${formatSql(sql[k], level + 1)},`)
      .join('\n')}\n${padding}}`;
  } else {
    return 'unknown';
  }
}
