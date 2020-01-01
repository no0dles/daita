import {RelationalTransactionDataAdapter} from '../adapter';
import {RootFilter} from '../query/root-filter';
import {MigrationSchema} from '../schema/migration-schema';
import {TableInformation} from './table-information';

interface RelationalSelectState {
  skip: number | null;
  limit: number | null;
  orderBy: { path: string; direction: 'asc' | 'desc' }[];
  filter: RootFilter<any> | null;
}

export class RelationalSelectContext<T> {
  private shouldMapResult: boolean;

  constructor(
    private dataAdapter: RelationalTransactionDataAdapter,
    private schema: MigrationSchema,
    private type: TableInformation<T>,
    private state: RelationalSelectState,
  ) {
    this.shouldMapResult = this.isConstructor(this.type);
  }

  private getSelectorPath(tableName: string) {
    const handler = {
      get: (obj: any, prop: any) => {
        //const table = this.schema.table(tableName);
        //const field = table?.field(prop);
        return {path: prop};
      },
    };

    return new Proxy({}, handler);
  }

  orderBy(
    selector: (table: T) => any,
    direction?: 'asc' | 'desc',
  ): RelationalSelectContext<T> {
    const selectorValue = this.getSelectorPath(this.type.name);
    const selectorResult = selector(selectorValue);

    return new RelationalSelectContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      {
        filter: this.state.filter,
        limit: this.state.limit,
        skip: this.state.skip,
        orderBy: [
          ...this.state.orderBy,
          {path: selectorResult.path, direction: direction ?? 'asc'},
        ],
      },
    );
  }

  skip(value: number): RelationalSelectContext<T> {
    return new RelationalSelectContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      {
        filter: this.state.filter,
        limit: this.state.limit,
        skip: value,
        orderBy: this.state.orderBy,
      },
    );
  }

  limit(value: number): RelationalSelectContext<T> {
    return new RelationalSelectContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      {
        filter: this.state.filter,
        limit: value,
        skip: this.state.skip,
        orderBy: this.state.orderBy,
      },
    );
  }

  where(filter: RootFilter<T>): RelationalSelectContext<T> {
    if (this.state.filter) {
      return new RelationalSelectContext<T>(
        this.dataAdapter,
        this.schema,
        this.type,
        {
          filter: {$and: [this.state.filter, filter]},
          limit: this.state.limit,
          skip: this.state.skip,
          orderBy: this.state.orderBy,
        },
      );
    }

    return new RelationalSelectContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      {
        filter: filter,
        limit: this.state.limit,
        skip: this.state.skip,
        orderBy: this.state.orderBy,
      },
    );
  }

  async exec(): Promise<T[]> {
    const results = await this.dataAdapter.select(this.schema,
      this.type.name,
      this.state,
    );

    if(this.shouldMapResult) {
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
      });
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
    const results = await this.dataAdapter.select(
      this.schema,
      this.type.name,
      {
        filter: this.state.filter,
        limit: 1,
        orderBy: this.state.orderBy,
        skip: this.state.skip,
      },
    );
    const item = results[0] || null;
    if (!item) {
      return null;
    }

    if(this.shouldMapResult) {
      return this.mapResult(item);
    }

    return item;
  }

  execCount(): Promise<number> {
    return this.dataAdapter.count(this.schema, this.type.name, {
      filter: this.state.filter,
      orderBy: this.state.orderBy,
      limit: null,
      skip: null,
    });
  }
}
