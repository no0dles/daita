import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Role } from '../../../../../../../packages/auth/models/role';
import { field } from '../../../../../../../packages/relational/sql/function/field';
import { table } from '../../../../../../../packages/relational/sql/function/table';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {
  roles: { name: string; description?: string }[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .select({
        select: {
          name: field(Role, 'name'),
          description: field(Role, 'description'),
        },
        from: table(Role),
      })
      .then((roles) => {
        this.roles = roles;
      });
  }
}
