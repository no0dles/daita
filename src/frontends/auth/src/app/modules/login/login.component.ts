import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  invalidCredentials = false;
  form: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', { validators: [Validators.required] }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  async login() {
    this.invalidCredentials = false;
    this.form.markAsDirty();
    if (!this.form.valid) {
      this.errorMessage = 'Fill out username and password';
      return;
    }

    try {
      await this.authService.login({
        userPoolId: 'admin',
        username: this.form.value.username,
        password: this.form.value.password,
      });
      await this.router.navigate(['/app']);
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status === 400 && e.error && e.error.message === 'invalid credentials') {
        this.errorMessage = 'Invalid Username / Password';
        this.invalidCredentials = true;
      } else if (e instanceof HttpErrorResponse && e.status === 500) {
        this.errorMessage = 'Internal Server Error';
      }
    }
  }
}
