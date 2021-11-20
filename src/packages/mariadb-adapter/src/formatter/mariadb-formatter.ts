import {
  AlterTableAddColumnFormatter,
  AlterTableAddForeignKeyFormatter,
  AlterTableDropColumnFormatter,
  AlterTableDropConstraintFormatter,
} from '@daita/relational/sql/ddl/alter-table/alter-table';
import { Formatter } from '@daita/relational/formatter/formatter';
import { CreateTableFormatter } from '@daita/relational/sql/ddl/create-table/create-table-formatter';
import { DropTableFormatter } from '@daita/relational/sql/ddl/drop-table/drop-table';
import { ansiFormatter } from '@daita/relational/formatter/ansi-formatter';
import { TableFormatter } from '@daita/relational/sql/keyword/table/table-formatter';
import { CreateSchemaFormatter } from '@daita/relational/sql/ddl/create-schema/create-schema';
import { NowFormatter } from './now-formatter';
import { ConcatFunctionFormatter } from '@daita/relational/sql/function/string/concat/concat-fn-formatter';
import { LockTableFormatter } from './lock-table-formatter';
import { LeastFormatter } from '@daita/relational/sql/function/conditional/least/least-formatter';
import { GreatestFormatter } from '@daita/relational/sql/function/conditional/greatest/greatest-formatter';

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
