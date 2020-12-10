import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocComponent } from '../components/doc/doc.component';
import { nodeSqliteSections } from '../docs/getting-started/nodejs-sqlite';
import { nodePostgresSections } from '../docs/getting-started/nodejs-postgres';
import { angularSections } from '../docs/getting-started/angular';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'nodejs-sqlite',
      },
      {
        path: 'nodejs-sqlite',
        component: DocComponent,
        data: {
          sections: nodeSqliteSections,
        },
      },
      {
        path: 'nodejs-postgres',
        component: DocComponent,
        data: {
          sections: nodePostgresSections,
        },
      },
      {
        path: 'angular',
        component: DocComponent,
        data: {
          sections: angularSections,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class GettingStartedRoutingModule {}
