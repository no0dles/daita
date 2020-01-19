import * as uuid from 'uuid';
import * as config from 'config';
import * as schema from './schema';
import {Canton} from './models/canton';
import {Mountain} from './models/mountain';
{{DATA_ADAPTER_IMPORT}}

const connectionString = config.get<string>('daita.context.default.uri');
const adapter = {{DATA_ADAPTER}};
const context = schema.context(adapter);

context.transaction(async (trx) => {
  const cantonId = uuid.v1();
  await trx.insert(Canton)
    .value({
      id: cantonId,
      name: 'Valais',
      shortName: 'VS',
    })
    .exec();

  await trx.insert(Mountain)
    .value({
      id: uuid.v1(),
      name: 'Matterhorn',
      cantonId,
      height: 4478,
    })
    .exec();
}).then(async () => {
  const mountains = await context.select(Mountain)
    .include(m => m.canton)
    .orderBy(m => m.height)
    .limit(10)
    .exec();

  console.log(mountains);
});

