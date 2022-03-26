import { NotifyFormatter } from './notify-formatter';
import { ListenFormatter } from './listen-formatter';
import {
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter,
  AlterTableAddPrimaryKeyFormatter,
  AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
  AlterTableRenameFormatter,
  CeilFormatter,
  CreateIndexFormatter,
  DropIndexFormatter,
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
import { FloorFormatter } from '@daita/relational';
import {
  DayOfMonthDatePartFormatter,
  DayOfWeekDatePartFormatter,
  DayOfYearDatePartFormatter,
  HourDatePartFormatter,
  MinuteDatePartFormatter,
  MonthDatePartFormatter,
  SecondDatePartFormatter,
  YearDatePartFormatter,
} from './date-part-formatter';

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
postgresFormatter.add(new AlterTableAddPrimaryKeyFormatter());
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
postgresFormatter.add(new CeilFormatter());
postgresFormatter.add(new FloorFormatter());
postgresFormatter.add(new YearDatePartFormatter());
postgresFormatter.add(new MonthDatePartFormatter());
postgresFormatter.add(new DayOfYearDatePartFormatter());
postgresFormatter.add(new DayOfWeekDatePartFormatter());
postgresFormatter.add(new DayOfMonthDatePartFormatter());
postgresFormatter.add(new HourDatePartFormatter());
postgresFormatter.add(new MinuteDatePartFormatter());
postgresFormatter.add(new SecondDatePartFormatter());
postgresFormatter.add(new AlterTableRenameFormatter());
