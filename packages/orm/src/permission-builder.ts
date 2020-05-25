import {
  comparePermissions,
  getSqlTableIdentifier, isAnonymousPermission, isAuthorizedPermission, isPermissionPermission, isRolePermission,
  RelationalDataAdapter,
  RelationalDeleteBuilder,
  RelationalInsertBuilder,
  RelationalSelectBuilder, RelationalSelectFirstBuilder, RelationalTransactionAdapter, RelationalUpdateBuilder,
  SqlDeleteResult,
  SqlInsertResult,
  SqlPermissions, SqlUpdateResult,
  TableInformation,
  TablePermission
} from "@daita/relational";
import {
  RelationalDataContext,
  RelationalDeleteContext,
  RelationalInsertContext,
  RelationalSelectContext, RelationalTransactionContext, RelationalUpdateContext
} from "./context";
import { RelationalSchemaDescription } from "./schema/description/relational-schema-description";
import { ContextUser } from "./auth";

export class SchemaPermissions {
  permissions: { [key: string]: TablePermission<any>[] } = {};

  add<T>(table: TableInformation<T>, permissions: TablePermission<T>[]) {
    const identifier = getSqlTableIdentifier(table);
    if (!this.permissions[identifier]) {
      this.permissions[identifier] = [];
    }
    this.permissions[identifier].push(...permissions);
  }

  remove<T>(table: TableInformation<T>, permissions: TablePermission<T>[]) {
    const identifier = getSqlTableIdentifier(table);
    const currentPermissions = this.permissions[identifier];
    for (const permission of permissions) {
      for (let i = 0; i < currentPermissions.length; i++) {
        if (comparePermissions(permission, currentPermissions[i])) {
          currentPermissions.splice(i, 1);
          break;
        }
      }
    }
  }

  tablePermissions<T>(table: TableInformation<T>) {
    const identifier = getSqlTableIdentifier(table);
    return this.permissions[identifier] || [];
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

export class UserPermissions {
  constructor(private permissions: { [key: string]: TablePermission<any>[] }) {
  }

  sqlPermissions() {
    return new SqlPermissions(this.permissions);
  }
}

export class RelationalAuthSchemaContext implements RelationalDataContext {
  constructor(protected relationalDataAdapter: RelationalDataAdapter,
              protected schema: RelationalSchemaDescription,
              protected sqlPermissions: SqlPermissions) {
  }

  delete<T>(type: TableInformation<T>): RelationalDeleteContext<T> {
    const permissions = this.sqlPermissions;

    class RelationalDeleteBuilderAuth extends RelationalDeleteBuilder<T> {
      protected async execute(): Promise<SqlDeleteResult> {
        if (!permissions.isDeleteAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }
    }

    const table = this.schema.table(type);
    const builder = new RelationalDeleteBuilderAuth(this.relationalDataAdapter, table.getSqlDelete());
    return new RelationalDeleteContext(this.schema, type, builder);
  }

  insert<T>(type: TableInformation<T>): RelationalInsertContext<T> {
    const permissions = this.sqlPermissions;

    class RelationalInsertBuilderAuth extends RelationalInsertBuilder<T> {
      protected async execute(): Promise<SqlInsertResult> {
        if (!permissions.isInsertAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }
    }

    const table = this.schema.table(type);
    const builder = new RelationalInsertBuilderAuth(this.relationalDataAdapter, table.getSqlInsert());
    return new RelationalInsertContext(this.schema, type, builder);
  }

  select<T>(type: TableInformation<T>): RelationalSelectContext<T> {
    const permissions = this.sqlPermissions;

    class RelationalSelectBuilderAuth extends RelationalSelectBuilder<T> {
      protected async execute(): Promise<T[]> {
        if (!permissions.isSelectAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }

      first(): RelationalSelectFirstBuilder<T> {
        return new RelationalSelectFirstBuilderAuth<T>(this.dataAdapter, this.query);
      }

      //TODO
      // firstOrDefault(): RelationalSelectFirstOrDefaultBuilder<T> {
      //   return super.firstOrDefault();
      // }
      // count(): RelationalSelectFirstBuilder<{ count: number }> {
      //   return super.count();
      // }
    }

    class RelationalSelectFirstBuilderAuth<T> extends RelationalSelectFirstBuilder<T> {
      protected async execute(): Promise<T> {
        if (!permissions.isSelectAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }
    }

    const table = this.schema.table(type);
    const builder = new RelationalSelectBuilderAuth(this.relationalDataAdapter, table.getSqlSelect());
    return new RelationalSelectContext<T>(this.schema, type, builder);
  }

  update<T>(type: TableInformation<T>): RelationalUpdateContext<T> {
    const permissions = this.sqlPermissions;

    class RelationalUpdateBuilderAuth extends RelationalUpdateBuilder<T> {
      protected async execute(): Promise<SqlUpdateResult> {
        if (!permissions.isUpdateAuthorized(this.query)) {
          throw new Error('not authorized');
        }
        return super.execute();
      }
    }

    const table = this.schema.table(type);
    const builder = new RelationalUpdateBuilderAuth(this.relationalDataAdapter, table.getSqlUpdate());
    return new RelationalUpdateContext<T>(this.schema, type, builder);
  }
}

export class RelationalAuthTransactionSchemaContext extends RelationalAuthSchemaContext implements RelationalTransactionContext {
  constructor(private relationalTransactionAdapter: RelationalTransactionAdapter,
              schema: RelationalSchemaDescription,
              sqlPermissions: SqlPermissions) {
    super(relationalTransactionAdapter, schema, sqlPermissions);
  }

  async transaction<T>(action: (trx: RelationalDataContext) => Promise<T>): Promise<T> {
    //TODO check trx permission
    return await this.relationalTransactionAdapter.transaction<T>(async adapter => {
      return await action(new RelationalAuthSchemaContext(adapter, this.schema, this.sqlPermissions));
    });
  }
}
