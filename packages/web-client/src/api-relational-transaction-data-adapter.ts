import {BaseApiDataAdapter} from './base-api-data-adapter';
import {RelationalTransactionDataAdapter} from '@daita/core';

export class ApiRelationalTransactionDataAdapter extends BaseApiDataAdapter implements RelationalTransactionDataAdapter {
  kind: 'transactionDataAdapter' = 'transactionDataAdapter';

  constructor(baseUrl: string, transactionId: string) {
    super(baseUrl, {tid: transactionId});
  }
}