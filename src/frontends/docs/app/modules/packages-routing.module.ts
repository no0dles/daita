import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocComponent } from '../components/doc/doc.component';
import { relationalSections } from '../docs/packages/relational';
import { ormSections } from '../docs/packages/orm';
import { cliSections } from '../docs/packages/cli';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'relational',
      },
      {
        path: 'relational',
        component: DocComponent,
        data: {
          sections: relationalSections,
        },
      },
      {
        path: 'orm',
        component: DocComponent,
        data: {
          sections: ormSections,
        },
      },
      {
        path: 'cli',
        component: DocComponent,
        data: {
          sections: cliSections,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class PackagesRoutingModule {}
