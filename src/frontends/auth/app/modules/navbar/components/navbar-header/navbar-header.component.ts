import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-header',
  templateUrl: './navbar-header.component.html',
  styleUrls: ['./navbar-header.component.scss'],
})
export class NavbarHeaderComponent {
  @Input()
  name = '';

  @Input()
  link?: string[];

  @Output()
  createClicked = new EventEmitter();
}
