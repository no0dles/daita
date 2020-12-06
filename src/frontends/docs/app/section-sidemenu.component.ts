import { Component, HostBinding, Input } from '@angular/core';
import { Section } from './section';

@Component({
  selector: 'app-section-sidemenu',
  templateUrl: './section-sidemenu.component.html',
})
export class SectionSidemenuComponent {
  @HostBinding('style')
  style = { display: 'block' };

  @Input()
  section!: Section;

  @Input()
  level!: number;
}
