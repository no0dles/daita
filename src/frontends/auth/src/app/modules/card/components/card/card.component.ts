import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnChanges {
  private colors: string[];

  shortName: string;
  color: string;

  @Input()
  name: string;

  @Input()
  description: string;

  @Input()
  link: string;

  constructor() {
    const clrs = ['pink', 'purple', 'orange', 'green', 'blue', 'indigo', 'teal', 'yellow', 'gray', 'red'];
    const sizes = [400, 500, 600, 700, 800];
    this.colors = [];
    for (const clr of clrs) {
      for (const size of sizes) {
        this.colors.push(`bg-${clr}-${size}`);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.name) {
      this.shortName = this.getShortName();
      this.color = this.getColor();
    }
  }

  ngOnInit(): void {
    this.shortName = this.getShortName();
    this.color = this.getColor();
  }

  getColor(): string {
    let value = 0;
    for (let i = 0; i < this.name.length; i++) {
      value += this.name.charCodeAt(i);
    }
    return this.colors[value % this.colors.length];
  }

  getShortName(): string {
    return this.name.toUpperCase()
      .split(' ')
      .map(part => part[0])
      .join('');
  }
}
