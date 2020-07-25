import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-layout-radio',
  templateUrl: './form-layout-radio.component.html',
  styleUrls: ['./form-layout-radio.component.scss']
})
export class FormLayoutRadioComponent implements OnInit {

  @Input()
  id: string;

  @Input()
  name: string;

  @Input()
  value: string;

  @Input()
  description: string;

  @Input()
  form: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
