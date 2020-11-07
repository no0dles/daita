import { RelationalMapper } from './relational-mapper';
import { failNever } from '../../common/utils/fail-never';
import {
  isTableAliasDescription,
  TableAliasDescription,
} from '../../relational/sql/dml/select/table-alias-description';
import { isSelectSql, SelectSql } from '../../relational/sql/dml/select/select-sql';
import { RelationalSchemaDescription } from '../schema/description/relational-schema-description';
import { FieldDescription, isFieldDescription } from '../../relational/sql/keyword/field/field-description';
import { isTableDescription, TableDescription } from '../../relational/sql/keyword/table/table-description';
import { SourceTableDescription } from '../../relational/sql/dml/select/source-table';

export class RelationalNormalMapper implements RelationalMapper {
  normalizeData<T>(table: TableDescription<T>, data: T[]): T[] {
    return data;
  }

  normalizeSql<T>(sql: T): T {
    return sql;
  }
}

export class RelationalBackwardCompatibleMapper implements RelationalMapper {
  constructor(private schemaDescription: RelationalSchemaDescription) {}

  normalizeSql<T>(sql: T): T {
    if (isSelectSql(sql)) {
      return this.normalizeSelect(sql) as any;
    }

    return sql;
  }

  private normalizeSelect<T>(sql: SelectSql<T>): SelectSql<T> {
    const select = {
      select: this.normalizeSelectFields(sql.select),
    } as SelectSql<any>;

    if (sql.from) {
      select.from = sql.from ? this.normalizeFrom(sql.from) : sql.from;
    }

    if (sql.join) {
      select.join = sql.join;
    }

    if (sql.where) {
      select.where = sql.where;
    }

    if (sql.offset) {
      select.offset = sql.offset;
    }

    if (sql.limit) {
      select.limit = sql.limit;
    }

    if (sql.groupBy) {
      select.groupBy = sql.groupBy;
    }

    if (sql.having) {
      select.having = sql.having;
    }

    if (sql.orderBy) {
      select.orderBy = sql.orderBy;
    }

    return select;
  }

  private normalizeSelectFields(fields: any): any {
    if (typeof fields === 'object') {
      if (isFieldDescription(fields)) {
        return this.normalizeField(fields);
      }

      const normalizedFields: any = {};
      for (const key of Object.keys(fields)) {
        const field = fields[key];
        normalizedFields[key] = this.normalizeSelectFields(field);
      }
      return normalizedFields;
    } else {
      return fields;
    }
  }

  private normalizeField(field: FieldDescription): FieldDescription {
    if (isTableDescription(field.field.table)) {
      const tableDescription = this.schemaDescription.table(field.field.table);
      return {
        field: {
          key: tableDescription.field(field.field.key).name,
          table: this.normalizeTable(field.field.table),
        },
      };
    } else {
      if (isTableDescription(field.field.table.alias.table)) {
        const tableDescription = this.schemaDescription.table(field.field.table.alias.table);
        return {
          field: {
            key: tableDescription.field(field.field.key).name,
            table: {
              alias: {
                name: field.field.table.alias.name,
                table: this.normalizeTable(field.field.table.alias.table),
              },
            },
          },
        };
      } else {
        return {
          field: {
            key: field.field.key,
            table: {
              alias: {
                name: field.field.table.alias.name,
                table: this.normalizeSelect(field.field.table.alias.table),
              },
            },
          },
        };
      }
    }
  }

  private normalizeTableAlias(from: TableAliasDescription<any>): TableAliasDescription<any> {
    if (isTableDescription(from.alias.table)) {
      return {
        alias: {
          name: from.alias.name,
          table: this.normalizeTable(from.alias.table),
        },
      };
    } else {
      return {
        alias: {
          name: from.alias.name,
          table: this.normalizeSelect(from.alias.table),
        },
      };
    }
  }

  private normalizeFrom(from: SourceTableDescription<any>): SourceTableDescription<any> {
    if (isTableDescription(from)) {
      return this.normalizeTable(from);
    } else if (isTableAliasDescription(from)) {
      return this.normalizeTableAlias(from);
    } else if (isSelectSql(from)) {
      return this.normalizeSelect(from);
    } else {
      failNever(from, 'unknown from');
    }
  }

  private normalizeTable(table: TableDescription<any>) {
    const tableDescription = this.schemaDescription.table(table);
    if (table.schema) {
      return { schema: table.schema, table: tableDescription.name };
    } else {
      return { table: tableDescription.name };
    }
  }

  normalizeData<T>(table: TableDescription<T>, data: T[]): T[] {
    //TODO verify all fields for insert
    const tableDescription = this.schemaDescription.table(table);
    const items: any[] = [];

    for (const item of data) {
      const objectKeys = Object.keys(item);
      const object: any = {};
      for (const fieldDescription of tableDescription.fields) {
        const index = objectKeys.indexOf(fieldDescription.key);
        if (index >= 0) {
          objectKeys.splice(index, 1);
          object[fieldDescription.name] = (item as any)[fieldDescription.key];
          fieldDescription.validateValue(object[fieldDescription.name]);
        }
      }

      for (const key of objectKeys) {
        //throw new Error(`Could not find field ${key} in table ${this.table.name}`);
        //warning
      }

      items.push(object);
    }

    return items;
  }
}
