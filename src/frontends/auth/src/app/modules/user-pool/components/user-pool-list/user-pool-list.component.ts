import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { count, equal, field, subSelect, table } from '@daita/relational';
import {UserPool} from '../../../../../../../../packages/auth/models/user-pool';
import {User} from '../../../../../../../../packages/auth/models/user';

@Component({
  selector: 'app-user-pool-list',
  templateUrl: './user-pool-list.component.html',
  styleUrls: ['./user-pool-list.component.scss']
})
export class UserPoolListComponent implements OnInit {
  userPools: { id: string, name: string, count: number}[] = [];
  loading = false;

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.select({
      select: {
        id: field(UserPool, 'id'),
        name: field(UserPool, 'name'),
        count: subSelect({
          select: count(),
          from: table(User),
          where: equal(field(User, 'userPoolId'), field(UserPool, 'id')),
        }),
      },
      from: table(UserPool),
    }).then(userPools => {
      this.userPools = userPools;
      this.loading = false;
    });
  }

}
