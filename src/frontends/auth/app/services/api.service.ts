import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { InsertSql, RelationalAdapter, SelectSql } from '@daita/relational';
import { adapter } from '@daita/browser';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adapter: RelationalAdapter<any>;

  constructor(private auth: AuthService) {
    this.adapter = adapter.getRelationalAdapter({
      baseUrl: environment.authUrl,
      auth: {
        async getToken(): Promise<string | null> {
          return `Bearer ${await auth.getAccessToken()}`;
        },
      },
    });
  }

  select<T>(sql: SelectSql<T>) {
    return this.adapter.select(sql);
  }

  selectFirst<T>(sql: SelectSql<T>) {
    return this.adapter.selectFirst(sql);
  }

  insert<T>(sql: InsertSql<T>) {
    return this.adapter.insert(sql);
  }
}
