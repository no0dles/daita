import { CreateIndexFormatter } from './create-index-formatter';
import { DropIndexFormatter } from './drop-index-formatter';
import { NotifyFormatter } from './notify-formatter';
import { ListenFormatter } from './listen-formatter';
import {
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter,
  AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
} from '@daita/relational/sql/ddl/alter-table/alter-table';
import { Formatter } from '@daita/relational/formatter/formatter';
import { CreateTableFormatter } from '@daita/relational/sql/ddl/create-table/create-table-formatter';
import { CreateSchemaFormatter } from '@daita/relational/sql/ddl/create-schema/create-schema';
import { LockTableFormatter } from '@daita/relational/sql/ddl/lock-table/lock-table';
import { DropTableFormatter } from '@daita/relational/sql/ddl/drop-table/drop-table';
import { DropViewFormatter } from '@daita/relational/sql/ddl/drop-view/drop-view';
import { ansiFormatter } from '@daita/relational/formatter/ansi-formatter';
import { NowFormatter } from './now';
import { TableFormatter } from '@daita/relational/sql/keyword/table/table-formatter';
import { ConcatPipeFormatter } from '@daita/relational/sql/function/string/concat/concat-pipe-formatter';
import { CreateViewFormatter } from '@daita/relational/sql/ddl/create-view/create-view';
import { GreatestFormatter } from './greatest-formatter';
import { LeastFormatter } from './least-formatter';

export const postgresFormatter = new Formatter();
postgresFormatter.extend(ansiFormatter);
postgresFormatter.add(new DropViewFormatter());
postgresFormatter.add(new LockTableFormatter());
postgresFormatter.add(new DropTableFormatter());
postgresFormatter.add(new CreateSchemaFormatter());
postgresFormatter.add(new GreatestFormatter());
postgresFormatter.add(new LeastFormatter());
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
postgresFormatter.add(new CreateViewFormatter());
postgresFormatter.add(new TableFormatter());
postgresFormatter.add(new ConcatPipeFormatter());
