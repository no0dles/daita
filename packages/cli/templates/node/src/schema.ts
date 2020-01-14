import {RelationalSchema} from '@daita/core';
import {Mountain} from './models/mountain';
import {Canton} from './models/canton';

const schema = new RelationalSchema();

schema.table(Mountain);
schema.table(Canton);

schema.rule(Canton, {
  conditions: {
    shortName: {$length: 2},
  }
});

export = schema;
