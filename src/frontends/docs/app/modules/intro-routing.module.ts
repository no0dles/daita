import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocComponent } from '../components/doc/doc.component';
import { sqliteSections } from '../docs/adapters/sqlite';
import { mariadbSections } from '../docs/adapters/mariadb';
import { websocketSections } from '../docs/adapters/websocket';
import { httpSections } from '../docs/adapters/http';
import { postgresSections } from '../docs/adapters/postgres';
import { aboutSections } from '../docs/intro/about';
import { installationSections } from '../docs/intro/installation';
import { examplesSections } from '../docs/intro/examples';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'about',
      },
      {
        path: 'about',
        component: DocComponent,
        data: {
          sections: aboutSections,
        },
      },
      {
        path: 'examples',
        component: DocComponent,
        data: {
          sections: examplesSections,
        },
      },
      {
        path: 'installation',
        component: DocComponent,
        data: {
          sections: installationSections,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class IntroRoutingModule {}
