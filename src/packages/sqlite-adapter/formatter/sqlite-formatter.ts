import { AlterTableAddColumnFormatter } from '../../relational/sql/ddl/alter-table/alter-table';
import { Formatter } from '../../relational/formatter/formatter';
import { CreateTableFormatter } from '../../relational/sql/ddl/create-table/create-table-formatter';
import { LockTableFormatter } from '../../relational/sql/ddl/lock-table/lock-table';
import { DropTableFormatter } from '../../relational/sql/ddl/drop-table/drop-table';
import { ansiFormatter } from '../../relational/formatter/ansi-formatter';
import { NowFormatter } from '../sql/function/date/now-formatter';

export const sqliteFormatter = new Formatter();
sqliteFormatter.extend(ansiFormatter);
sqliteFormatter.add(new NowFormatter());
sqliteFormatter.add(new LockTableFormatter());
sqliteFormatter.add(new DropTableFormatter());
sqliteFormatter.add(new CreateTableFormatter());
sqliteFormatter.add(new AlterTableAddColumnFormatter());
