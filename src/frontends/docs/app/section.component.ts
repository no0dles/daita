import { Component, Input } from '@angular/core';
import { Db, Section } from './section';
import { isTableDescription } from '../../../packages/relational/sql/keyword/table/table-description';
import { isAllDescription } from '../../../packages/relational/sql/keyword/all/all-description';
import { isFieldDescription } from '../../../packages/relational/sql/keyword/field/field-description';
import { isSubSelectDescription } from '../../../packages/relational/sql/dml/select/subquery/sub-select-description';
import { isEqualDescription } from '../../../packages/relational/sql/operands/comparison/equal/equal-description';
import { isCountDescription } from '../../../packages/relational/sql/function/aggregation/count/count-description';
import { isGreaterThanDescription } from '../../../packages/relational/sql/operands/comparison/greater-than/greater-than-description';
import { isLowerThanDescription } from '../../../packages/relational/sql/operands/comparison/lower-than/lower-than-description';
import { mariadbFormatter } from '../../../packages/mariadb-adapter/formatter/mariadb-formatter';
import { MariadbFormatContext } from '../../../packages/mariadb-adapter/formatter/mariadb-format-context';
import { postgresFormatter } from '../../../packages/pg-adapter/formatters/postgres-formatter';
import { PostgresFormatContext } from '../../../packages/pg-adapter/adapter/postgres-format-context';
import { sqliteFormatter } from '../../../packages/sqlite-adapter/formatter/sqlite-formatter';
import { SqliteFormatContext } from '../../../packages/sqlite-adapter/formatter/sqlite-format-context';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
})
export class SectionComponent {
  @Input()
  section!: Section;

  @Input()
  level!: number;

  sqlFormat(db: Db, sql: any) {
    if (db === 'mariadb') {
      return mariadbFormatter.format(sql, new MariadbFormatContext());
    } else if (db === 'postgres') {
      return postgresFormatter.format(sql, new PostgresFormatContext());
    } else if (db === 'sqlite') {
      return sqliteFormatter.format(sql, new SqliteFormatContext());
    }
  }

  format(sql: any, level = 0): string {
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
      return `[\n${sql.map((i) => `${nestedPadding}${this.format(i, level + 1)}`).join(`,\n`)}\n${padding}]`;
    }
    if (isAllDescription(sql)) {
      if (sql.all.table) {
        return `all(${(<any>sql.all.table).table})`;
      } else {
        return `all()`;
      }
    }
    if (isGreaterThanDescription(sql)) {
      return `greaterThan(${this.format(sql.greaterThan.left, level)}, ${this.format(sql.greaterThan.right, level)})`;
    }
    if (isLowerThanDescription(sql)) {
      return `lowerThan(${this.format(sql.lowerThan.left, level)}, ${this.format(sql.lowerThan.right, level)})`;
    }
    if (isFieldDescription(sql)) {
      return `field(${(<any>sql.field.table).table}, '${sql.field.key}')`;
    }
    if (isEqualDescription(sql)) {
      return `equal(${this.format(sql.equal.left, level)}, ${this.format(sql.equal.right, level)})`;
    }
    if (isCountDescription(sql)) {
      return `count()`;
    }
    if (isSubSelectDescription(sql)) {
      return `subSelect({\n${Object.keys(sql.subSelect)
        .map((k) => `${nestedPadding}${k}: ${this.format((<any>sql.subSelect)[k], level + 1)},`)
        .join('\n')}\n${padding}})`;
    }

    if (isTableDescription(sql)) {
      return `table(${sql.table})`;
    } else if (typeof sql === 'object') {
      return `{\n${Object.keys(sql)
        .map((k) => `${nestedPadding}${k}: ${this.format(sql[k], level + 1)},`)
        .join('\n')}\n${padding}}`;
    } else {
      return 'unknown';
    }
  }
}
