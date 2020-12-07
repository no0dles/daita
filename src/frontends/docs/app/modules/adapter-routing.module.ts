import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocComponent } from '../components/doc/doc.component';
import { sqliteSections } from '../docs/adapters/sqlite';
import { mariadbSections } from '../docs/adapters/mariadb';
import { websocketSections } from '../docs/adapters/websocket';
import { httpSections } from '../docs/adapters/http';
import { postgresSections } from '../docs/adapters/postgres';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sqlite',
      },
      {
        path: 'sqlite',
        component: DocComponent,
        data: {
          sections: sqliteSections,
        },
      },
      {
        path: 'postgres',
        component: DocComponent,
        data: {
          sections: postgresSections,
        },
      },
      {
        path: 'mariadb',
        component: DocComponent,
        data: {
          sections: mariadbSections,
        },
      },
      {
        path: 'http',
        component: DocComponent,
        data: {
          sections: httpSections,
        },
      },
      {
        path: 'websocket',
        component: DocComponent,
        data: {
          sections: websocketSections,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AdapterRoutingModule {}
