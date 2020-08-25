import {
  AliasFormatter,
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter,
  AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
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
  ValueFormatter,
  AllFormatter,
  NotEqualFormatter,
  SubSelectFormatter,
  InFormatter,
  IsNullFormatter,
  NotInFormatter,
  AvgFormatter,
  SumFormatter,
  NotBetweenFormatter,
  LikeFormatter,
  ExistsFormatter,
  BetweenFormatter,
  ConcatFormatter,
  GreaterEqualThanFormatter, UpdateFormatter,
  LowerThanFormatter, LowerEqualThanFormatter, MaxFormatter, CreateViewFormatter, DropViewFormatter,
} from '@daita/relational';
import { CreateIndexFormatter } from '../formatters/create-index-formatter';
import { DropIndexFormatter } from '../formatters/drop-index-formatter';
import { NowFormatter } from '../formatters/now';

export const postgresFormatter = new Formatter();
postgresFormatter.add(new AllFormatter());
postgresFormatter.add(new UpdateFormatter());
postgresFormatter.add(new NotEqualFormatter());
postgresFormatter.add(new MaxFormatter());
postgresFormatter.add(new SelectFormatter());
postgresFormatter.add(new SubSelectFormatter());
postgresFormatter.add(new ValueFormatter());
postgresFormatter.add(new SumFormatter());
postgresFormatter.add(new TableFormatter());
postgresFormatter.add(new NotInFormatter());
postgresFormatter.add(new JoinFormatter());
postgresFormatter.add(new AvgFormatter());
postgresFormatter.add(new MinFormatter());
postgresFormatter.add(new IsNullFormatter());
postgresFormatter.add(new FieldFormatter());
postgresFormatter.add(new BetweenFormatter());
postgresFormatter.add(new CountFormatter());
postgresFormatter.add(new OrderByFormatter());
postgresFormatter.add(new EqualFormatter());
postgresFormatter.add(new OrFormatter());
postgresFormatter.add(new AndFormatter());
postgresFormatter.add(new InFormatter());
postgresFormatter.add(new GreaterThanFormatter());
postgresFormatter.add(new GreaterEqualThanFormatter());
postgresFormatter.add(new CreateViewFormatter());
postgresFormatter.add(new DropViewFormatter());
postgresFormatter.add(new LowerThanFormatter());
postgresFormatter.add(new LowerEqualThanFormatter());
postgresFormatter.add(new NowFormatter());
postgresFormatter.add(new ExistsFormatter());
postgresFormatter.add(new AliasFormatter());
postgresFormatter.add(new NotBetweenFormatter());
postgresFormatter.add(new DeleteFormatter());
postgresFormatter.add(new LikeFormatter());
postgresFormatter.add(new ConcatFormatter());
postgresFormatter.add(new LockTableFormatter());
postgresFormatter.add(new DropTableFormatter());
postgresFormatter.add(new InsertFormatter());
postgresFormatter.add(new CreateSchemaFormatter());
postgresFormatter.add(new CreateTableFormatter());
postgresFormatter.add(new AlterTableAddColumnFormatter());
postgresFormatter.add(new AlterTableAddForeignKeyFormatter());
postgresFormatter.add(new AlterTableDropColumnFormatter());
postgresFormatter.add(new AlterTableDropConstraintFormatter());
postgresFormatter.add(new CreateIndexFormatter());
postgresFormatter.add(new DropIndexFormatter());
