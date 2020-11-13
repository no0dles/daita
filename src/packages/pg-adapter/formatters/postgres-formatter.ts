import { CreateIndexFormatter } from './create-index-formatter';
import { DropIndexFormatter } from './drop-index-formatter';
import { NotifyFormatter } from './notify-formatter';
import { ListenFormatter } from './listen-formatter';
import {
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter,
  AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
} from '../../relational/sql/ddl/alter-table/alter-table';
import { Formatter } from '../../relational/formatter/formatter';
import { CreateTableFormatter } from '../../relational/sql/ddl/create-table/create-table-formatter';
import { CreateSchemaFormatter } from '../../relational/sql/ddl/create-schema/create-schema';
import { LockTableFormatter } from '../../relational/sql/ddl/lock-table/lock-table';
import { DropTableFormatter } from '../../relational/sql/ddl/drop-table/drop-table';
import { DropViewFormatter } from '../../relational/sql/ddl/drop-view/drop-view';
import { ansiFormatter } from '../../relational/formatter/ansi-formatter';
import { NowFormatter } from './now';

export const postgresFormatter = new Formatter();
postgresFormatter.extend(ansiFormatter);
postgresFormatter.add(new DropViewFormatter());
postgresFormatter.add(new LockTableFormatter());
postgresFormatter.add(new DropTableFormatter());
postgresFormatter.add(new CreateSchemaFormatter());
postgresFormatter.add(new CreateTableFormatter());
postgresFormatter.add(new AlterTableAddColumnFormatter());
postgresFormatter.add(new AlterTableAddForeignKeyFormatter());
postgresFormatter.add(new AlterTableDropColumnFormatter());
postgresFormatter.add(new AlterTableDropConstraintFormatter());
postgresFormatter.add(new CreateIndexFormatter());
postgresFormatter.add(new DropIndexFormatter());
postgresFormatter.add(new NotifyFormatter());
postgresFormatter.add(new ListenFormatter());
postgresFormatter.add(new NowFormatter());
