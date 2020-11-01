import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { UserPool } from '../../../../../../../packages/auth/models/user-pool';
import { User } from '../../../../../../../packages/auth/models/user';
import { subSelect } from '../../../../../../../packages/relational/sql/function/sub-select';
import { field } from '../../../../../../../packages/relational/sql/function/field';
import { count } from '../../../../../../../packages/relational/sql/function/count';
import { table } from '../../../../../../../packages/relational/sql/function/table';
import { equal } from '../../../../../../../packages/relational/sql/function/equal';

@Component({
  selector: 'app-user-pool-list',
  templateUrl: './user-pool-list.component.html',
  styleUrls: ['./user-pool-list.component.scss'],
})
export class UserPoolListComponent implements OnInit {
  userPools: { id: string; name: string; count: number }[] = [];
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .select({
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
      })
      .then((userPools) => {
        this.userPools = userPools;
        this.loading = false;
      });
  }
}
