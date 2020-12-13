import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { DocsModule } from './docs.module';
import { ContainersRoutingModule } from './containers-routing.module';

@NgModule({
  declarations: [],
  imports: [DocsModule, ContainersRoutingModule],
  bootstrap: [AppComponent],
})
export class ContainersModule {}
