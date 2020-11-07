import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { isTableAliasDescription, TableAliasDescription } from '../../dml/select/table-alias-description';
import { FormatContext } from '../../../formatter/format-context';

export class AliasFormatter implements FormatHandle<TableAliasDescription<any>> {
  type = FormatType.Table;

  canHandle(param: any): boolean {
    return isTableAliasDescription(param);
  }

  handle(param: TableAliasDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.alias.table, ctx)} ${ctx.escape(param.alias.name)}`;
  }
}
