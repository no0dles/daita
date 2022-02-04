import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocComponent } from '../components/doc/doc.component';
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
