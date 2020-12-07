import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { DocsModule } from './docs.module';
import { AdapterRoutingModule } from './adapter-routing.module';

@NgModule({
  declarations: [],
  imports: [DocsModule, AdapterRoutingModule],
  bootstrap: [AppComponent],
})
export class AdapterModule {}
