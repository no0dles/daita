import {RelationalDataAdapter, RelationalTransactionAdapter} from '../adapter';
import {RootFilter} from '../query/root-filter';
import {MigrationSchema} from '../schema/migration-schema';
import {TableInformation} from './table-information';
import {ExcludePrimitive} from './types/exclude-primitive';
import {ContextUser} from '../auth';

interface RelationalSelectState {
  skip: number | null;
  limit: number | null;
  orderBy: { path: string[]; direction: 'asc' | 'desc' }[];
  include: { path: string[] }[];
  filter: RootFilter<any> | null;
}

abstract class BaseRelationalSelectContext<T, C> {
  protected shouldMapResult: boolean;

  constructor(
    protected dataAdapter: RelationalDataAdapter,
    protected schema: MigrationSchema,
    protected type: TableInformation<T>,
    protected state: RelationalSelectState,
    protected user: ContextUser | null,
  ) {
    this.shouldMapResult = this.isConstructor(this.type);
  }

  protected getSelectorPath(tableName: string) {
    const handler = {
      get: (obj: any, prop: any) => {
        //const table = this.schema.table(tableName);
        //const field = table?.field(prop);
        return {path: [prop]};
      },
    };

    return new Proxy({}, handler);
  }

  skip(value: number) {
    return this.newContext({
      filter: this.state.filter,
      limit: this.state.limit,
      include: this.state.include,
      skip: value,
      orderBy: this.state.orderBy,
    });
  }

  limit(value: number) {
    return this.newContext({
      filter: this.state.filter,
      limit: value,
      include: this.state.include,
      skip: this.state.skip,
      orderBy: this.state.orderBy,
    });
  }

  where(filter: RootFilter<T>) {
    if (this.state.filter) {
      return this.newContext({
        filter: {$and: [this.state.filter, filter]},
        limit: this.state.limit,
        include: this.state.include,
        skip: this.state.skip,
        orderBy: this.state.orderBy,
      });
    }

    return this.newContext({
      filter,
      limit: this.state.limit,
      skip: this.state.skip,
      include: this.state.include,
      orderBy: this.state.orderBy,
    });
  }

  async exec(): Promise<T[]> {
    this.validatePermission();
    const results = await this.dataAdapter.select(
      this.schema,
      this.type.name,
      this.state,
    );

    if (this.shouldMapResult) {
      return results.map(result => this.mapResult(result));
    }

    return results;
  }

  private isConstructor(value: any) {
    try {
      new new Proxy(value, {
        construct() {
          return {};
        },
      })();
      return true;
    } catch (err) {
      return false;
    }
  }

  private mapResult(result: any): T {
    const instance = new (<any>this.type)();
    for (const key of Object.keys(result)) {
      (<any>instance)[key] = result[key];
    }
    return instance;
  }

  async execFirst(): Promise<T | null> {
    this.validatePermission();
    const results = await this.dataAdapter.select(this.schema, this.type.name, {
      filter: this.state.filter,
      limit: 1,
      orderBy: this.state.orderBy,
      skip: this.state.skip,
      include: this.state.include,
    });
    const item = results[0] || null;
    if (!item) {
      return null;
    }

    if (this.shouldMapResult) {
      return this.mapResult(item);
    }

    return item;
  }

  protected validatePermission() {
    const permissions = this.schema.tablePermissions(this.type.name);
    for (const permission of permissions) {
      if (permission.type === 'role') {
        if (!this.user || this.user.roles.indexOf(permission.role) === -1) {
          continue;
        }
      } else if (permission.type === 'authorized') {
        if (!this.user) {
          continue;
        }
      }

      if (!permission.select) {
        continue
      }

      if (permission.select === true) {
        return true;
      }

      if (permission.select.skip !== null && permission.select.skip !== undefined) {
        if (typeof permission.select.skip === 'number') {
          if (permission.select.skip !== this.state.skip) {
            throw new Error(`not authorized, skip`); //TODO
          }
        } else {
          throw new Error('not impl');
        }
      }
      //TODO
    }

    throw new Error('not authorized, no rule matches');
  }

  execCount(): Promise<number> {
    this.validatePermission();
    return this.dataAdapter.count(this.schema, this.type.name, {
      filter: this.state.filter,
      orderBy: this.state.orderBy,
      include: this.state.include,
      limit: null,
      skip: null,
    });
  }

  include(selector: (table: ExcludePrimitive<T>) => any) {
    const selectorValue = this.getSelectorPath(this.type.name);
    const selectorResult = selector(selectorValue);

    return this.newContext({
      filter: this.state.filter,
      limit: this.state.limit,
      skip: this.state.skip,
      orderBy: this.state.orderBy,
      include: [...this.state.include, {path: selectorResult.path}],
    });
  }

  protected addOrderBy(
    selector: (table: T) => any,
    direction?: 'asc' | 'desc',
  ) {
    const selectorValue = this.getSelectorPath(this.type.name);
    const selectorResult = selector(selectorValue);

    return new RelationalSelectContextOrdered<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      {
        filter: this.state.filter,
        limit: this.state.limit,
        skip: this.state.skip,
        include: this.state.include,
        orderBy: [
          ...this.state.orderBy,
          {path: selectorResult.path, direction: direction || 'asc'},
        ],
      },
      this.user,
    );
  }

  protected abstract newContext(state: RelationalSelectState): C;
}

export class RelationalSelectContextOrdered<T> extends BaseRelationalSelectContext<T, RelationalSelectContextOrdered<T>> {
  orderThenBy(
    selector: (table: T) => any,
    direction?: 'asc' | 'desc',
  ): RelationalSelectContextOrdered<T> {
    return this.addOrderBy(selector, direction);
  }

  protected newContext(state: RelationalSelectState) {
    return new RelationalSelectContextOrdered<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      state,
      this.user,
    );
  }
}

export class RelationalSelectContext<T> extends BaseRelationalSelectContext<T,
  RelationalSelectContext<T>> {
  orderBy(
    selector: (table: T) => any,
    direction?: 'asc' | 'desc',
  ): RelationalSelectContextOrdered<T> {
    return this.addOrderBy(selector, direction);
  }

  protected newContext(
    state: RelationalSelectState,
  ): RelationalSelectContext<T> {
    return new RelationalSelectContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      state,
      this.user,
    );
  }
}
