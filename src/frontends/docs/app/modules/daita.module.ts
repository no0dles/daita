import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { DocsModule } from './docs.module';
import { DaitaRoutingModule } from './daita-routing.module';

@NgModule({
  declarations: [],
  imports: [DocsModule, DaitaRoutingModule],
  bootstrap: [AppComponent],
})
export class DaitaModule {}
