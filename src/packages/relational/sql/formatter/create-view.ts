import { FormatHandle, Formatter, FormatType } from './formatter';
import { CreateViewSql, isCreateViewSql } from '../create-view-sql';
import { FormatContext } from './format-context';
import { InlineFormatContext } from './inline-format-context';

export class CreateViewFormatter implements FormatHandle<CreateViewSql<any>> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isCreateViewSql(param);
  }

  handle(
    param: CreateViewSql<any>,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `CREATE${
      param.orReplace ? ' OR REPLACE ' : ' '
    }VIEW ${formatter.format(param.createView, ctx)} AS ${formatter.format(
      param.as,
      new InlineFormatContext(ctx),
    )}`;
  }
}