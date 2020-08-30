import { FormatHandle, Formatter, FormatType } from './formatter';
import { FieldDescription, isFieldDescription } from '../description/field';
import { FormatContext } from './format-context';
import { isTableAliasDescription } from '../description/table-alias';

export class FieldFormatter implements FormatHandle<FieldDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isFieldDescription(param);
  }

  handle(
    param: FieldDescription,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    const table = isTableAliasDescription(param.field.table)
      ? ctx.escape(param.field.table.alias.name)
      : formatter.format(param.field.table, ctx);
    return `${table}.${ctx.escape(param.field.key)}`;
  }
}
