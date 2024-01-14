import { FormatContext, FormatHandle, Formatter, FormatType } from '@daita/relational';
import { isPragmaSql, PragmaSql } from '../sql/pragma-sql';

export class SqlitePragmaFormatter implements FormatHandle<PragmaSql> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isPragmaSql(param);
  }

  handle(param: PragmaSql, ctx: FormatContext, formatter: Formatter): string {
    return `PRAGMA ${ctx.escape(param.pragma)}=${ctx.escape(param.set)}`;
  }
}
