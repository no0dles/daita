import { Component, Input, OnInit } from '@angular/core';
import { Snippet, SnippetSourceCode } from '../../section';

@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.scss'],
})
export class SnippetComponent implements OnInit {
  @Input()
  snippet!: Snippet;

  selectedSourceCode: SnippetSourceCode;

  ngOnInit() {
    this.selectedSourceCode = this.snippet.sourceCodes[0];
  }

  select(sourceCode: SnippetSourceCode) {
    this.selectedSourceCode = sourceCode;
  }
}
