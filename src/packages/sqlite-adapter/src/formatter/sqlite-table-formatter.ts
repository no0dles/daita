import { FormatContext } from '@daita/relational';
import { isTableDescription, TableDescription } from '@daita/relational';
import { FormatHandle, Formatter, FormatType } from '@daita/relational';

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
