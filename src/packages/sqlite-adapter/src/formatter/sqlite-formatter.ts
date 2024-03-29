import {
  AlterTableAddColumnFormatter,
  AlterTableDropColumnFormatter,
  AlterTableRenameFormatter,
  CeilRoundFormatter,
  CreateIndexFormatter,
  CreateViewFormatter,
  DropIndexFormatter,
  DropViewFormatter,
} from '@daita/relational';
import { Formatter } from '@daita/relational';
import { CreateTableFormatter } from '@daita/relational';
import { DropTableFormatter } from '@daita/relational';
import { NowFormatter } from '../sql/function/date/now-formatter';
import { SqliteTableFormatter } from './sqlite-table-formatter';
import { ConcatPipeFormatter } from '@daita/relational';
import { ansiFormatter } from '@daita/relational';
import { LeastFormatter } from '@daita/relational';
import { GreatestFormatter } from '@daita/relational';
import { FloorRoundFormatter } from '@daita/relational';
import { SqliteMonthFormatter } from './sqlite-month-formatter';
import { SqliteYearFormatter } from './sqlite-year-formatter';
import { SqliteDayOfYearFormatter } from './sqlite-day-of-year-formatter';
import { SqliteDayOfMonthFormatter } from './sqlite-day-of-month-formatter';
import { SqliteDayOfWeekFormatter } from './sqlite-day-of-week-formatter';
import { SqliteHourFormatter } from './sqlite-hour-formatter';
import { SqliteMinuteFormatter } from './sqlite-minute-formatter';
import { SqliteSecondFormatter } from './sqlite-second-formatter';
import { SqliteWeekOfYearFormatter } from './sqlite-week-of-year-formatter';

export const sqliteFormatter = new Formatter();
sqliteFormatter.extend(ansiFormatter);
sqliteFormatter.add(new NowFormatter());
sqliteFormatter.add(new DropTableFormatter());
sqliteFormatter.add(new CreateTableFormatter());
sqliteFormatter.add(new AlterTableAddColumnFormatter());
sqliteFormatter.add(new AlterTableDropColumnFormatter());
sqliteFormatter.add(new SqliteTableFormatter());
sqliteFormatter.add(new ConcatPipeFormatter());
sqliteFormatter.add(new LeastFormatter());
sqliteFormatter.add(new GreatestFormatter());
sqliteFormatter.add(new CeilRoundFormatter());
sqliteFormatter.add(new FloorRoundFormatter());
sqliteFormatter.add(new SqliteMonthFormatter());
sqliteFormatter.add(new SqliteYearFormatter());
sqliteFormatter.add(new SqliteDayOfYearFormatter());
sqliteFormatter.add(new SqliteDayOfMonthFormatter());
sqliteFormatter.add(new SqliteDayOfWeekFormatter());
sqliteFormatter.add(new SqliteHourFormatter());
sqliteFormatter.add(new SqliteMinuteFormatter());
sqliteFormatter.add(new SqliteSecondFormatter());
sqliteFormatter.add(new SqliteWeekOfYearFormatter());
sqliteFormatter.add(new CreateIndexFormatter());
sqliteFormatter.add(new CreateViewFormatter());
sqliteFormatter.add(new DropViewFormatter());
sqliteFormatter.add(new DropIndexFormatter());
sqliteFormatter.add(new AlterTableRenameFormatter());
// TODO move to better-sqlite3 sqliteFormatter.add(new AlterTableDropColumnFormatter());
