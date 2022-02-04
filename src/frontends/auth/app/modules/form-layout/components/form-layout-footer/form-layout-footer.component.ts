import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-form-layout-footer',
  templateUrl: './form-layout-footer.component.html',
  styleUrls: ['./form-layout-footer.component.scss'],
})
export class FormLayoutFooterComponent {
  @Output()
  canceled = new EventEmitter<void>();
}
