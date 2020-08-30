import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { table } from '@daita/relational';
import { ActivatedRoute, Router } from '@angular/router';
import { uuid } from '../../../../utils/uuid';
import {UserPool} from '../../../../../../../../packages/auth/models/user-pool';

@Component({
  selector: 'app-user-pool-create',
  templateUrl: './user-pool-create.component.html',
  styleUrls: ['./user-pool-create.component.scss'],
})
export class UserPoolCreateComponent implements OnInit {

  form: FormGroup;
  algorithms = [
    {name:'ES512', value: 'ES512'},
    {name:'ES384', value: 'ES384'},
    {name:'RS512', value: 'RS512'},
    {name:'RS384', value: 'RS384'}
  ];

  constructor(private api: ApiService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  get accessTokenHumanized() {
    return this.toHumanize(this.form.get('accessTokenExpire').value);
  }

  get refreshTokenHumanized() {
    return this.toHumanize(this.form.get('refreshTokenExpire').value);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      algorithm: new FormControl('ES512', [Validators.required]),
      accessTokenExpire: new FormControl(3600, [Validators.required]),
      refreshTokenExpire: new FormControl(2419200, [Validators.required]),
      allowRegistration: new FormControl(false),
      verifyEmail: new FormControl(true),
      checkPassword: new FormControl(true),
      passwordStrength: new FormControl('complex', [Validators.required]),
    });
  }

  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const data = this.form.getRawValue();
    let passwordRegex = undefined;
    if (data.passwordStrength === 'simple') {
      passwordRegex = '^.{8,}$';
    } else if (data.passwordStrength === 'challenging') {
      passwordRegex = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$';
    } else if (data.passwordStrength === 'complex') {
      passwordRegex = '^(?=.*\\d)(?=.*\\W)(?=.*[a-z])(?=.*[A-Z]).{10,}$';
    } else if (data.passwordStrength === 'custom') {
      passwordRegex = '';
    }
    await this.api.insert({
      into: table(UserPool),
      insert: {
        id: uuid(),
        name: data.name,
        refreshRefreshExpiresIn: data.refreshTokenExpire,
        accessTokenExpiresIn: data.accessTokenExpire,
        checkPasswordForBreach: data.checkPassword,
        allowRegistration: data.allowRegistration,
        algorithm: data.algorithm,
        passwordRegex,
        emailVerifyExpiresIn: 3600,
      }
    });
    await this.router.navigate(['..'], {relativeTo: this.route});
  }

  cancel() {

  }

  private toHumanize(value: number) {
    let name = 'second';
    const units = [
      { name: 'min', value: 60 },
      { name: 'hour', value: 60 },
      { name: 'day', value: 24 },
      { name: 'week', value: 7 },
      { name: 'month', value: 4 },
      { name: 'year', value: 12 },
    ];

    if (value > units[0].value) {
      for (let i = 0; i < units.length; i++) {
        value = value / units[i].value;
        name = units[i].name;
        if (i + 1 >= units.length || value < units[i + 1].value) {
          break;
        }
      }
    }

    return `${value} ${name}${value > 1 ? 's' : ''}`;
  }
}
