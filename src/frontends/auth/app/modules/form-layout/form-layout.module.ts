import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayoutFooterComponent } from './components/form-layout-footer/form-layout-footer.component';
import { FormLayoutInputComponent } from './components/form-layout-input/form-layout-input.component';
import { FormLayoutTextareaComponent } from './components/form-layout-textarea/form-layout-textarea.component';
import { FormLayoutRadioComponent } from './components/form-layout-radio/form-layout-radio.component';
import { FormLayoutCheckboxComponent } from './components/form-layout-checkbox/form-layout-checkbox.component';
import { FormLayoutSectionComponent } from './components/form-layout-section/form-layout-section.component';
import { FormLayoutSelectComponent } from './components/form-layout-select/form-layout-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormLayoutInputBtnComponent } from './components/form-layout-input-btn/form-layout-input-btn.component';

@NgModule({
  declarations: [
    FormLayoutFooterComponent,
    FormLayoutInputComponent,
    FormLayoutTextareaComponent,
    FormLayoutRadioComponent,
    FormLayoutCheckboxComponent,
    FormLayoutSectionComponent,
    FormLayoutSelectComponent,
    FormLayoutInputBtnComponent,
  ],
  exports: [
    FormLayoutFooterComponent,
    FormLayoutInputComponent,
    FormLayoutTextareaComponent,
    FormLayoutCheckboxComponent,
    FormLayoutSectionComponent,
    FormLayoutRadioComponent,
    FormLayoutSelectComponent,
    FormLayoutInputBtnComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormLayoutModule {}
