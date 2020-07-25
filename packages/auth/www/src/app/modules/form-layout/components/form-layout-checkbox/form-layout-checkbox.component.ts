import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-layout-checkbox',
  templateUrl: './form-layout-checkbox.component.html',
  styleUrls: ['./form-layout-checkbox.component.scss']
})
export class FormLayoutCheckboxComponent implements OnInit {

  @Input()
  id: string;

  @Input()
  name: string;

  @Input()
  description: string;

  @Input()
  form: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
