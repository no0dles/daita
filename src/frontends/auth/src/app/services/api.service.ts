import { Injectable } from '@angular/core';
import { httpAdapter } from '@daita/http-adapter';
import { AuthService } from './auth.service';
import { InsertSql, RelationalClient, RelationalTransactionAdapter, SelectSql } from '@daita/relational';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adapter: RelationalTransactionAdapter;
  private readonly client: RelationalClient;

  constructor(private auth: AuthService) {
    this.adapter = httpAdapter.getAdapter({
      baseUrl: environment.authUrl,
      authProvider: {
        async getToken(): Promise<string | null> {
          return auth.getAccessToken();
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
