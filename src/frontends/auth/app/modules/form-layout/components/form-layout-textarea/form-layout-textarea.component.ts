import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-layout-textarea',
  templateUrl: './form-layout-textarea.component.html',
  styleUrls: ['./form-layout-textarea.component.scss'],
})
export class FormLayoutTextareaComponent {
  @Input()
  id!: string;

  @Input()
  name!: string;

  @Input()
  form!: FormGroup;
}
