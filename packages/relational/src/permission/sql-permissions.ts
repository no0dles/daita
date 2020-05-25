import { isSqlCompareExpression } from "../sql/dml/expression/sql-compare-expression";
import { isSqlDelete, SqlDelete } from "../sql/dml/delete/sql-delete";
import { isSqlSelect, SqlSelect } from "../sql/dml/select/sql-select";
import { isSqlOrExpression } from "../sql/dml/expression/sql-or-expression";
import { TablePermission } from "./table-permission";
import { SqlExpression } from "../sql/dml/expression";
import { isSqlUpdate, SqlUpdate } from "../sql/dml/update/sql-update";
import { isSqlInsert, SqlInsert } from "../sql/dml/insert/sql-insert";
import { SqlTable, SqlQuery } from "../sql";
import { isSqlInExpression } from "../sql/dml/expression/sql-in-expression";
import { isSqlAndExpression } from "../sql/dml/expression/sql-and-expression";
import { getSqlTableIdentifier, isSqlTable } from "../sql/sql-table";
import { failNever } from "@daita/common";
import { isSqlCreateTable, SqlCreateTableQuery } from "../sql/ddl/create-table/create-table-query";
import { SqlAlterTableAdd } from "../sql/ddl/alter-table/alter-table-add-query";
import { isSqlAlterTable, SqlAlterTableQuery } from "../sql/ddl/alter-table/alter-table-query";
import { isSqlDropTable, SqlDropTableQuery } from "../sql/ddl/drop-table/drop-table-query";
import { SqlAlterTableDrop } from "../sql/ddl/alter-table/alter-table-query-drop";

export class SqlPermissions {
  constructor(private permissions: { [key: string]: TablePermission<any>[] }) {

  }

  isSelectAuthorized(query: SqlSelect): boolean {
    if (!this.hasPermissionForTable(query.from, perm => perm.select === true)) {
      return false;
    }

    if (!this.isFilterAuthorized(query.where)) {
      return false;
    }

    return true;
  }

  isUpdateAuthorized(query: SqlUpdate): boolean {
    if (!this.hasPermissionForTable(query.update, perm => perm.update === true)) {
      return false;
    }

    if (!this.isFilterAuthorized(query.where)) {
      return false;
    }

    return true;
  }

  isDeleteAuthorized(query: SqlDelete): boolean {
    if (!this.hasPermissionForTable(query.delete, perm => perm.delete === true)) {
      return false;
    }

    if (!this.isFilterAuthorized(query.where)) {
      return false;
    }

    return true;
  }

  isInsertAuthorized(query: SqlInsert): boolean {
    if (!this.hasPermissionForTable(query.insert, perm => perm.insert === true)) {
      return false;
    }

    if (isSqlSelect(query.values) && !this.isSelectAuthorized(query.values)) {
      return false;
    }

    return true;
  }

  private isFilterAuthorized(expression: SqlExpression | null | undefined): boolean {
    if (!expression) {
      return true;
    }

    if (isSqlCompareExpression(expression)) {
      return true;
    } else if (isSqlInExpression(expression)) {
      return true;
    } else if (isSqlAndExpression(expression)) {
      for (const subExpression of expression.and) {
        if (!this.isFilterAuthorized(subExpression)) {
          return false;
        }
      }
      return true;
    } else if (isSqlOrExpression(expression)) {
      for (const subExpression of expression.or) {
        if (!this.isFilterAuthorized(subExpression)) {
          return false;
        }
      }
      return true;
    }

    failNever(expression, "unknown expression");
  }

  private hasPermissionForTable(table: SqlSelect | SqlTable | null | undefined, filter: (perm: TablePermission<any>) => boolean): boolean {
    if (!table) {
      return true;
    }

    if (isSqlTable(table)) {
      return this.hasPermissionForTableName(getSqlTableIdentifier(table), filter);
    } else if (isSqlSelect(table)) {
      return this.isSelectAuthorized(table);
    }

    failNever(table, "unknown table");
  }

  private hasPermissionForTableName(table: string, filter: (perm: TablePermission<any>) => boolean): boolean {
    for (const permission of this.permissions[table] || []) {
      if (filter(permission)) {
        return true;
      }
    }
    return false;
  }

  isQueryAuthorized(query: SqlQuery) {
    if (isSqlSelect(query)) {
      return this.isSelectAuthorized(query);
    } else if (isSqlUpdate(query)) {
      return this.isUpdateAuthorized(query);
    } else if (isSqlDelete(query)) {
      return this.isDeleteAuthorized(query);
    } else if (isSqlInsert(query)) {
      return this.isInsertAuthorized(query);
    } else if (isSqlCreateTable(query)) {
      return this.isSqlCreateTableAuthorized(query);
    } else if (isSqlDropTable(query)) {
      return this.isSqlDropTableAuthorized(query);
    } else if (isSqlAlterTable(query)) {
      return this.isSqlAlterTableAuthorized(query);
    }

    return false;
  }

  private isSqlCreateTableAuthorized(query: SqlCreateTableQuery<any>) {
    return false;
  }

  private isSqlDropTableAuthorized(query: SqlDropTableQuery) {
    return false;
  }

  private isSqlAlterTableAuthorized(query: SqlAlterTableAdd<any> | SqlAlterTableDrop) {
    return false;
  }
}
