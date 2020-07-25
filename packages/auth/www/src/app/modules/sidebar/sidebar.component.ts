import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  @Input()
  name: string;

  opened = false;

  constructor() {
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  ngOnInit(): void {
  }

}
