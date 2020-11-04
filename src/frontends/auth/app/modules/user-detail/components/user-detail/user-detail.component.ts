import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserDetailStateItem, UserDetailStateService } from '../../services/user-detail-state.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  @Select(UserDetailStateService.item)
  item$!: Observable<UserDetailStateItem>;

  form: FormGroup;

  constructor(public route: ActivatedRoute) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      userPool: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      emailVerified: new FormControl(false, []),
      phone: new FormControl('', []),
      phoneVerified: new FormControl(false, []),
    });
    this.form.get('userPool')?.disable();
    this.form.get('username')?.disable();
  }

  ngOnInit(): void {
    this.item$.subscribe((item) => {
      this.form.patchValue({
        username: item.username,
        email: item.email,
        phone: item.phone,
        phoneVerified: item.phoneVerified,
        emailVerified: item.emailVerified,
        userPool: item.userPool,
      });
    });
  }

  save() {}
}
