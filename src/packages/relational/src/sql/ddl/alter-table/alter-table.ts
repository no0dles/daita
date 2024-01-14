import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import {
  AlterTableAddColumnSql,
  AlterTableAddForeignKeySql,
  AlterTableAddPrimaryKeySql,
  AlterTableDropColumnSql,
  AlterTableDropConstraintSql,
  AlterTableRenameSql,
  isAlterTableAddColumnSql,
  isAlterTableAddForeignKeySql,
  isAlterTableAddPrimaryKeySql,
  isAlterTableDropColumnSql,
  isAlterTableDropConstraintSql,
  isAlterTableRenameSql,
} from './alter-table-sql';
import { FormatContext } from '../../../formatter/format-context';

export class AlterTableAddColumnFormatter implements FormatHandle<AlterTableAddColumnSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableAddColumnSql(param);
  }

  handle(param: AlterTableAddColumnSql, ctx: FormatContext, formatter: Formatter): string {
    let sql = `ALTER TABLE ${formatter.format(param.alterTable, ctx)} ADD COLUMN ${ctx.escape(param.add.column)} ${
      param.add.type
    }`;

    if (param.add.notNull) {
      sql += ' NOT NULL';
    }

    if (param.add.defaultValue) {
      sql += ` DEFAULT ${param.add.defaultValue}`;
    }

    return sql;
  }
}

export class AlterTableRenameFormatter implements FormatHandle<AlterTableRenameSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableRenameSql(param);
  }

  handle(param: AlterTableRenameSql, ctx: FormatContext, formatter: Formatter): string {
    return `ALTER TABLE ${formatter.format(param.alterTable, ctx)} RENAME TO ${ctx.escape(param.renameTo)}`;
  }
}

export class AlterTableDropColumnFormatter implements FormatHandle<AlterTableDropColumnSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableDropColumnSql(param);
  }

  handle(param: AlterTableDropColumnSql, ctx: FormatContext, formatter: Formatter): string {
    return `ALTER TABLE ${formatter.format(param.alterTable, ctx)} DROP COLUMN ${ctx.escape(param.drop.column)}`;
  }
}

export class AlterTableDropConstraintFormatter implements FormatHandle<AlterTableDropConstraintSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableDropConstraintSql(param);
  }

  handle(param: AlterTableDropConstraintSql, ctx: FormatContext, formatter: Formatter): string {
    return `ALTER TABLE ${formatter.format(param.alterTable, ctx)} DROP CONSTRAINT ${ctx.escape(
      param.drop.constraint,
    )}`;
  }
}

export class AlterTableAddForeignKeyFormatter implements FormatHandle<AlterTableAddForeignKeySql<any>> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableAddForeignKeySql(param);
  }

  handle(param: AlterTableAddForeignKeySql<any>, ctx: FormatContext, formatter: Formatter): string {
    let sql = `ALTER TABLE ${formatter.format(param.alterTable, ctx)} ADD`;
    if (param.add.constraint) {
      sql += ` CONSTRAINT ${ctx.escape(param.add.constraint)}`;
    }
    sql += ` FOREIGN KEY (${this.formatKeys(param.add.foreignKey, ctx)})`;
    sql += ` REFERENCES ${formatter.format(param.add.references.table, ctx)} (${this.formatKeys(
      param.add.references.primaryKeys,
      ctx,
    )})`;
    if (param.add.onDelete) {
      sql += ` ON DELETE ${param.add.onDelete}`;
    }
    if (param.add.onUpdate) {
      sql += ` ON UPDATE ${param.add.onUpdate}`;
    }
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

export class AlterTableAddPrimaryKeyFormatter implements FormatHandle<AlterTableAddPrimaryKeySql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isAlterTableAddPrimaryKeySql(param);
  }

  handle(param: AlterTableAddPrimaryKeySql, ctx: FormatContext, formatter: Formatter): string {
    return `ALTER TABLE ${formatter.format(param.alterTable, ctx)} ADD PRIMARY KEY (${this.formatKeys(
      param.add.primaryKey,
      ctx,
    )})`;
  }

  private formatKeys(key: string[] | string, ctx: FormatContext) {
    if (key instanceof Array) {
      return key.map((key) => ctx.escape(key)).join(', ');
    } else {
      return ctx.escape(key);
    }
  }
}
