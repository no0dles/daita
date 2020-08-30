import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-layout-input-btn',
  templateUrl: './form-layout-input-btn.component.html',
  styleUrls: ['./form-layout-input-btn.component.scss']
})
export class FormLayoutInputBtnComponent {

  @Input()
  id: string;

  @Input()
  name: string;

  @Input()
  type: 'number' | 'text' | 'email' | 'phone' = 'text';

  @Input()
  form: FormGroup;

  @Input()
  buttonText: string;

  @Output()
  buttonClicked = new EventEmitter<void>();
}
