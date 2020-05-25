import { isSqlAlterTable } from '../ddl/alter-table/alter-table-query';
import { SqlAlterTableAdd } from '../ddl/alter-table/alter-table-add-query';
import { SqlAlterTableAddForeignKey } from '../ddl/alter-table/alter-table-add-foreign-key-query';
import { SqlAlterTableDropColumn } from '../ddl/alter-table/alter-table-drop-column-query';
import { SqlAlterTableAddColumn } from '../ddl/alter-table/alter-table-add-column-query';
import { SqlAlterTableDropConstraint } from '../ddl/alter-table/alter-table-drop-constraint-query';
import { SqlAlterTableDrop } from '../ddl/alter-table/alter-table-query-drop';
import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';

export interface AlterTableFormatterOptions<TFieldType> {
  columnKeyword: string; //"COLUMN";
  dropColumnKeyword: string; //"DROP COLUMN";
  dropConstraintKeyword: string; //"DROP CONSTRAINT";
  alterTableKeyword: string; //"ALTER TABLE";
  constraintKeyword: string; //"CONSTRAINT";
  addKeyword: string; //"ADD";
  foreignKeyKeyword: string; //"FOREIGN KEY";
  foreignKeyReferenceKeyword: string; //"REFERENCES";
}

export class AlterTableFormatter implements FormatterHandler {
  constructor(private options: AlterTableFormatterOptions<any>) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlAlterTable(param)) {
      const alterTable = param as SqlAlterTableAdd<any> & SqlAlterTableDrop;
      let sql = `${this.options.alterTableKeyword} ${formatter.format({ table: alterTable.alterTable }, ctx)}`;

      if (alterTable.add) {
        const add = alterTable.add as SqlAlterTableAddColumn<any> &
          SqlAlterTableAddForeignKey<string> &
          SqlAlterTableAddForeignKey<string[]>;
        sql += ` ${this.options.addKeyword}`;
        if (add.column) {
          sql += ` ${this.options.columnKeyword} ${formatter.format({ escape: add.column }, ctx)} ${formatter.format({fieldType: add.type}, ctx)}`;
        } else {
          if (add.constraint) {
            sql += ` ${this.options.constraintKeyword} ${formatter.format({ escape: add.constraint }, ctx)}`;
          }
          if (typeof add.foreignKey === 'string') {
            sql += ` ${this.options.foreignKeyKeyword} (${formatter.format({ escape: add.foreignKey }, ctx)})`;
          } else {
            sql += ` ${this.options.foreignKeyKeyword} (${add.foreignKey.map((key) =>
              formatter.format({ escape: key }, ctx),
            )})`;
          }
          sql += ` ${this.options.foreignKeyReferenceKeyword} ${formatter.format({ table: add.references.table }, ctx)}`;
          if (typeof add.references.primaryKeys === 'string') {
            sql += ` (${formatter.format({ escape: add.references.primaryKeys }, ctx)})`;
          } else {
            sql += ` (${add.references.primaryKeys.map((key) =>
              formatter.format({ escape: key }, ctx),
            )})`;
          }
        }
      } else {
        const drop = alterTable.drop as SqlAlterTableDropColumn &
          SqlAlterTableDropConstraint;
        if (drop.column) {
          sql += ` ${this.options.dropColumnKeyword} ${formatter.format({ escape: drop.column }, ctx)}`;
        } else {
          sql += ` ${this.options.dropConstraintKeyword} ${formatter.format({ escape: drop.constraint }, ctx)}`;
        }
      }

      return sql;
    }

    return null;
  }
}
