import { Injectable } from '@angular/core';
import { HttpTransactionAdapter } from '@daita/http-adapter';
import { AuthService } from './auth.service';
import { InsertSql, RelationalClient, SelectSql } from '@daita/relational';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adapter: HttpTransactionAdapter;
  private readonly client: RelationalClient;

  constructor(private auth: AuthService) {
    this.adapter = new HttpTransactionAdapter('', {
      async getToken(): Promise<string | null> {
        return auth.getAccessToken();
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
