import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { adapter } from '../../../../packages/http-adapter/browser';
import { InsertSql } from '../../../../packages/relational/sql/dml/insert/insert-sql';
import { RelationalClient } from '../../../../packages/relational/client/relational-client';
import { RelationalTransactionAdapter } from '../../../../packages/relational/adapter/relational-transaction-adapter';
import { SelectSql } from '../../../../packages/relational/sql/dml/select/select-sql';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adapter: RelationalTransactionAdapter;
  private readonly client: RelationalClient;

  constructor(private auth: AuthService) {
    this.adapter = adapter.getRelationalAdapter({
      baseUrl: environment.authUrl,
      auth: {
        async getToken(): Promise<string | null> {
          return `Bearer ${await auth.getAccessToken()}`;
        },
      },
    });
    this.client = new RelationalClient(this.adapter);
  }

  select<T>(sql: SelectSql<T>) {
    return this.client.select(sql);
  }

  selectFirst<T>(sql: SelectSql<T>) {
    return this.client.selectFirst(sql);
  }

  insert<T>(sql: InsertSql<T>) {
    return this.client.insert(sql);
  }
}
