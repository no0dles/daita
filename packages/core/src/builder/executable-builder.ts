export interface ExecutableBuilder<TQuery, TResult> {
  query: TQuery;
  execute(): Promise<TResult>
}