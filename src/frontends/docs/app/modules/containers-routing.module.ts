import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocComponent } from '../components/doc/doc.component';
import { authContainerSections } from '../docs/containers/auth-server';
import { httpContainerSections } from '../docs/containers/http-server';
import { websocketContainerSections } from '../docs/containers/websocket-server';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'http',
      },
      {
        path: 'http',
        component: DocComponent,
        data: {
          sections: httpContainerSections,
        },
      },
      {
        path: 'auth',
        component: DocComponent,
        data: {
          sections: authContainerSections,
        },
      },
      {
        path: 'websocket',
        component: DocComponent,
        data: {
          sections: websocketContainerSections,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ContainersRoutingModule {}
