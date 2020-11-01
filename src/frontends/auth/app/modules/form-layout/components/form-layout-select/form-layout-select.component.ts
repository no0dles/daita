import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-layout-select',
  templateUrl: './form-layout-select.component.html',
  styleUrls: ['./form-layout-select.component.scss'],
})
export class FormLayoutSelectComponent implements OnInit {
  @Input()
  id!: string;

  @Input()
  name!: string;

  @Input()
  options!: { value: string; name: string }[];

  @Input()
  form!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
