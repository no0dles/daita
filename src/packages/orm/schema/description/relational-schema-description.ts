import { ArrayMap } from './array-map';
import { RelationalTableDescription } from './relational-table-description';
import { RelationalViewDescription } from './relational-view-description';
import { arrayClone } from '../../../common/utils/array-clone';
import { TableDescription } from '../../../relational/sql/keyword/table/table-description';
import { Rule } from '../../../relational/permission/description/rule';

export function getTableDescriptionIdentifier(table: TableDescription<any>): string {
  if (table.schema) {
    return `${table.schema}.${table.table}`;
  }
  return table.table;
}

export class RelationalSchemaDescription {
  private readonly tableArrayMap = new ArrayMap<RelationalTableDescription>();
  private readonly viewArrayMap = new ArrayMap<RelationalViewDescription>();
  private readonly rulesArrayMap = new ArrayMap<{ id: string; rule: Rule }>();

  constructor(public name: string) {}

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

  get rules() {
    return this.rulesArrayMap.array;
  }

  addRule(id: string, rule: Rule) {
    this.rulesArrayMap.add(id, { id, rule });
  }

  dropRule(ruleId: string) {
    this.rulesArrayMap.remove(ruleId);
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
