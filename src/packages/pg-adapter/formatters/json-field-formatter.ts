import {
  isJsonFieldDescription,
  JsonFieldDescription,
} from '../../relational/sql/keyword/field/json-field-description';
import { FormatContext } from '../../relational/formatter/format-context';
import { isTableAliasDescription } from '../../relational/sql/dml/select/table-alias-description';
import { FormatHandle, Formatter, FormatType } from '../../relational/formatter/formatter';

export class JsonFieldFormatter implements FormatHandle<JsonFieldDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isJsonFieldDescription(param);
  }

  handle(param: JsonFieldDescription, ctx: FormatContext, formatter: Formatter): string {
    const table = isTableAliasDescription(param.jsonField.table)
      ? ctx.escape(param.jsonField.table.alias.name)
      : formatter.format(param.jsonField.table, ctx);
    const firstArg = param.jsonField.keys[0];
    const lastArg = param.jsonField.keys[param.jsonField.keys.length - 1];
    return `${table}.${ctx.escape(firstArg)} ${param.jsonField.keys
      .slice(1, param.jsonField.keys.length - 2)
      .join(' -> ')} ->> '${lastArg}'`;
  }
}
