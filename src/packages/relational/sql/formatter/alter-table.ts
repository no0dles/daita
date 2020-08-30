import { FormatHandle, Formatter, FormatType } from './formatter';
import {
  AlterTableAddColumnSql,
  AlterTableAddForeignKeySql,
  AlterTableDropColumnSql,
  AlterTableDropConstraintSql,
  isAlterTableAddColumnSql,
  isAlterTableAddForeignKeySql,
  isAlterTableDropColumnSql,
  isAlterTableDropConstraintSql,
} from '../alter-table-sql';
import { FormatContext } from './format-context';

export class AlterTableAddColumnFormatter
  implements FormatHandle<AlterTableAddColumnSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableAddColumnSql(param);
  }

  handle(
    param: AlterTableAddColumnSql,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `ALTER TABLE ${formatter.format(
      param.alterTable,
      ctx,
    )} ADD COLUMN ${ctx.escape(param.add.column)} ${ctx.getDataType(
      param.add.type,
    )}`;
  }
}

export class AlterTableDropColumnFormatter
  implements FormatHandle<AlterTableDropColumnSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableDropColumnSql(param);
  }

  handle(
    param: AlterTableDropColumnSql,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `ALTER TABLE ${formatter.format(
      param.alterTable,
      ctx,
    )} DROP COLUMN ${ctx.escape(param.drop.column)}`;
  }
}

export class AlterTableDropConstraintFormatter
  implements FormatHandle<AlterTableDropConstraintSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableDropConstraintSql(param);
  }

  handle(
    param: AlterTableDropConstraintSql,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `ALTER TABLE ${formatter.format(
      param.alterTable,
      ctx,
    )} DROP CONSTRAINT ${ctx.escape(param.drop.constraint)}`;
  }
}

export class AlterTableAddForeignKeyFormatter
  implements FormatHandle<AlterTableAddForeignKeySql<any>> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableAddForeignKeySql(param);
  }

  handle(
    param: AlterTableAddForeignKeySql<any>,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    let sql = `ALTER TABLE ${formatter.format(param.alterTable, ctx)} ADD`;
    if (param.add.constraint) {
      sql += ` CONSTRAINT ${ctx.escape(param.add.constraint)}`;
    }
    sql += ` FOREIGN KEY (${this.formatKeys(param.add.foreignKey, ctx)})`;
    sql += ` REFERENCES ${formatter.format(
      param.add.references.table,
      ctx,
    )} (${this.formatKeys(param.add.references.primaryKeys, ctx)})`;
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
