import { Formatter, FormatterHandler } from './formatter';
import { isSqlUpdate } from '../dml/update/sql-update';
import { FormatContext } from './format-context';

export interface UpdateFormatterOptions {
  updateKeyword: string // "UPDATE";
  setKeyword: string //  "SET";
}

export class UpdateFormatter implements FormatterHandler {

  constructor(private options: UpdateFormatterOptions) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlUpdate(param)) {
      let sql = `${this.options.updateKeyword} ${formatter.format({ table: param.update }, ctx)} ${
        this.options.setKeyword
      } `;

      sql += Object.keys(param.set)
        .map((key) => {
          return `${formatter.format({ escape: key }, ctx)} = ${formatter.format({ value: param.set[key] }, ctx)}`;
        })
        .join(', ');

      sql += formatter.format({ expression: param.where }, ctx);

      return sql;
    }

    return null;
  }
}

