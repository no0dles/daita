import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-layout-input',
  templateUrl: './form-layout-input.component.html',
  styleUrls: ['./form-layout-input.component.scss'],
})
export class FormLayoutInputComponent {
  @Input()
  id!: string;

  @Input()
  name!: string;

  @Input()
  type: 'number' | 'text' | 'email' | 'phone' = 'text';

  @Input()
  form!: FormGroup;

  @Input()
  prefix!: string;

  get invalid() {
    return !this.form.get(this.id)?.valid && (this.form.get(this.id)?.dirty || this.form.dirty);
  }
}
