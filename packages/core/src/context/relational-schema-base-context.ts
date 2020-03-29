import {RelationalQueryBuilder} from '../builder/relational-query-builder';

export class RelationalSchemaBaseContext<Result> implements Promise<Result> {
  [Symbol.toStringTag]: 'Promise';

  constructor(private queryBuilder: RelationalQueryBuilder<any, Result>) {

  }

  catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<Result | TResult> {
    return this.queryBuilder.catch(onrejected);
  }

  then<TResult1 = Result, TResult2 = never>(onfulfilled?: ((value: Result) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2> {
    return this.queryBuilder.then(onfulfilled, onrejected);
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<Result> {
    return this.queryBuilder.finally(onfinally);
  }
}