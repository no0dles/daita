import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-subheader',
  templateUrl: './navbar-subheader.component.html',
  styleUrls: ['./navbar-subheader.component.scss'],
})
export class NavbarSubheaderComponent {
  @Input()
  name = '';

  @Input()
  link: string[] = [];
}
