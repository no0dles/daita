import { Component, HostBinding, Input } from '@angular/core';
import { Section } from '../../section';

@Component({
  selector: 'app-section',
  styleUrls: ['./section.component.scss'],
  templateUrl: './section.component.html',
})
export class SectionComponent {
  @HostBinding('style')
  style = { display: 'block' };
  @Input()
  section!: Section;

  @Input()
  level!: number;
}
