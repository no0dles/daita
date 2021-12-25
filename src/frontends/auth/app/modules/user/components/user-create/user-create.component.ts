import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { uuid } from '../../../../utils/uuid';
import { User, UserPool } from '@daita/auth';
import { field, table } from '@daita/relational';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  form!: FormGroup;
  userPools: any[] = [];

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.api
      .select({
        select: {
          name: field(UserPool, 'name'),
          value: field(UserPool, 'id'),
        },
        from: table(UserPool),
      })
      .then((userPools) => {
        this.userPools = userPools;
        if (userPools.length > 0) {
          this.form.patchValue({
            userPool: userPools[0].value,
          });
        }
      });
    this.form = new FormGroup({
      userPool: new FormControl(null, [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required]),
      phone: new FormControl(),
      email: new FormControl(),
    });
  }

  generate() {
    this.form.patchValue({
      password: uuid(),
    });
  }

  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const data = this.form.getRawValue();
    await this.api.insert({
      into: table(User),
      insert: {
        username: data.username,
        password: data.password,
        email: data.email,
        phone: data.phone,
        emailVerified: data.emailVerified,
        phoneVerified: data.phoneVerified,
        userPoolId: data.userPool,
        disabled: false,
      },
    });
    await this.router.navigate(['..'], { relativeTo: this.route });
  }
}
