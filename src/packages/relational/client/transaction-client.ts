export interface TransactionClient<T> {
  transaction<R>(action: (trx: T) => Promise<R>): Promise<R>
}

export const isTransactionClient = (
  val: any,
): val is TransactionClient<any> => typeof val.transaction === 'function';
