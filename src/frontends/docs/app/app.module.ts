import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { HighlightPlusModule } from 'ngx-highlightjs/plus';
import { SectionComponent } from './section.component';
import { CommonModule } from '@angular/common';
import { SectionSidemenuComponent } from './section-sidemenu.component';

@NgModule({
  declarations: [AppComponent, SectionComponent, SectionSidemenuComponent],
  imports: [BrowserModule, AppRoutingModule, CommonModule, HighlightModule, HighlightPlusModule],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
        // coreLibraryLoader: () => import('highlight.js/lib/core'),
        // lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        // languages: {
        //   typescript: () => import('highlight.js/lib/languages/typescript'),
        // },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
