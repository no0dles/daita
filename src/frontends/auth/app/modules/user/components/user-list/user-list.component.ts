import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { equal, field, join, table } from '@daita/relational';
import { User, UserPool } from '@daita/auth';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: { username: string; userPool: string; disabled: boolean; email?: string; userPoolId: string }[] = [];
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .select({
        select: {
          username: field(User, 'username'),
          userPool: field(UserPool, 'name'),
          disabled: field(User, 'disabled'),
          email: field(User, 'email'),
          userPoolId: field(User, 'userPoolId'),
        },
        from: table(User),
        join: [join(UserPool, equal(field(User, 'userPoolId'), field(UserPool, 'id')))],
      })
      .then((users) => {
        this.users = users;
        this.loading = false;
      });
  }
}
