import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Section } from '../../section';

@Component({
  selector: 'app-section-sidemenu',
  templateUrl: './section-sidemenu.component.html',
})
export class SectionSidemenuComponent implements OnInit, OnChanges {
  @HostBinding('style')
  style = { display: 'block' };

  @Input()
  section!: Section;

  @Input()
  level!: number;

  sectionUrl: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.updateUrl();
  }

  ngOnInit(): void {
    this.updateUrl();
  }

  private updateUrl() {
    this.sectionUrl = `${location.protocol}//${location.host}${location.pathname}#${this.section?.id}`;
  }
}
