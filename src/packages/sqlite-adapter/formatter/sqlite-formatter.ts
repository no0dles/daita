import { AlterTableAddColumnFormatter } from '../../relational/sql/ddl/alter-table/alter-table';
import { Formatter } from '../../relational/formatter/formatter';
import { CreateTableFormatter } from '../../relational/sql/ddl/create-table/create-table-formatter';
import { DropTableFormatter } from '../../relational/sql/ddl/drop-table/drop-table';
import { NowFormatter } from '../sql/function/date/now-formatter';
import { SqliteTableFormatter } from './sqlite-table-formatter';
import { ConcatPipeFormatter } from '../../relational/sql/function/string/concat/concat-pipe-formatter';
import { ansiFormatter } from '../../relational/formatter/ansi-formatter';

export const sqliteFormatter = new Formatter();
sqliteFormatter.extend(ansiFormatter);
sqliteFormatter.add(new NowFormatter());
sqliteFormatter.add(new DropTableFormatter());
sqliteFormatter.add(new CreateTableFormatter());
sqliteFormatter.add(new AlterTableAddColumnFormatter());
sqliteFormatter.add(new SqliteTableFormatter());
sqliteFormatter.add(new ConcatPipeFormatter());
