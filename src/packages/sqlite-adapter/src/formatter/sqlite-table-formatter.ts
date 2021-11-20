import { FormatContext } from '@daita/relational/formatter/format-context';
import { isTableDescription, TableDescription } from '@daita/relational/sql/keyword/table/table-description';
import { FormatHandle, Formatter, FormatType } from '@daita/relational/formatter/formatter';

export class SqliteTableFormatter implements FormatHandle<TableDescription<any>> {
  type = FormatType.Table;

  canHandle(param: any): boolean {
    return isTableDescription(param);
  }

  handle(param: TableDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    if (param.schema) {
      return ctx.escape(`${param.schema}-${param.table}`);
    }
    return ctx.escape(param.table);
  }
}
