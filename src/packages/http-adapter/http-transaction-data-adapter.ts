import {HttpBase} from './http-base';
import {Countdown} from './countdown';
import {AuthProvider} from '../http-client-common/auth';
import {RelationalDataAdapter, RelationalRawResult} from '../relational/adapter';
import {Defer} from '../common/utils';

export class HttpTransactionDataAdapter extends HttpBase implements RelationalDataAdapter {
  private resultDefer = new Defer<any>();
  private countDown = new Countdown(() => this.timeout());

  constructor(private transactionId: string,
              baseUrl: string,
              authProvider: AuthProvider | null | undefined) {
    super(baseUrl, authProvider);
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    if (this.resultDefer.isRejected || this.resultDefer.isResolved) {
      throw new Error('transaction already closed');
    }

    const response = await this.send(`trx/${this.transactionId}/exec`, {sql, values});
    const timeout = response.headers['x-transaction-timeout'];
    if (timeout && timeout > 0) {
      this.countDown.setExpire(timeout);
    }
    return response.data;
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    if (this.resultDefer.isRejected || this.resultDefer.isResolved) {
      throw new Error('transaction already closed');
    }

    const response = await this.send(`trx/${this.transactionId}/exec`, {sql: sql});
    const timeout = response.headers['x-transaction-timeout'];
    if (timeout && timeout > 0) {
      this.countDown.setExpire(timeout);
    }
    return response.data;
  }

  supportsQuery(sql: any): boolean {
    throw new Error("Method not implemented.");
  }

  async close(): Promise<void> {
    
  }

  async run(action: () => Promise<any>): Promise<any> {
    await this.send(`trx/${this.transactionId}`);
    action().then(async result => {
      this.resultDefer.resolve(result);
      await this.commit();
    }).catch(e => {
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
    await this.send(`trx/${this.transactionId}/commit`);
  }

  private async rollback() {
    await this.send(`trx/${this.transactionId}/rollback`);
  }
}

