import {DefaultConstructable} from '../constructable';
import {QueryFilter} from '../query/query-filter';

export class DocumentFindContext<T> {
  constructor(private type: DefaultConstructable<T>) {}
  where(filter: QueryFilter<T>) {
    return this;
  }
  async exec(): Promise<T[]> {
    return [];
  }
}
