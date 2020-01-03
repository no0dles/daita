import {RelationalSchema} from '@daita/core';
import { User } from "./models/user";

const schema = new RelationalSchema();

schema.table(User, {key: ['username'] });

export = schema;
