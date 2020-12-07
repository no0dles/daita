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
import { roadmapSections } from '../docs/daita/roadmap';
import { faqSections } from '../docs/daita/faq';
import { designGoalsSections } from '../docs/daita/design-goals';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'about',
      },
      {
        path: 'design-goals',
        component: DocComponent,
        data: {
          sections: designGoalsSections,
        },
      },
      {
        path: 'faq',
        component: DocComponent,
        data: {
          sections: faqSections,
        },
      },
      {
        path: 'roadmap',
        component: DocComponent,
        data: {
          sections: roadmapSections,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class DaitaRoutingModule {}
