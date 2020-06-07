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
  ValueFormatter,
} from '@daita/relational';

export const sqliteFormatter = new Formatter();
sqliteFormatter.add(new SelectFormatter());
sqliteFormatter.add(new ValueFormatter());
sqliteFormatter.add(new TableFormatter());
sqliteFormatter.add(new JoinFormatter());
sqliteFormatter.add(new MinFormatter());
sqliteFormatter.add(new FieldFormatter());
sqliteFormatter.add(new CountFormatter());
sqliteFormatter.add(new OrderByFormatter());
sqliteFormatter.add(new EqualFormatter());
sqliteFormatter.add(new OrFormatter());
sqliteFormatter.add(new AndFormatter());
sqliteFormatter.add(new GreaterThanFormatter());
sqliteFormatter.add(new AliasFormatter());
sqliteFormatter.add(new DeleteFormatter());
sqliteFormatter.add(new LockTableFormatter());
sqliteFormatter.add(new DropTableFormatter());
sqliteFormatter.add(new InsertFormatter());
sqliteFormatter.add(new CreateSchemaFormatter());
sqliteFormatter.add(new CreateTableFormatter());
sqliteFormatter.add(new AlterTableAddColumnFormatter());
