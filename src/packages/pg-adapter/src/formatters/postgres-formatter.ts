import { CreateIndexFormatter } from './create-index-formatter';
import { DropIndexFormatter } from './drop-index-formatter';
import { NotifyFormatter } from './notify-formatter';
import { ListenFormatter } from './listen-formatter';
import {
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter,
  AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
} from '@daita/relational';
import { Formatter } from '@daita/relational';
import { CreateTableFormatter } from '@daita/relational';
import { CreateSchemaFormatter } from '@daita/relational';
import { LockTableFormatter } from '@daita/relational';
import { DropTableFormatter } from '@daita/relational';
import { DropViewFormatter } from '@daita/relational';
import { ansiFormatter } from '@daita/relational';
import { NowFormatter } from './now';
import { TableFormatter } from '@daita/relational';
import { ConcatPipeFormatter } from '@daita/relational';
import { CreateViewFormatter } from '@daita/relational';
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
