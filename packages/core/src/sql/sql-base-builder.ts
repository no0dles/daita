export class SqlBaseBuilder {

  protected escapeCharacter = '"';
  protected asKeyword = 'AS';

  protected formatSchemaTableField(schema?: string, table?: string, field?: string, alias?: string) {
    let sql = '';
    if (schema) {
      sql += this.escapeSchema(schema);
    }
    if (table) {
      sql += (sql.length > 0 ? '.' : '') + this.escapeTable(table);
    }
    if (field) {
      sql += (sql.length > 0 ? '.' : '') + this.escapeField(field);
    }
    if (alias) {
      sql += ` ${this.asKeyword} ${this.escapeAlias(alias)}`;
    }
    return sql;
  }

  protected escapeAlias(alias: string) {
    return `${this.escapeCharacter}${alias}${this.escapeCharacter}`;
  }

  protected escapeSchema(schema: string) {
    return `${this.escapeCharacter}${schema}${this.escapeCharacter}`;
  }

  protected escapeTable(tableName: string) {
    return `${this.escapeCharacter}${tableName}${this.escapeCharacter}`;
  }

  protected escapeField(fieldName: string) {
    return `${this.escapeCharacter}${fieldName}${this.escapeCharacter}`;
  }
}