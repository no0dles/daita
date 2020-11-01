import { Injectable } from '@angular/core';
import { adapter } from '../../../../packages/http-adapter/browser';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { InsertSql } from '../../../../packages/relational/sql/insert-sql';
import { RelationalClient } from '../../../../packages/relational/client/relational-client';
import { RelationalTransactionAdapter } from '../../../../packages/relational/adapter/relational-transaction-adapter';
import { SelectSql } from '../../../../packages/relational/sql/select-sql';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adapter: RelationalTransactionAdapter;
  private readonly client: RelationalClient;

  constructor(private auth: AuthService) {
    this.adapter = adapter.getAdapter({
      baseUrl: environment.authUrl,
      authProvider: {
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

  insert<T>(sql: InsertSql<T>) {
    return this.client.insert(sql);
  }
}
