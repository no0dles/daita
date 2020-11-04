import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-header',
  templateUrl: './navbar-header.component.html',
  styleUrls: ['./navbar-header.component.scss'],
})
export class NavbarHeaderComponent implements OnInit {
  @Input()
  name: string = '';

  @Input()
  link?: string[];

  @Output()
  createClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
