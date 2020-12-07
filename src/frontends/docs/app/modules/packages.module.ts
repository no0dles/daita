import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { DocsModule } from './docs.module';
import { PackagesRoutingModule } from './packages-routing.module';

@NgModule({
  declarations: [],
  imports: [DocsModule, PackagesRoutingModule],
  bootstrap: [AppComponent],
})
export class PackagesModule {}
