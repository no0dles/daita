import { Component } from '@angular/core';
import { Navigation } from '../../navigation';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Section } from '../../section';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss'],
})
export class DocComponent {
  sections$: Observable<Section[]>;
  showSidebar$: Observable<boolean>;
  navigations: Navigation[] = [
    {
      title: 'Intro',
      items: [
        { title: 'About', slug: '/intro/about' },
        { title: 'Installation', slug: '/intro/installation' },
        {
          title: 'Examples',
          slug: '/intro/examples',
        },
      ],
    },
    {
      title: 'Getting started',
      items: [
        { title: 'node.js and sqlite', slug: '/getting-started/nodejs-sqlite' },
        { title: 'node.js and postgres', slug: '/getting-started/nodejs-postgres' },
        { title: 'angular', slug: '/getting-started/angular' },
      ],
    },
    {
      title: 'Packages',
      items: [
        { title: 'relational', slug: '/packages/relational' },
        { title: 'orm', slug: '/packages/orm' },
        { title: 'cli', slug: '/packages/cli' },
      ],
    },
    {
      title: 'Adapters',
      items: [
        { title: 'Sqlite', slug: '/adapters/sqlite' },
        { title: 'Postgres', slug: '/adapters/postgres' },
        { title: 'MariaDB', slug: '/adapters/mariadb' },
        { title: 'HTTP', slug: '/adapters/http' },
        { title: 'Websocket', slug: '/adapters/websocket' },
      ],
    },
    {
      title: 'Containers',
      items: [
        { title: 'HTTP Server', slug: '/containers/http' },
        { title: 'Websocket Server', slug: '/containers/websocket' },
        { title: 'Auth Server', slug: '/containers/auth' },
      ],
    },
    {
      title: 'Daita',
      items: [
        { title: 'Design Goals', slug: '/daita/design-goals' },
        { title: 'Roadmap', slug: '/daita/roadmap' },
        { title: 'FAQ', slug: '/daita/faq' },
      ],
    },
  ];

  constructor(private route: ActivatedRoute) {
    this.sections$ = this.route.data.pipe(map((data) => data.sections));
    this.showSidebar$ = this.route.data.pipe(map((data) => !data.hideSidebar));
  }
}
