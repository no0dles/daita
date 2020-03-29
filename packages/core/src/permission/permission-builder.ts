import {RelationalDataAdapter, RelationalTransactionAdapter} from '../adapter';
import {RelationalDataContext} from '../context/relational-data-context';
import {
  RelationalDeleteContext, RelationalInsertContext,
  RelationalSelectContext,
  RelationalTransactionContext, RelationalUpdateContext,
} from '../context';
import {DefaultConstructable} from '../constructable';
import {ContextUser} from '../auth';
import {MigrationSchema} from '../schema/migration-schema';
import {isSqlSchemaTable, SqlSchemaTable} from '../sql/sql-schema-table';
import {RelationalUpdateBuilder} from '../builder/relational-update-builder';
import {RelationalInsertBuilder} from '../builder/relational-insert-builder';
import {RelationalDeleteBuilder} from '../builder/relational-delete-builder';
import {getSqlTable} from '../builder/utils';
import {RelationalSelectBuilder} from '../builder/relational-select-builder';
import {TableInformation} from '../context/table-information';
import {SqlSelect, SqlSelectFrom} from '../sql/select';
import {TablePermission} from './table-permission';
import {isAnonymousPermission} from './anonymous-permission';
import {isRolePermission} from './role-permission';
import {isAuthorizedPermission} from './authorized-permission';
import {isPermissionPermission} from './permission-permission';
import {SqlUpdate, SqlUpdateResult} from '../sql/update';
import {SqlDelete, SqlDeleteResult} from '../sql/delete';
import {SqlInsert, SqlInsertResult} from '../sql/insert';
import {SqlExpression, SqlQuery, SqlTable} from '../sql';
import {isSqlSelect} from '../sql/select/sql-select';
import {isSqlUpdate} from '../sql/update/sql-update';
import {isSqlDelete} from '../sql/delete/sql-delete';
import {isSqlInsert} from '../sql/insert/sql-insert';
import {isSqlCompareExpression} from '../sql/expression/sql-compare-expression';
import {isSqlInExpression} from '../sql/expression/sql-in-expression';
import {isSqlAndExpression} from '../sql/expression/sql-and-expression';
import {isSqlOrExpression} from '../sql/expression/sql-or-expression';

function getTableIdentifier(type: TableInformation<any>): string {
  const table = getSqlTable(type);
  return tableIdentifier(table);
}

function tableIdentifier(table: SqlSchemaTable) {
  if (table.schema) {
    return `${table.schema}.${table.table}`;
  }
  return table.table;
}

function getTableIdentifierFrom(from: SqlSelectFrom | null | undefined) {
  if (!from) {
    return null;
  }
  if (typeof from === 'string') {
    return from;
  } else if (isSqlSchemaTable(from)) {
    if (from.schema) {
      return `${from.schema}.${from.table}`;
    }
    return from.table;
  } else {
    return null;
  }
}

export class SchemaPermissions {
  private permissions: { [key: string]: TablePermission<any>[] } = {};

  add<T>(table: TableInformation<T>, permissions: TablePermission<T>[]) {
    const identifier = getTableIdentifier(table);
    if (!this.permissions[identifier]) {
      this.permissions[identifier] = [];
    }
    this.permissions[identifier].push(...permissions);
  }

  sqlPermissions() {
    return new SqlPermissions(this.permissions);
  }

  userPermissions(user: ContextUser): UserPermissions {
    const userPermissions: { [key: string]: TablePermission<any>[] } = {};
    for (const key of Object.keys(this.permissions)) {
      const tablePermissions = this.permissions[key];
      userPermissions[key] = [];
      for (const tablePermission of tablePermissions) {
        if (isPermissionPermission(tablePermission)) {
          if (user.anonymous === false && user.permissions.indexOf(tablePermission.permission) !== -1) {
            userPermissions[key].push(tablePermission);
          }
        } else if (isRolePermission(tablePermission)) {
          if (user.anonymous === false && user.roles.indexOf(tablePermission.role) !== -1) {
            userPermissions[key].push(tablePermission);
          }
        } else if (user.anonymous && isAnonymousPermission(tablePermission)) {
          userPermissions[key].push(tablePermission);
        } else if (!user.anonymous && isAuthorizedPermission(tablePermission)) {
          userPermissions[key].push(tablePermission);
        }
      }
    }
    return new UserPermissions(userPermissions);
  }
}

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

    fail(expression, 'unknown expression');
  }

  private hasPermissionForTable(table: SqlSelect | SqlTable | null | undefined, filter: (perm: TablePermission<any>) => boolean): boolean {
    if (!table) {
      return true;
    }

    if (typeof table === 'string') {
      return this.hasPermissionForTableName(table, filter);
    } else if (isSqlSchemaTable(table)) {
      return this.hasPermissionForTableName(tableIdentifier(table), filter);
    } else if (isSqlSelect(table)) {
      return this.isSelectAuthorized(table);
    }

    fail(table, 'unknown table');
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
    }

    return false;
  }
}

export class UserPermissions {
  constructor(private permissions: { [key: string]: TablePermission<any>[] }) {
  }

  // tablePermissions(table: TableInformation<any>): TablePermissions {
  //   const identifier = getTableIdentifier(table);
  //   return new TablePermissions(this.permissions[identifier] || []);
  // }

  sqlPermissions() {
    return new SqlPermissions(this.permissions);
  }
}

// export class TablePermissions {
//   constructor(private permissions: TablePermission<any>[]) {
//   }
//
//   selectPermissions() {
//     return new TableSelectPermissions(this.permissions.filter(p => p.select));
//   }
//
//   updatePermissions() {
//     return new TableUpdatePermissions(this.permissions.filter(p => p.update));
//   }
//
//   deletePermissions() {
//     return new TableDeletePermissions(this.permissions.filter(p => p.delete));
//   }
//
//   insertPermissions() {
//     return new TableInsertPermissions(this.permissions.filter(p => p.insert));
//   }
// }

// export abstract class TableEvalPermissions<TQuery> {
//   constructor(private permissions: TablePermission<any>[]) {
//   }
//
//   isAuthorized(query: TQuery): boolean {
//     for (const permission of this.permissions) {
//       if (this.isValid(query, permission)) {
//         return true;
//       }
//     }
//
//     return false;
//   }
//
//   protected abstract isValid(query: TQuery, permission: TablePermission<any>): boolean;
// }

// export class TableSelectPermissions extends TableEvalPermissions<SqlSelect> {
//   protected isValid(query: SqlSelect, permission: TablePermission<any>): boolean {
//     if (!permission.select) {
//       return false;
//     }
//
//     if (permission.select === true) {
//       return true;
//     }
//
//     if (permission.select.skip !== null && permission.select.skip !== undefined) {
//       if (typeof permission.select.skip === 'number') {
//         if (permission.select.skip !== query.offset) {
//           throw new Error(`not authorized, skip`); //TODO
//         }
//       } else {
//         throw new Error('not impl');
//       }
//     }
//
//     return false;
//   }
// }
//
// export class TableUpdatePermissions extends TableEvalPermissions<SqlUpdate> {
//   protected isValid(query: SqlUpdate, permission: TablePermission<any>): boolean {
//     if (!permission.update) {
//       return false;
//     }
//
//     if (permission.update === true) {
//       return true;
//     }
//
//     return false;
//   }
// }
//
// export class TableDeletePermissions extends TableEvalPermissions<SqlDelete> {
//   protected isValid(query: SqlDelete, permission: TablePermission<any>): boolean {
//     if (!permission.delete) {
//       return false;
//     }
//
//     if (permission.delete === true) {
//       return true;
//     }
//
//     return false;
//   }
// }
//
// export class TableInsertPermissions extends TableEvalPermissions<SqlInsert> {
//   protected isValid(query: SqlInsert, permission: TablePermission<any>): boolean {
//     if (!permission.insert) {
//       return false;
//     }
//
//     if (permission.insert === true) {
//       return true;
//     }
//
//     return false;
//   }
// }

export class RelationalAuthSchemaContext implements RelationalDataContext {
  constructor(protected relationalDataAdapter: RelationalDataAdapter,
              protected schema: MigrationSchema,
              protected sqlPermissions: SqlPermissions) {
  }

  delete<T>(type: DefaultConstructable<T>): RelationalDeleteContext<T> {
    const permissions = this.sqlPermissions;
    class RelationalDeleteBuilderAuth extends RelationalDeleteBuilder<T> {
      protected async execute(): Promise<SqlDeleteResult> {
        if (!permissions.isDeleteAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }
    }

    const builder = new RelationalDeleteBuilderAuth(this.relationalDataAdapter, getSqlTable(type));
    return new RelationalDeleteContext(this.schema, type, builder);
  }

  insert<T>(type: DefaultConstructable<T>): RelationalInsertContext<T> {
    const permissions = this.sqlPermissions;
    class RelationalInsertBuilderAuth extends RelationalInsertBuilder<T> {
      protected async execute(): Promise<SqlInsertResult> {
        if (!permissions.isInsertAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }
    }

    const builder = new RelationalInsertBuilderAuth(this.relationalDataAdapter, getSqlTable(type));
    return new RelationalInsertContext(this.schema, type, builder);
  }

  select<T>(type: DefaultConstructable<T>): RelationalSelectContext<T> {
    const permissions = this.sqlPermissions;
    class RelationalSelectBuilderAuth extends RelationalSelectBuilder<T> {
      protected async execute(): Promise<T[]> {
        if (!permissions.isSelectAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }

      //TODO
      // first(): RelationalSelectFirstBuilder<T> {
      //   return super.first();
      // }
      // firstOrDefault(): RelationalSelectFirstOrDefaultBuilder<T> {
      //   return super.firstOrDefault();
      // }
      // count(): RelationalSelectFirstBuilder<{ count: number }> {
      //   return super.count();
      // }
    }

    const builder = new RelationalSelectBuilderAuth(this.relationalDataAdapter, getSqlTable(type));
    return new RelationalSelectContext(this.schema, type, builder);
  }

  update<T>(type: DefaultConstructable<T>): RelationalUpdateContext<T> {
    const permissions = this.sqlPermissions;
    class RelationalUpdateBuilderAuth extends RelationalUpdateBuilder<T> {
      protected async execute(): Promise<SqlUpdateResult> {
        if (!permissions.isUpdateAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }
    }

    const builder = new RelationalUpdateBuilderAuth(this.relationalDataAdapter, getSqlTable(type));
    return new RelationalUpdateContext<T>(this.schema, type, builder);
  }
}

export class RelationalAuthTransactionSchemaContext extends RelationalAuthSchemaContext implements RelationalTransactionContext {
  constructor(private relationalTransactionAdapter: RelationalTransactionAdapter,
              schema: MigrationSchema,
              sqlPermissions: SqlPermissions) {
    super(relationalTransactionAdapter, schema, sqlPermissions);
  }

  async transaction<T>(action: (trx: RelationalDataContext) => Promise<T>): Promise<T> {
    return await this.relationalTransactionAdapter.transaction<T>(async adapter => {
      return await action(new RelationalAuthSchemaContext(adapter, this.schema, this.sqlPermissions));
    });
  }
}

function fail(value: never, message: string): never {
  throw new Error(message);
}