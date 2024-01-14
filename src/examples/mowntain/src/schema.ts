import { RelationalSchema } from '@daita/orm';
import { Ascent } from './models/ascent';
import { AscentPerson } from './models/ascent-person';
import { Canton } from './models/canton';
import { Mountain } from './models/mountain';
import { Person } from './models/person';
import { allow, authorized, now } from '@daita/relational';
import { SqliteSql } from '@daita/sqlite-adapter';

export const schema = new RelationalSchema<SqliteSql>({
  name: 'test-schema',
});

schema.table(Ascent);
schema.table(AscentPerson, {
  key: ['ascentId', 'personId'],
  foreignKeys: {
    ascent: { onDelete: 'cascade' },
    person: { onDelete: 'restrict' },
  },
});
schema.table(Canton, {
  key: ['shortname'],
  columns: {
    shortname: { size: 2 },
  },
});
schema.table(Mountain);
schema.table(Person);
schema.rules([allow(authorized(), { select: now() })]);
