import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { isTableDescription, TableDescription } from './table-description';
import { FormatContext } from '../../../formatter/format-context';

export class TableFormatter implements FormatHandle<TableDescription<any>> {
  type = FormatType.Table;

  canHandle(param: any): boolean {
    return isTableDescription(param);
  }

  handle(param: TableDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    if (param.schema) {
      return `${ctx.escape(param.schema)}.${ctx.escape(param.table)}`;
    }
    return ctx.escape(param.table);
  }
}
