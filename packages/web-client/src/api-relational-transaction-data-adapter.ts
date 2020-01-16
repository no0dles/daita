import {BaseApiDataAdapter} from './base-api-data-adapter';
import {RelationalTransactionDataAdapter} from '@daita/core';
import {AxiosResponse} from 'axios';

export class ApiRelationalTransactionDataAdapter extends BaseApiDataAdapter implements RelationalTransactionDataAdapter {
  kind: 'transactionDataAdapter' = 'transactionDataAdapter';

  constructor(baseUrl: string, transactionId: string,
              protected handleResponse: (response: AxiosResponse<any>) => void) {
    super(baseUrl, {tid: transactionId});
  }
}