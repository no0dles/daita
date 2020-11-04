import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserPoolDetailStateItem, UserPoolDetailStateService } from '../../services/user-pool-detail-state.service';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-user-pool-detail',
  templateUrl: './user-pool-detail.component.html',
  styleUrls: ['./user-pool-detail.component.scss'],
})
export class UserPoolDetailComponent {
  @Select(UserPoolDetailStateService.item)
  item$!: Observable<UserPoolDetailStateItem>;

  constructor(public route: ActivatedRoute) {}
}
