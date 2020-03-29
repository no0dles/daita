import {RelationalDataAdapter} from '../adapter/relational-data-adapter';
import {deepClone} from './utils';

export abstract class RelationalQueryBuilder<TQuery extends object, Result> {
  [Symbol.toStringTag]: 'Promise';

  constructor(protected dataAdapter: RelationalDataAdapter,
              protected query: TQuery) {

  }

  protected abstract execute(): Promise<Result>;

  public toSql() {
    return deepClone(this.query);
  }

  catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<Result | TResult> {
    return this.execute().catch(onrejected);
  }

  then<TResult1 = Result, TResult2 = never>(onfulfilled?: ((value: Result) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<Result> {
    return this.execute().finally(onfinally);
  }
}
