import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HighlightModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        //lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          sql: () => import('highlight.js/lib/languages/sql'),
          bash: () => import('highlight.js/lib/languages/bash'),
        },
      },
    },
  ],
})
export class AppModule {}
