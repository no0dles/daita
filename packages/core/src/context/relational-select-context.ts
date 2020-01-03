import { RelationalTransactionDataAdapter } from '../adapter';
import { RootFilter } from '../query/root-filter';
import { MigrationSchema } from '../schema/migration-schema';
import { TableInformation } from './table-information';
import { ExcludePrimitive } from './types/exclude-primitive';

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
    protected dataAdapter: RelationalTransactionDataAdapter,
    protected schema: MigrationSchema,
    protected type: TableInformation<T>,
    protected state: RelationalSelectState,
  ) {
    this.shouldMapResult = this.isConstructor(this.type);
  }

  protected getSelectorPath(tableName: string) {
    const handler = {
      get: (obj: any, prop: any) => {
        //const table = this.schema.table(tableName);
        //const field = table?.field(prop);
        return { path: [prop] };
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
        filter: { $and: [this.state.filter, filter] },
        limit: this.state.limit,
        include: this.state.include,
        skip: this.state.skip,
        orderBy: this.state.orderBy,
      });
    }

    return this.newContext({
      filter: filter,
      limit: this.state.limit,
      skip: this.state.skip,
      include: this.state.include,
      orderBy: this.state.orderBy,
    });
  }

  async exec(): Promise<T[]> {
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

  execCount(): Promise<number> {
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
      include: [...this.state.include, { path: selectorResult.path }],
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
          { path: selectorResult.path, direction: direction || 'asc' },
        ],
      },
    );
  }

  protected abstract newContext(state: RelationalSelectState): C;
}

export class RelationalSelectContextOrdered<
  T
> extends BaseRelationalSelectContext<T, RelationalSelectContextOrdered<T>> {
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
    );
  }
}

export class RelationalSelectContext<T> extends BaseRelationalSelectContext<
  T,
  RelationalSelectContext<T>
> {
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
    );
  }
}
