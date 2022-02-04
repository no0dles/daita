import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar-tab',
  templateUrl: './navbar-tab.component.html',
  styleUrls: ['./navbar-tab.component.scss'],
})
export class NavbarTabComponent implements OnInit, OnChanges {
  @Input()
  name = '';

  @Input()
  link: string[] = [];

  @Input()
  route!: ActivatedRoute;

  tabLink!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.tabLink = this.router.createUrlTree(this.link, { relativeTo: this.route }).toString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.route || changes.link) {
      this.tabLink = this.router.createUrlTree(this.link, { relativeTo: this.route }).toString();
    }
  }
}
