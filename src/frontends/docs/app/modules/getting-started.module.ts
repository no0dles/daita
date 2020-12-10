import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { DocsModule } from './docs.module';
import { GettingStartedRoutingModule } from './getting-started-routing.module';

@NgModule({
  declarations: [],
  imports: [DocsModule, GettingStartedRoutingModule],
  bootstrap: [AppComponent],
})
export class GettingStartedModule {}
