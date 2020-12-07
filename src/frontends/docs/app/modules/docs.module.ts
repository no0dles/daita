import { NgModule } from '@angular/core';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { SectionComponent } from '../components/section/section.component';
import { SectionSidemenuComponent } from '../components/section-sidemenu/section-sidemenu.component';
import { SnippetComponent } from '../components/snippet/snippet.component';
import { DocComponent } from '../components/doc/doc.component';
import { CommonModule } from '@angular/common';
import { HighlightPlusModule } from 'ngx-highlightjs/plus';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SectionComponent, SectionSidemenuComponent, SnippetComponent, DocComponent],
  imports: [CommonModule, HighlightModule, HighlightPlusModule, RouterModule],
  exports: [DocComponent],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          sql: () => import('highlight.js/lib/languages/sql'),
        },
      },
    },
  ],
})
export class DocsModule {}
