import { ArrayMap } from './array-map';
import { RelationalTableDescription } from './relational-table-description';
import { arrayClone } from '@daita/common';
import { Rule, TableDescription } from '@daita/relational';
import { RelationalViewDescription } from './relational-view-description';

export function getTableDescriptionIdentifier(table: TableDescription<any>): string {
  if (table.schema) {
    return `${table.schema}.${table.table}`;
  }
  return table.table;
}

export class RelationalSchemaDescription {
  private readonly tableArrayMap = new ArrayMap<RelationalTableDescription>();
  private readonly viewArrayMap = new ArrayMap<RelationalViewDescription>();
  private readonly rules: Rule[] = [];

  table(key: TableDescription<any>): RelationalTableDescription {
    const identifier = getTableDescriptionIdentifier(key);
    const tableDescription = this.tableArrayMap.get(identifier);
    if (!tableDescription) {
      throw new Error(`Unable to get table ${identifier} from schema`);
    }
    return tableDescription;
  }

  view(key: TableDescription<any>): RelationalViewDescription {
    const identifier = getTableDescriptionIdentifier(key);
    const tableDescription = this.viewArrayMap.get(identifier);
    if (!tableDescription) {
      throw new Error(`Unable to get view ${identifier} from schema`);
    }
    return tableDescription;
  }

  getRules() {
    return [...this.rules];
  }

  addRule(rule: Rule) {
    this.rules.push(rule);
  }

  dropRule(rule: Rule) {
    for (let i = 0; i < this.rules.length; i++) {
      const existingRule = this.rules[i];
      if (JSON.stringify(existingRule) === JSON.stringify(rule)) {
        this.rules.splice(i, 1);
        return;
      }
    }
  }

  get views() {
    return arrayClone(this.viewArrayMap.array);
  }

  get tables() {
    return arrayClone(this.tableArrayMap.array);
  }

  containsTable(key: TableDescription<any>): boolean {
    return this.tableArrayMap.exists(getTableDescriptionIdentifier(key));
  }

  addTable(key: TableDescription<any>, description: RelationalTableDescription) {
    this.tableArrayMap.add(getTableDescriptionIdentifier(key), description);
  }

  addView(key: TableDescription<any>, description: RelationalViewDescription) {
    this.viewArrayMap.add(getTableDescriptionIdentifier(key), description);
  }

  dropView(key: TableDescription<any>) {
    this.viewArrayMap.remove(getTableDescriptionIdentifier(key));
  }

  dropTable(key: TableDescription<any>) {
    this.tableArrayMap.remove(getTableDescriptionIdentifier(key));
  }
}

