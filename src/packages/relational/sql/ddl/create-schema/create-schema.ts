import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { CreateSchemaSql, isCreateSchemaSql } from './create-schema-sql';
import { FormatContext } from '../../../formatter/format-context';

export class CreateSchemaFormatter implements FormatHandle<CreateSchemaSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isCreateSchemaSql(param);
  }

  handle(param: CreateSchemaSql, ctx: FormatContext, formatter: Formatter): string {
    return `CREATE SCHEMA ${param.ifNotExists ? 'IF NOT EXISTS ' : ''}${ctx.escape(param.createSchema)}`;
  }
}
