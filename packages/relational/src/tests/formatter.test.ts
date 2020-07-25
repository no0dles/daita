import { Sql } from '../sql/sql';
import { FieldFormatter } from '../sql/formatter/field';
import {
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter, AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
} from '../sql/formatter/alter-table';
import { Formatter } from '../sql/formatter/formatter';
import { CreateTableFormatter } from '../sql/formatter/create-table';
import { EqualFormatter } from '../sql/formatter/equal';
import { GreaterThanFormatter } from '../sql/formatter/greater-than';
import { JoinFormatter } from '../sql/formatter/join';
import { MinFormatter } from '../sql/formatter/min';
import { DeleteFormatter } from '../sql/formatter/delete';
import { CounterFormatContext } from '../sql/formatter/counter-format-context';
import { CreateSchemaFormatter } from '../sql/formatter/create-schema';
import { CountFormatter } from '../sql/formatter/count';
import { LockTableFormatter } from '../sql/formatter/lock-table';
import { OrderByFormatter } from '../sql/formatter/order-by';
import { SelectFormatter } from '../sql/formatter/select';
import { InsertFormatter } from '../sql/formatter/insert';
import { AndFormatter } from '../sql/formatter/and';
import { TableFormatter } from '../sql/formatter/table';
import { OrFormatter } from '../sql/formatter/or';
import { DropTableFormatter } from '../sql/formatter/drop-table';
import { ValueFormatter } from '../sql/formatter/value';
import { AliasFormatter } from '../sql/formatter/alias';
import { AllFormatter } from '../sql/formatter/all';
import { NotEqualFormatter } from '../sql/formatter/not-equal';
import { SubSelectFormatter } from '../sql/formatter/sub-select';
import { InFormatter } from '../sql/formatter';
import { IsNullFormatter } from '../sql/formatter/is-null';
import { UpdateFormatter } from '../sql/formatter/update';

export class TestFormatContext extends CounterFormatContext {
  getDataType(type: string): string {
    return type;
  }
}


export function expectedSql(sql: Sql<any>, expected: string, params?: any[]) {
  const formatter = new Formatter();
  formatter.add(new AllFormatter());
  formatter.add(new NotEqualFormatter());
  formatter.add(new SubSelectFormatter());
  formatter.add(new SelectFormatter());
  formatter.add(new UpdateFormatter());
  formatter.add(new ValueFormatter());
  formatter.add(new InFormatter());
  formatter.add(new TableFormatter());
  formatter.add(new JoinFormatter());
  formatter.add(new MinFormatter());
  formatter.add(new IsNullFormatter());
  formatter.add(new FieldFormatter());
  formatter.add(new CountFormatter());
  formatter.add(new OrderByFormatter());
  formatter.add(new EqualFormatter());
  formatter.add(new OrFormatter());
  formatter.add(new AndFormatter());
  formatter.add(new GreaterThanFormatter());
  formatter.add(new AliasFormatter());
  formatter.add(new DeleteFormatter());
  formatter.add(new LockTableFormatter());
  formatter.add(new DropTableFormatter());
  formatter.add(new InsertFormatter());
  formatter.add(new CreateSchemaFormatter());
  formatter.add(new CreateTableFormatter());
  formatter.add(new AlterTableAddColumnFormatter());
  formatter.add(new AlterTableAddForeignKeyFormatter());
  formatter.add(new AlterTableDropColumnFormatter());
  formatter.add(new AlterTableDropConstraintFormatter());
  const ctx = new TestFormatContext('$');
  const result = formatter.format(sql, ctx);
  expect(result).toBe(expected);
  expect(ctx.getValues()).toEqual(params ?? []);
}
