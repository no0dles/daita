import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { DocsModule } from './docs.module';
import { IntroRoutingModule } from './intro-routing.module';

@NgModule({
  declarations: [],
  imports: [DocsModule, IntroRoutingModule],
  bootstrap: [AppComponent],
})
export class IntroModule {}
