import { Countdown } from './countdown';
import { Http, HttpSendResult } from '@daita/http-client-common';
import { RelationalRawResult } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { Defer } from '@daita/common';
import { handleErrorResponse } from './error-handling';
import { TimeoutError } from '@daita/relational';

export class HttpTransactionDataAdapter implements RelationalDataAdapter {
  private resultDefer = new Defer<any>();
  private countDown = new Countdown(() => this.timeout());

  constructor(private transactionId: string, private http: Http) {}

  private handleErrorResponse(response: HttpSendResult) {
    if (response.statusCode === 400 && response.data?.error === 'TimeoutError') {
      this.resultDefer.reject(new TimeoutError('timeout'));
      throw new Error('transaction already closed');
    }

    handleErrorResponse(response);

    const timeout = response.headers['x-transaction-timeout'];
    if (timeout && timeout > 0) {
      this.countDown.setExpire(timeout);
    }
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    throw new Error('not supported over http');
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    if (this.resultDefer.isRejected || this.resultDefer.isResolved) {
      throw new Error('transaction already closed');
    }

    const response = await this.http.json<RelationalRawResult>({
      path: `api/relational/trx/${this.transactionId}/exec`,
      data: {
        sql: sql,
      },
      authorized: true,
    });
    this.handleErrorResponse(response);
    return response.data;
  }

  supportsQuery(sql: any): boolean {
    throw new Error('not supported over http');
  }

  async close(): Promise<void> {}

  async run(action: () => Promise<any>): Promise<any> {
    await this.http.json({ path: `api/relational/trx/${this.transactionId}`, authorized: true });
    action()
      .then(async (result) => {
        await this.commit().then(() => {
          this.resultDefer.resolve(result);
        });
      })
      .catch((e) => {
        if (e.message === 'transaction already closed') {
          return;
        } else {
          this.rollback();
          this.resultDefer.reject(e);
        }
      });
    return this.resultDefer.promise;
  }

  private timeout() {
    if (this.resultDefer.isResolved || this.resultDefer.isRejected) {
      return;
    }
    this.resultDefer.reject(new Error('transaction timeout'));
  }

  private async commit() {
    const response = await this.http.json({
      path: `api/relational/trx/${this.transactionId}/commit`,
      authorized: true,
    });
    this.handleErrorResponse(response);
  }

  private async rollback() {
    const response = await this.http.json({
      path: `api/relational/trx/${this.transactionId}/rollback`,
      authorized: true,
    });
    this.handleErrorResponse(response);
  }
}
