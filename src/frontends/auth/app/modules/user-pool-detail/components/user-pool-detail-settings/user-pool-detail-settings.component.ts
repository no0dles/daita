import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-pool-detail-settings',
  templateUrl: './user-pool-detail-settings.component.html',
  styleUrls: ['./user-pool-detail-settings.component.scss'],
})
export class UserPoolDetailSettingsComponent {
  form: FormGroup;
  algorithms = [
    { name: 'ES512', value: 'ES512' },
    { name: 'ES384', value: 'ES384' },
    { name: 'RS512', value: 'RS512' },
    { name: 'RS384', value: 'RS384' },
  ];

  constructor(private route: ActivatedRoute) {
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

  get accessTokenHumanized() {
    return null;
  }

  get refreshTokenHumanized() {
    return null;
  }

  async save() {}
  ngOnInit(): void {}
}
