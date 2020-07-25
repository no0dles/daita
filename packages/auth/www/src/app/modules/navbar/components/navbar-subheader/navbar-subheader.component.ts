import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-subheader',
  templateUrl: './navbar-subheader.component.html',
  styleUrls: ['./navbar-subheader.component.scss']
})
export class NavbarSubheaderComponent implements OnInit {

  @Input()
  name: string;

  @Input()
  link: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
