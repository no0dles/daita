import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-layout-section',
  templateUrl: './form-layout-section.component.html',
  styleUrls: ['./form-layout-section.component.scss'],
})
export class FormLayoutSectionComponent {
  @Input()
  name!: string;

  @Input()
  description!: string;
}
