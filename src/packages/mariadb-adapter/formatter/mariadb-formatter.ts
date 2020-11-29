import { AlterTableAddColumnFormatter } from '../../relational/sql/ddl/alter-table/alter-table';
import { Formatter } from '../../relational/formatter/formatter';
import { CreateTableFormatter } from '../../relational/sql/ddl/create-table/create-table-formatter';
import { DropTableFormatter } from '../../relational/sql/ddl/drop-table/drop-table';
import { ansiFormatter } from '../../relational/formatter/ansi-formatter';
import { TableFormatter } from '../../relational/sql/keyword/table/table-formatter';

export const mariadbFormatter = new Formatter();
mariadbFormatter.extend(ansiFormatter);
mariadbFormatter.add(new DropTableFormatter());
mariadbFormatter.add(new CreateTableFormatter());
mariadbFormatter.add(new AlterTableAddColumnFormatter());
mariadbFormatter.add(new TableFormatter());
