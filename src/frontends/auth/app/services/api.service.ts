import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { InsertSql, RelationalClient, RelationalTransactionAdapter, SelectSql } from '@daita/relational';
import { adapter } from '@daita/browser';

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
