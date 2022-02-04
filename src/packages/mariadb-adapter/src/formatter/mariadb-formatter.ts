import {
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter,
  AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
  CeilFormatter,
} from '@daita/relational';
import { Formatter } from '@daita/relational';
import { CreateTableFormatter } from '@daita/relational';
import { DropTableFormatter } from '@daita/relational';
import { ansiFormatter } from '@daita/relational';
import { TableFormatter } from '@daita/relational';
import { CreateSchemaFormatter } from '@daita/relational';
import { NowFormatter } from './now-formatter';
import { ConcatFunctionFormatter } from '@daita/relational';
import { LockTableFormatter } from './lock-table-formatter';
import { LeastFormatter } from '@daita/relational';
import { GreatestFormatter } from '@daita/relational';
import { FloorFormatter } from '@daita/relational';

export const mariadbFormatter = new Formatter();
mariadbFormatter.extend(ansiFormatter);
mariadbFormatter.add(new DropTableFormatter());
mariadbFormatter.add(new CreateTableFormatter());
mariadbFormatter.add(new AlterTableAddColumnFormatter());
mariadbFormatter.add(new TableFormatter());
mariadbFormatter.add(new CreateSchemaFormatter());
mariadbFormatter.add(new NowFormatter());
mariadbFormatter.add(new AlterTableAddForeignKeyFormatter());
mariadbFormatter.add(new AlterTableDropColumnFormatter());
mariadbFormatter.add(new AlterTableDropConstraintFormatter());
mariadbFormatter.add(new ConcatFunctionFormatter());
mariadbFormatter.add(new LockTableFormatter());
mariadbFormatter.add(new LeastFormatter());
mariadbFormatter.add(new GreatestFormatter());
mariadbFormatter.add(new CeilFormatter());
mariadbFormatter.add(new FloorFormatter());
