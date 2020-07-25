import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-layout-textarea',
  templateUrl: './form-layout-textarea.component.html',
  styleUrls: ['./form-layout-textarea.component.scss']
})
export class FormLayoutTextareaComponent implements OnInit {

  @Input()
  id: string;

  @Input()
  name: string;

  @Input()
  form: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
