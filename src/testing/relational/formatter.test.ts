import { Sql } from '../../packages/relational/sql/sql';
import { FieldFormatter } from '../../packages/relational/sql/keyword/field/field-formatter';
import {
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter,
  AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
} from '../../packages/relational/sql/ddl/alter-table/alter-table';
import { Formatter } from '../../packages/relational/formatter/formatter';
import { CreateTableFormatter } from '../../packages/relational/sql/ddl/create-table/create-table-formatter';
import { EqualFormatter } from '../../packages/relational/sql/operands/comparison/equal/equal-formatter';
import { GreaterThanFormatter } from '../../packages/relational/sql/operands/comparison/greater-than/greater-than-formatter';
import { JoinFormatter } from '../../packages/relational/sql/dml/select/join/join-formatter';
import { MinFormatter } from '../../packages/relational/sql/function/aggregation/min/min-formatter';
import { DeleteFormatter } from '../../packages/relational/sql/dml/delete/delete-formatter';
import { CounterFormatContext } from '../../packages/relational/formatter/counter-format-context';
import { CreateSchemaFormatter } from '../../packages/relational/sql/ddl/create-schema/create-schema';
import { CountFormatter } from '../../packages/relational/sql/function/aggregation/count/count-formatter';
import { LockTableFormatter } from '../../packages/relational/sql/ddl/lock-table/lock-table';
import { OrderByFormatter } from '../../packages/relational/sql/dml/select/order-by/order-by-formatter';
import { SelectFormatter } from '../../packages/relational/sql/dml/select/select-formatter';
import { InsertFormatter } from '../../packages/relational/sql/dml/insert/insert-formatter';
import { AndFormatter } from '../../packages/relational/sql/keyword/and/and-formatter';
import { TableFormatter } from '../../packages/relational/sql/keyword/table/table-formatter';
import { OrFormatter } from '../../packages/relational/sql/keyword/or/or-formatter';
import { DropTableFormatter } from '../../packages/relational/sql/ddl/drop-table/drop-table';
import { ValueFormatter } from '../../packages/relational/sql/operands/value-formatter';
import { AliasFormatter } from '../../packages/relational/sql/keyword/alias/alias-formatter';
import { AllFormatter } from '../../packages/relational/sql/keyword/all/all-formatter';
import { NotEqualFormatter } from '../../packages/relational/sql/operands/comparison/not-equal/not-equal-formatter';
import { SubSelectFormatter } from '../../packages/relational/sql/dml/select/subquery/sub-select-formatter';
import { IsNullFormatter } from '../../packages/relational/sql/operands/comparison/is-null/is-null-formatter';
import { UpdateFormatter } from '../../packages/relational/sql/dml/update/update-formatter';
import { InFormatter } from '../../packages/relational/sql/operands/comparison/in/in-formatter';

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
