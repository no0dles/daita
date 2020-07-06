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
  NotEqualFormatter, SubSelectFormatter, InFormatter, IsNullFormatter,
} from '@daita/relational';
import { CreateIndexFormatter } from '../formatters/create-index-formatter';
import { DropIndexFormatter } from '../formatters/drop-index-formatter';

export const postgresFormatter = new Formatter();
postgresFormatter.add(new AllFormatter());
postgresFormatter.add(new NotEqualFormatter());
postgresFormatter.add(new SelectFormatter());
postgresFormatter.add(new SubSelectFormatter());
postgresFormatter.add(new ValueFormatter());
postgresFormatter.add(new TableFormatter());
postgresFormatter.add(new JoinFormatter());
postgresFormatter.add(new MinFormatter());
postgresFormatter.add(new IsNullFormatter());
postgresFormatter.add(new FieldFormatter());
postgresFormatter.add(new CountFormatter());
postgresFormatter.add(new OrderByFormatter());
postgresFormatter.add(new EqualFormatter());
postgresFormatter.add(new OrFormatter());
postgresFormatter.add(new AndFormatter());
postgresFormatter.add(new InFormatter());
postgresFormatter.add(new GreaterThanFormatter());
postgresFormatter.add(new AliasFormatter());
postgresFormatter.add(new DeleteFormatter());
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
