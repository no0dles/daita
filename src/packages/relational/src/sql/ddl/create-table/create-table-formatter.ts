import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { CreateTableSql, isCreateTableSql } from './create-table-sql';
import { FormatContext } from '../../../formatter/format-context';

export class CreateTableFormatter implements FormatHandle<CreateTableSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isCreateTableSql(param);
  }

  handle(param: CreateTableSql, ctx: FormatContext, formatter: Formatter): string {
    let sql = 'CREATE TABLE';
    if (param.ifNotExists) {
      sql += ' IF NOT EXISTS';
    }
    sql += ` ${formatter.format(param.createTable, ctx)}`;
    sql += ` (${param.columns
      .map((col) => {
        let fieldSql = `${ctx.escape(col.name)} ${ctx.getDataType({ type: col.type, size: col.size })}`;
        if (col.notNull) {
          fieldSql += ` NOT NULL`;
        }
        return fieldSql;
      })
      .join(', ')}`;

    const primaryKeys = param.columns.filter((col) => col.primaryKey).map((col) => ctx.escape(col.name));

    if (primaryKeys.length > 0) {
      sql += `, PRIMARY KEY (${primaryKeys.join(', ')})`;
    }

    if (param.foreignKey) {
      for (const constraintName of Object.keys(param.foreignKey)) {
        const constraint = param.foreignKey[constraintName];
        sql += `, CONSTRAINT ${ctx.escape(constraintName)} FOREIGN KEY (${this.formatKeys(
          constraint.key,
          ctx,
        )}) REFERENCES ${formatter.format(constraint.references.table, ctx)} (${this.formatKeys(
          constraint.references.primaryKey,
          ctx,
        )})`;
        if (constraint.onDelete) {
          sql += ` ON DELETE ${constraint.onDelete}`;
        }
        if (constraint.onUpdate) {
          sql += ` ON UPDATE ${constraint.onUpdate}`;
        }
      }
    }

    sql += ')';

    return sql;
  }

  private formatKeys(key: string[] | string, ctx: FormatContext) {
    if (key instanceof Array) {
      return key.map((key) => ctx.escape(key)).join(', ');
    } else {
      return ctx.escape(key);
    }
  }
}
