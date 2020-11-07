import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { FieldDescription, isFieldDescription } from './field-description';
import { FormatContext } from '../../../formatter/format-context';
import { isTableAliasDescription } from '../../dml/select/table-alias-description';

export class FieldFormatter implements FormatHandle<FieldDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isFieldDescription(param);
  }

  handle(param: FieldDescription, ctx: FormatContext, formatter: Formatter): string {
    const table = isTableAliasDescription(param.field.table)
      ? ctx.escape(param.field.table.alias.name)
      : formatter.format(param.field.table, ctx);
    return `${table}.${ctx.escape(param.field.key)}`;
  }
}
