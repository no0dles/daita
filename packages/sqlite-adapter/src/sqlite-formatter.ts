import {
  AliasFormatter,
  AlterTableAddColumnFormatter,
  AndFormatter,
  CountFormatter,
  CreateSchemaFormatter,
  CreateTableFormatter,
  DeleteFormatter,
  DropTableFormatter,
  EqualFormatter,
  FieldFormatter,
  Formatter,
  GreaterThanFormatter,
  InsertFormatter,
  JoinFormatter,
  LockTableFormatter,
  MinFormatter,
  OrderByFormatter,
  OrFormatter,
  SelectFormatter,
  TableFormatter,
  IsNullFormatter,
  NotBetweenFormatter,
  SumFormatter,
  ValueFormatter,
  NotEqualFormatter,
  AllFormatter,
  NotInFormatter,
  AvgFormatter,
  InFormatter,
  LikeFormatter,
  ExistsFormatter,
  BetweenFormatter,
  ConcatFormatter,
  GreaterEqualThanFormatter,
  LowerThanFormatter, UpdateFormatter,
  LowerEqualThanFormatter, SubSelectFormatter, MaxFormatter,
} from '@daita/relational';
import { NowFormatter } from './formatters/now-formatter';

export const sqliteFormatter = new Formatter();
sqliteFormatter.add(new SelectFormatter());
sqliteFormatter.add(new UpdateFormatter());
sqliteFormatter.add(new SubSelectFormatter());
sqliteFormatter.add(new ValueFormatter());
sqliteFormatter.add(new MaxFormatter());
sqliteFormatter.add(new NotBetweenFormatter());
sqliteFormatter.add(new AllFormatter())
sqliteFormatter.add(new AvgFormatter());
sqliteFormatter.add(new TableFormatter());
sqliteFormatter.add(new NotInFormatter());
sqliteFormatter.add(new SumFormatter());
sqliteFormatter.add(new JoinFormatter());
sqliteFormatter.add(new MinFormatter());
sqliteFormatter.add(new InFormatter());
sqliteFormatter.add(new LikeFormatter());
sqliteFormatter.add(new IsNullFormatter());
sqliteFormatter.add(new FieldFormatter());
sqliteFormatter.add(new NotEqualFormatter());
sqliteFormatter.add(new CountFormatter());
sqliteFormatter.add(new OrderByFormatter());
sqliteFormatter.add(new EqualFormatter());
sqliteFormatter.add(new OrFormatter());
sqliteFormatter.add(new AndFormatter());
sqliteFormatter.add(new NowFormatter());
sqliteFormatter.add(new ExistsFormatter());
sqliteFormatter.add(new BetweenFormatter());
sqliteFormatter.add(new ConcatFormatter());
sqliteFormatter.add(new GreaterThanFormatter());
sqliteFormatter.add(new GreaterEqualThanFormatter());
sqliteFormatter.add(new LowerThanFormatter());
sqliteFormatter.add(new LowerEqualThanFormatter());
sqliteFormatter.add(new AliasFormatter());
sqliteFormatter.add(new DeleteFormatter());
sqliteFormatter.add(new LockTableFormatter());
sqliteFormatter.add(new DropTableFormatter());
sqliteFormatter.add(new InsertFormatter());
sqliteFormatter.add(new CreateSchemaFormatter());
sqliteFormatter.add(new CreateTableFormatter());
sqliteFormatter.add(new AlterTableAddColumnFormatter());
