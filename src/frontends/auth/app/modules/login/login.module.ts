import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormLayoutModule } from '../form-layout/form-layout.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [LoginRoutingModule, CommonModule, ReactiveFormsModule, FormLayoutModule],
})
export class LoginModule {}
