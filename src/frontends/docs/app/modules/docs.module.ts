import { NgModule } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import { SectionComponent } from '../components/section/section.component';
import { SectionSidemenuComponent } from '../components/section-sidemenu/section-sidemenu.component';
import { SnippetComponent } from '../components/snippet/snippet.component';
import { DocComponent } from '../components/doc/doc.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SectionComponent, SectionSidemenuComponent, SnippetComponent, DocComponent],
  imports: [CommonModule, HighlightModule, RouterModule],
  exports: [DocComponent],
})
export class DocsModule {}
