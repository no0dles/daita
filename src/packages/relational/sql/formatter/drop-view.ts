import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { DropViewSql, isDropViewSql } from '../drop-view-sql';

export class DropViewFormatter implements FormatHandle<DropViewSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isDropViewSql(param);
  }

  handle(param: DropViewSql, ctx: FormatContext, formatter: Formatter): string {
    return `DROP VIEW${param.ifExists ? ' IF EXISTS ' : ' '}${formatter.format(
      param.dropView,
      ctx,
    )}`;
  }
}
